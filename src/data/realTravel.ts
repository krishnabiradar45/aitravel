import type { Activity, DayPlan, GeneratedItinerary } from './mockAI';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

export interface RealLocation {
  displayName: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface RealWeather {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  forecast: { day: string; high: number; low: number; rainProbability: number; condition: string }[];
}

export interface RealTripData {
  location: RealLocation;
  places: Activity[];
  weather: RealWeather;
  route: { distance: number; duration: number } | null;
  source: string;
}

function unavailable(value?: string | number) {
  return value === undefined || value === null || value === '' ? 'Information unavailable' : value;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (value: number) => (value * Math.PI) / 180;
  const a = Math.sin(radians(lat2 - lat1) / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(radians(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function periodFor(index: number) {
  return index % 3 === 0 ? 'morning' : index % 3 === 1 ? 'afternoon' : 'evening';
}

function iconFor(type: Activity['type']) {
  return type === 'restaurant' ? '🍽️' : type === 'transport' ? '🚗' : type === 'activity' ? '🎯' : '📍';
}

function weatherCondition(code: number) {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67 || code >= 80) return 'Rain';
  if (code <= 77) return 'Snow';
  return 'Storm';
}

export async function geocodeLocation(query: string): Promise<RealLocation> {
  const url = `${NOMINATIM_URL}?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Location search is temporarily unavailable.');
  const results = await response.json() as Array<{ display_name: string; lat: string; lon: string; address?: Record<string, string> }>;
  const result = results[0];
  if (!result) throw new Error(`I couldn't verify “${query}” with the available location data.`);
  const address = result.address || {};
  return {
    displayName: result.display_name,
    city: address.city || address.town || address.village || address.municipality || 'Information unavailable',
    state: address.state || address.region || 'Information unavailable',
    country: address.country || 'Information unavailable',
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  };
}

export function extractDestination(query: string) {
  const normalized = query.trim().replace(/\s+/g, ' ');
  const afterOf = normalized.match(/\b(?:of|near|around|to)\s+(.+?)(?:\s+(?:under|within|this weekend|tomorrow|today)\b|[?.]|$)/i)?.[1];
  if (afterOf) return afterOf.trim();
  const cleaned = normalized.replace(/^(plan|find|show|what places can i visit|what can i visit|give me|search for)\b/i, '').replace(/\b(best|near|within|under|this weekend|tomorrow|today)\b.*$/i, '').trim();
  return cleaned || normalized;
}

export async function findNearbyPlaces(location: RealLocation): Promise<Activity[]> {
  const query = `[out:json][timeout:25];(nwr["tourism"~"attraction|museum|hotel|hostel|viewpoint|zoo|theme_park"](around:30000,${location.latitude},${location.longitude});nwr["historic"](around:30000,${location.latitude},${location.longitude});nwr["natural"~"beach|waterfall|peak|wood"](around:30000,${location.latitude},${location.longitude});nwr["amenity"="restaurant"](around:10000,${location.latitude},${location.longitude});nwr["leisure"~"park|nature_reserve|water_park"](around:30000,${location.latitude},${location.longitude}););out center tags;`;
  const response = await fetch(OVERPASS_URL, { method: 'POST', body: query, headers: { 'Content-Type': 'text/plain' } });
  if (!response.ok) throw new Error('Real place search is temporarily unavailable.');
  const data = await response.json() as { elements: Array<{ id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }> };
  const seen = new Set<string>();
  return data.elements.map(element => {
    const tags = element.tags || {};
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    const name = tags.name;
    if (!name || latitude === undefined || longitude === undefined || seen.has(name.toLowerCase())) return null;
    seen.add(name.toLowerCase());
    const isRestaurant = tags.amenity === 'restaurant';
    const isHotel = tags.tourism === 'hotel' || tags.tourism === 'hostel';
    const type: Activity['type'] = isRestaurant ? 'restaurant' : isHotel ? 'activity' : 'attraction';
    const category = isRestaurant ? 'Restaurant' : isHotel ? 'Hotel' : tags.tourism || tags.historic || tags.natural || tags.leisure || 'Place';
    const address = [tags['addr:housenumber'], tags['addr:street'], tags['addr:city'] || location.city, tags['addr:country'] || location.country].filter(Boolean).join(', ');
    return {
      id: `osm-${element.type || 'place'}-${element.id}`,
      name,
      duration: isRestaurant ? '1.5h' : isHotel ? 'Stay' : '2h',
      cost: 0,
      type,
      description: `${category} retrieved from OpenStreetMap.`,
      address: unavailable(address),
      latitude,
      longitude,
      distanceKm: Number(distanceKm(location.latitude, location.longitude, latitude, longitude).toFixed(1)),
      rating: unavailable(),
      reviews: unavailable(),
      openingHours: unavailable(tags.opening_hours),
      phone: unavailable(tags.phone),
      website: tags.website || tags['contact:website'] || '',
      mapUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`,
      image: tags.image || '',
    } satisfies Activity;
  }).filter((place): place is Activity => Boolean(place)).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)).slice(0, 30);
}

export async function getWeather(location: RealLocation): Promise<RealWeather> {
  const url = `${OPEN_METEO_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Weather data is temporarily unavailable.');
  const data = await response.json() as { current: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number }; daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[] } };
  return {
    city: location.city,
    temperature: data.current.temperature_2m,
    condition: weatherCondition(data.current.weather_code),
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    rainProbability: data.daily.precipitation_probability_max[0] || 0,
    forecast: data.daily.time.map((date, index) => ({ day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), high: data.daily.temperature_2m_max[index], low: data.daily.temperature_2m_min[index], rainProbability: data.daily.precipitation_probability_max[index] || 0, condition: weatherCondition(data.daily.weather_code[index]) })),
  };
}

async function getRoute(places: Activity[]) {
  const coordinates = places.filter(place => place.latitude !== undefined && place.longitude !== undefined).slice(0, 6).map(place => `${place.longitude},${place.latitude}`).join(';');
  if (!coordinates) return null;
  try {
    const response = await fetch(`${OSRM_URL}/${coordinates}?overview=false&steps=false`);
    if (!response.ok) return null;
    const data = await response.json() as { routes?: Array<{ distance: number; duration: number }> };
    const route = data.routes?.[0];
    return route ? { distance: route.distance / 1000, duration: route.duration / 60 } : null;
  } catch {
    return null;
  }
}

export async function fetchRealTripData(destination: string): Promise<RealTripData> {
  try {
    const location = await geocodeLocation(destination);
    const [places, weather] = await Promise.all([findNearbyPlaces(location), getWeather(location)]);
    return { location, places, weather, route: await getRoute(places), source: 'OpenStreetMap + Open-Meteo' };
  } catch (error) {
    if (!/goa/i.test(destination)) throw error;
    const location: RealLocation = { displayName: 'Goa, India', city: 'Goa', state: 'Goa', country: 'India', latitude: 15.4909, longitude: 73.8278 };
    const verifiedNames = [
      ['Baga Beach', 15.5557, 73.7517],
      ['Calangute Beach', 15.5441, 73.7554],
      ['Fort Aguada', 15.492, 73.7739],
      ['Basilica of Bom Jesus', 15.5009, 73.9118],
      ['Dudhsagar Falls', 15.3144, 74.3146],
      ['Anjuna Beach', 15.5736, 73.7402],
    ] as const;
    const places = verifiedNames.map(([name, latitude, longitude], index) => ({
      id: `demo-goa-${index}`, name, duration: '2h', cost: 0, type: 'attraction' as const,
      description: 'Verified Goa place included in the offline demo dataset.', address: 'Goa, India', latitude, longitude,
      distanceKm: Number(distanceKm(location.latitude, location.longitude, latitude, longitude).toFixed(1)), rating: 'Information unavailable',
      reviews: 'Information unavailable', openingHours: 'Information unavailable', phone: 'Information unavailable', website: '',
      mapUrl: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`, image: '',
    } satisfies Activity));
    const weather: RealWeather = { city: 'Goa', temperature: 0, condition: 'Information unavailable', humidity: 0, windSpeed: 0, rainProbability: 0, forecast: [] };
    return { location, places, weather, route: null, source: 'Demo Data: verified Goa locations' };
  }
}

export function buildRealItinerary(params: { destination: string; startDate: string; endDate: string; travelers: number; budget: number; travelStyle: string; interests: string[] }, data: RealTripData): GeneratedItinerary {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  const daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
  const usablePlaces = data.places.filter(place => place.type !== 'activity' || place.name).slice(0, Math.max(3, daysCount * 3));
  if (!usablePlaces.length) throw new Error(`I couldn't verify nearby places for ${data.location.displayName}.`);
  const days: DayPlan[] = Array.from({ length: daysCount }, (_, dayIndex) => {
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    const selected = [0, 1, 2].map(slot => usablePlaces[(dayIndex * 3 + slot) % usablePlaces.length]);
    const sections = { morning: [] as Activity[], afternoon: [] as Activity[], evening: [] as Activity[] };
    selected.forEach((place, index) => sections[periodFor(index) as keyof typeof sections].push(place));
    const dayCost = params.travelers * selected.length * 15;
    return { day: dayIndex + 1, date: date.toISOString().split('T')[0], ...sections, restaurants: data.places.filter(place => place.type === 'restaurant').slice(dayIndex % 2, dayIndex % 2 + 2).map(place => place.name), travelTime: data.route ? `${Math.round(data.route.duration / Math.max(1, daysCount))} min route average` : 'Information unavailable', estimatedCost: dayCost };
  });
  return { id: `verified-trip-${Date.now()}`, destination: data.location.displayName, startDate: params.startDate, endDate: params.endDate, days, totalCost: days.reduce((total, day) => total + day.estimatedCost, 0), travelStyle: params.travelStyle, travelers: params.travelers, location: data.location, weather: data.weather, route: data.route, dataSource: data.source, places: data.places };
}

export { iconFor };
