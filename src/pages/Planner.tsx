import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { type GeneratedItinerary, type DayPlan, type Activity } from '../data/mockAI';
import { buildRealItinerary, extractDestination, fetchRealTripData, type RealWeather } from '../data/realTravel';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

const travelStyles = ['Adventure', 'Relaxation', 'Family', 'Luxury', 'Budget', 'Solo'];
const interestOptions = ['Beaches', 'Mountains', 'Food', 'Culture', 'Shopping', 'History', 'Nightlife', 'Wildlife'];
const styleIcons: Record<string, string> = {
  Adventure: '🧗', Relaxation: '🧘', Family: '👨‍👩‍👧', Luxury: '💎', Budget: '💰', Solo: '🎒',
};
const interestIcons: Record<string, string> = {
  Beaches: '🏖️', Mountains: '⛰️', Food: '🍜', Culture: '🎭', Shopping: '🛍️', History: '🏛️', Nightlife: '🌃', Wildlife: '🦁',
};

function WeatherCard({ weather }: { weather?: RealWeather }) {
  if (!weather) return <p className="p-6 text-[#6B6560]">Information unavailable</p>;
  if (!weather.forecast.length) return <div className="p-5 text-sm text-[#6B6560] dark:text-[#9A9690]">Weather unavailable in Demo Data mode.</div>;
  const hasBadWeather = weather.forecast.some(f => f.rainProbability >= 50);

  return (
    <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] overflow-hidden">
      <div className="bg-gradient-to-r from-[#1F3A5F] to-[#2d5280] text-white p-5">
        <p className="text-sm text-white/70 mb-1">Live weather in {weather.city}</p>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{weather.condition.includes('Rain') ? '🌧️' : '☀️'}</span>
          <div>
            <p className="text-4xl font-bold">{Math.round(weather.temperature)}°C</p>
            <p className="text-white/80">{weather.condition}</p>
          </div>
          <div className="ml-auto text-right text-sm text-white/70 space-y-1">
            <p>💧 {weather.humidity}%</p>
            <p>💨 {Math.round(weather.windSpeed)} km/h</p>
            <p>🌧️ {weather.rainProbability}% rain</p>
          </div>
        </div>
      </div>
      {hasBadWeather && (
        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm flex items-center gap-2">
          ⚠️ Rain expected on some days — indoor alternatives included in your itinerary!
        </div>
      )}
      <div className="p-4 grid grid-cols-5 gap-2">
        {weather.forecast.map(f => (
          <div key={f.day} className="text-center">
            <p className="text-xs font-medium text-[#6B6560] dark:text-[#9A9690]">{f.day}</p>
            <span className="text-xl block my-1">{f.condition.includes('Rain') ? '🌧️' : '☀️'}</span>
            <p className="text-xs font-semibold text-[#0D0D0D] dark:text-white">{Math.round(f.high)}°</p>
            <p className="text-xs text-[#9A9690]">{Math.round(f.low)}° · {f.rainProbability}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  activity,
  onRemove,
  onEdit,
}: {
  activity: Activity;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const typeColors: Record<string, string> = {
    attraction: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    restaurant: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
    activity: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    transport: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
  };
  const typeIcons: Record<string, string> = { attraction: '📍', restaurant: '🍽️', activity: '🎯', transport: '🚗' };

  return (
    <div className="flex items-start gap-3 p-3 bg-[#F0EEEA] dark:bg-[#252720] rounded-xl group">
      <span className="text-lg mt-0.5">{typeIcons[activity.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm text-[#0D0D0D] dark:text-white">{activity.name}</p>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button onClick={onEdit} className="text-xs px-2 py-0.5 rounded bg-[#1F3A5F]/10 dark:bg-[#7BAFD4]/20 text-[#1F3A5F] dark:text-[#7BAFD4] hover:bg-[#1F3A5F]/20 transition-colors">Edit</button>
            <button onClick={onRemove} className="text-xs px-2 py-0.5 rounded bg-[#C8472A]/10 text-[#C8472A] hover:bg-[#C8472A]/20 transition-colors">✕</button>
          </div>
        </div>
        <p className="text-xs text-[#6B6560] dark:text-[#9A9690] mt-0.5 line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[activity.type]}`}>{activity.type}</span>
          <span className="text-[10px] text-[#9A9690]">⏱ {activity.duration}</span>
          {activity.distanceKm !== undefined && <span className="text-[10px] text-[#9A9690]">📍 {activity.distanceKm} km</span>}
        </div>
        <p className="text-[10px] text-[#9A9690] mt-1">{activity.address || 'Information unavailable'} · ⭐ {activity.rating || 'Information unavailable'}</p>
        <div className="flex gap-3 mt-2 text-[10px] font-semibold">
          {activity.mapUrl && <a href={activity.mapUrl} target="_blank" rel="noreferrer" className="text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline">View on Map</a>}
          {activity.latitude !== undefined && activity.longitude !== undefined && <a href={`https://www.google.com/maps/dir/?api=1&destination=${activity.latitude},${activity.longitude}`} target="_blank" rel="noreferrer" className="text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline">Get Directions</a>}
          {activity.website && <a href={activity.website} target="_blank" rel="noreferrer" className="text-[#C8472A] hover:underline">Website</a>}
          <span className="text-[#9A9690]">Hours: {activity.openingHours || 'Information unavailable'}</span>
        </div>
      </div>
    </div>
  );
}

function RealMap({ itinerary }: { itinerary: GeneratedItinerary }) {
  const places = itinerary.places || itinerary.days.flatMap(day => [...day.morning, ...day.afternoon, ...day.evening]);
  const location = itinerary.location;
  if (!location) return null;
  return (
    <div className="h-[360px] rounded-2xl overflow-hidden border border-[#D4D0C8] dark:border-[#2E302B]">
      <MapContainer center={[location.latitude, location.longitude]} zoom={10} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[location.latitude, location.longitude]} icon={markerIcon}>
          <Popup><strong>{location.city}</strong><br />{location.state}, {location.country}<br />Destination center</Popup>
        </Marker>
        {places.filter(place => place.latitude !== undefined && place.longitude !== undefined).map(place => (
          <Marker key={place.id} position={[place.latitude!, place.longitude!]} icon={markerIcon}>
            <Popup><strong>{place.name}</strong><br />{place.address || 'Information unavailable'}<br />Rating: {place.rating || 'Information unavailable'}<br /><a href={place.mapUrl} target="_blank" rel="noreferrer">Open map details</a></Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function DayCard({
  day,
  onRemoveActivity,
  onRegenerateDay,
  onAddActivity,
}: {
  day: DayPlan;
  onRemoveActivity: (period: 'morning' | 'afternoon' | 'evening', id: string) => void;
  onRegenerateDay: (dayNum: number) => void;
  onAddActivity: (dayNum: number, period: 'morning' | 'afternoon' | 'evening') => void;
}) {
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => { setRegenerating(false); onRegenerateDay(day.day); }, 1500);
  };

  const dateStr = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] overflow-hidden">
      {/* Day header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#F0EEEA] dark:bg-[#252720] border-b border-[#D4D0C8] dark:border-[#2E302B]">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-sm font-bold">{day.day}</span>
            <div>
              <p className="font-serif font-bold text-[#0D0D0D] dark:text-white">Day {day.day}</p>
              <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">{dateStr}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[#1F3A5F] dark:text-[#7BAFD4] font-semibold">${day.estimatedCost}</span>
          <span className="text-xs text-[#9A9690]">⏱ {day.travelTime}</span>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F] hover:text-[#1F3A5F] dark:hover:text-[#7BAFD4] transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {regenerating ? <span className="animate-spin">⟳</span> : '⟳'} {regenerating ? 'AI thinking...' : 'Regenerate'}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {(['morning', 'afternoon', 'evening'] as const).map(period => (
          <div key={period}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6560] dark:text-[#9A9690] flex items-center gap-2">
                <span>{period === 'morning' ? '🌅' : period === 'afternoon' ? '☀️' : '🌙'}</span>
                {period}
              </h4>
              <button
                onClick={() => onAddActivity(day.day, period)}
                className="text-xs text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline"
              >
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {day[period].map(act => (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  onRemove={() => onRemoveActivity(period, act.id)}
                  onEdit={() => {}}
                />
              ))}
              {day[period].length === 0 && (
                <p className="text-xs text-[#9A9690] italic px-3">No activities planned. <button onClick={() => onAddActivity(day.day, period)} className="text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline">Add one</button></p>
              )}
            </div>
          </div>
        ))}

        {/* Restaurants */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6560] dark:text-[#9A9690] mb-2 flex items-center gap-2">
            <span>🍽️</span> Recommended Restaurants
          </h4>
          <div className="flex flex-wrap gap-2">
            {day.restaurants.map(r => (
              <span key={r} className="text-xs px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-full">{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Planner() {
  const { currentItinerary, setCurrentItinerary, saveTrip, showToast, plannerDestination, setPlannerDestination } = useApp();
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'itinerary' | 'weather' | 'budget'>('form');
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(currentItinerary);

  const [form, setForm] = useState({
    destination: plannerDestination || '',
    from: 'Bengaluru, India',
    startDate: '2026-10-15',
    endDate: '2026-10-19',
    travelers: 2,
    budget: 1500,
    style: 'Adventure',
    interests: ['Mountains', 'Food'] as string[],
  });

  useEffect(() => {
    if (plannerDestination) setForm(f => ({ ...f, destination: plannerDestination }));
  }, [plannerDestination]);

  const toggleInterest = (i: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
    }));
  };

  const handleGenerate = async () => {
    if (!form.destination) { showToast('Please enter a destination.', 'error'); return; }
    setGenerating(true);
    setPlannerDestination(form.destination);
    try {
      const destinationQuery = extractDestination(form.destination);
      const realData = await fetchRealTripData(destinationQuery);
      const result = buildRealItinerary({ ...form, travelStyle: form.style }, realData);
      setItinerary(result);
      setCurrentItinerary(result);
      setActiveTab('itinerary');
      showToast(`Verified itinerary ready for ${realData.location.city}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'I could not verify this destination with available data.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleRemoveActivity = (dayNum: number, period: 'morning' | 'afternoon' | 'evening', actId: string) => {
    if (!itinerary) return;
    setItinerary(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        days: prev.days.map(d => d.day === dayNum ? { ...d, [period]: d[period].filter(a => a.id !== actId) } : d),
      };
    });
    showToast('Activity removed.', 'info');
  };

  const handleRegenerateDay = (dayNum: number) => {
    showToast(`Day ${dayNum} regenerated with new activities!`);
  };

  const handleAddActivity = (dayNum: number, period: string) => {
    showToast(`Add activity to Day ${dayNum} ${period} — feature coming soon!`, 'info');
  };

  const handleSave = () => {
    if (!itinerary) return;
    saveTrip({
      id: itinerary.id,
      destination: itinerary.destination,
      country: 'Destination',
      image: `https://images.unsplash.com/photo-1503079230625-8a7c589a9007?w=400&h=300&fit=crop&auto=format`,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      days: itinerary.days.length,
      budget: itinerary.totalCost,
      currency: 'USD',
      status: 'planned',
      travelers: itinerary.travelers,
      itinerary,
    });
    showToast('Trip saved to My Trips! 🎉');
  };

  // Budget calculations
  const budgetBreakdown = itinerary ? [
    { label: 'Accommodation', pct: 35, color: '#1F3A5F' },
    { label: 'Food & Dining', pct: 25, color: '#C8472A' },
    { label: 'Transport', pct: 15, color: '#2d8a7f' },
    { label: 'Activities', pct: 20, color: '#8B6D3F' },
    { label: 'Shopping & Other', pct: 5, color: '#6B6560' },
  ].map(b => ({ ...b, amount: Math.round(itinerary.totalCost * b.pct / 100) })) : [];

  const tabs = [
    { id: 'form', label: 'Trip Details' },
    { id: 'itinerary', label: 'Itinerary', disabled: !itinerary },
    { id: 'weather', label: 'Weather', disabled: !itinerary },
    { id: 'budget', label: 'Budget', disabled: !itinerary },
  ];

  return (
    <div className="min-h-screen bg-[#F0EEEA] dark:bg-[#111310] pt-16">
      {/* Header */}
      <div className="bg-[#1F3A5F] text-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-[#C8E0F0] uppercase tracking-widest mb-2">AI Trip Planner</p>
          <h1 className="font-serif text-4xl font-bold mb-1">Plan Your Perfect Trip</h1>
          <p className="text-white/70">Tell us your preferences and our AI will craft a personalised itinerary in seconds.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#D4D0C8] dark:border-[#2E302B] bg-white dark:bg-[#1C1E1A] sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
              disabled={tab.disabled}
              className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-[#1F3A5F] text-[#1F3A5F] dark:text-[#7BAFD4] dark:border-[#7BAFD4]'
                  : tab.disabled
                    ? 'border-transparent text-[#9A9690] cursor-not-allowed'
                    : 'border-transparent text-[#6B6560] dark:text-[#9A9690] hover:text-[#0D0D0D] dark:hover:text-white'
                }`}
            >
              {tab.label}
              {tab.id === 'itinerary' && itinerary && <span className="ml-2 text-xs px-1.5 py-0.5 bg-[#1F3A5F] text-white rounded-full">{itinerary.days.length}d</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Form Tab ── */}
        {activeTab === 'form' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">Destination *</label>
                <input
                  type="text"
                  list="location-suggestions"
                  value={form.destination}
                  onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                  placeholder="e.g. Bali, Indonesia"
                  className="w-full px-4 py-3 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] bg-white dark:bg-[#1C1E1A] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
                />
                <datalist id="location-suggestions">
                  {['Bengaluru, India', 'Mumbai, India', 'Delhi, India', 'Goa, India', 'Hyderabad, India', 'Paris, France', 'London, United Kingdom', 'Dubai, United Arab Emirates', 'New York, United States'].map(location => <option key={location} value={location} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">Starting From</label>
                <input
                  type="text"
                  value={form.from}
                  onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                  placeholder="e.g. Bengaluru, India"
                  className="w-full px-4 py-3 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] bg-white dark:bg-[#1C1E1A] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] bg-white dark:bg-[#1C1E1A] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] bg-white dark:bg-[#1C1E1A] text-[#0D0D0D] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">Number of Travellers</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setForm(f => ({ ...f, travelers: Math.max(1, f.travelers - 1) }))}
                    className="w-10 h-10 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] text-[#0D0D0D] dark:text-white hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors font-bold"
                  >−</button>
                  <span className="text-xl font-bold text-[#0D0D0D] dark:text-white w-8 text-center">{form.travelers}</span>
                  <button
                    onClick={() => setForm(f => ({ ...f, travelers: Math.min(20, f.travelers + 1) }))}
                    className="w-10 h-10 rounded-xl border border-[#D4D0C8] dark:border-[#2E302B] text-[#0D0D0D] dark:text-white hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors font-bold"
                  >+</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-2">
                  Total Budget: <span className="text-[#1F3A5F] dark:text-[#7BAFD4]">${form.budget.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={200}
                  max={20000}
                  step={100}
                  value={form.budget}
                  onChange={e => setForm(f => ({ ...f, budget: Number(e.target.value) }))}
                  className="w-full accent-[#1F3A5F]"
                />
                <div className="flex justify-between text-xs text-[#9A9690] mt-1">
                  <span>$200</span><span>$20,000</span>
                </div>
              </div>
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-3">Travel Style</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {travelStyles.map(s => (
                  <button
                    key={s}
                    onClick={() => setForm(f => ({ ...f, style: s }))}
                    className={`p-3 rounded-xl border text-center text-sm font-medium transition-all
                      ${form.style === s
                        ? 'border-[#1F3A5F] bg-[#1F3A5F] text-white'
                        : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F] dark:hover:border-[#7BAFD4]'
                      }`}
                  >
                    <span className="text-xl block mb-1">{styleIcons[s]}</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-semibold text-[#0D0D0D] dark:text-white mb-3">Interests (select all that apply)</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {interestOptions.map(i => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`p-3 rounded-xl border text-center text-xs font-medium transition-all
                      ${form.interests.includes(i)
                        ? 'border-[#C8472A] bg-[#C8472A] text-white'
                        : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#C8472A]'
                      }`}
                  >
                    <span className="text-lg block mb-1">{interestIcons[i]}</span>
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-[#1F3A5F] hover:bg-[#2d5280] text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {generating ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is crafting your itinerary...
                </>
              ) : (
                <>🤖 Generate AI Itinerary</>
              )}
            </button>
          </div>
        )}

        {/* ── Itinerary Tab ── */}
        {activeTab === 'itinerary' && itinerary && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary bar */}
            <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-5 flex flex-wrap gap-4 items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0D0D0D] dark:text-white">{itinerary.destination}</h2>
                <p className="text-sm text-[#6B6560] dark:text-[#9A9690]">
                  {new Date(itinerary.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                  {new Date(itinerary.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {' · '}{itinerary.days.length} days{' · '}{itinerary.travelers} traveller{itinerary.travelers > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveTab('form')} className="px-4 py-2 border border-[#D4D0C8] dark:border-[#2E302B] rounded-xl text-sm font-medium text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F] transition-colors">
                  Edit Details
                </button>
                <button onClick={handleSave} className="px-4 py-2 bg-[#1F3A5F] text-white rounded-xl text-sm font-semibold hover:bg-[#2d5280] transition-colors">
                  💾 Save Trip
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#C8472A] font-semibold">Verified location</p>
                  <p className="font-semibold text-[#0D0D0D] dark:text-white">{itinerary.location?.city}, {itinerary.location?.state}, {itinerary.location?.country}</p>
                  <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">{itinerary.location?.latitude.toFixed(4)}, {itinerary.location?.longitude.toFixed(4)} · Source: {itinerary.dataSource}</p>
                </div>
                <div className="text-right text-sm text-[#6B6560] dark:text-[#9A9690]">
                  <p>Route: {itinerary.route ? `${itinerary.route.distance.toFixed(1)} km · ${Math.round(itinerary.route.duration)} min driving` : 'Information unavailable'}</p>
                  <p>Real places found: {itinerary.places?.length || 0}</p>
                </div>
              </div>
              <RealMap itinerary={itinerary} />
            </div>

            {itinerary.days.map(day => (
              <DayCard
                key={day.day}
                day={day}
                onRemoveActivity={(period, actId) => handleRemoveActivity(day.day, period, actId)}
                onRegenerateDay={handleRegenerateDay}
                onAddActivity={handleAddActivity}
              />
            ))}

            <button onClick={handleSave} className="w-full py-4 bg-[#C8472A] hover:bg-[#a83820] text-white rounded-xl font-bold text-base transition-colors">
              💾 Save This Itinerary
            </button>
          </div>
        )}

        {/* ── Weather Tab ── */}
        {activeTab === 'weather' && itinerary && (
          <div className="animate-fade-in">
            <WeatherCard weather={itinerary.weather} />
          </div>
        )}

        {/* ── Budget Tab ── */}
        {activeTab === 'budget' && itinerary && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-[#0D0D0D] dark:text-white">Budget Planner</h2>
                <div className="text-right">
                  <p className="text-sm text-[#6B6560] dark:text-[#9A9690]">Total Estimated</p>
                  <p className="font-serif text-3xl font-bold text-[#1F3A5F] dark:text-[#7BAFD4]">${itinerary.totalCost.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-4">
                {budgetBreakdown.map(b => (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#0D0D0D] dark:text-white">{b.label}</span>
                      <span className="text-[#6B6560] dark:text-[#9A9690]">${b.amount} <span className="text-xs">({b.pct}%)</span></span>
                    </div>
                    <div className="h-3 bg-[#F0EEEA] dark:bg-[#252720] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${b.pct}%`, backgroundColor: b.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#D4D0C8] dark:border-[#2E302B]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#6B6560] dark:text-[#9A9690]">Your Budget</p>
                    <p className="font-bold text-xl text-[#0D0D0D] dark:text-white">${form.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6560] dark:text-[#9A9690]">Estimated Cost</p>
                    <p className="font-bold text-xl text-[#1F3A5F] dark:text-[#7BAFD4]">${itinerary.totalCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B6560] dark:text-[#9A9690]">Remaining</p>
                    <p className={`font-bold text-xl ${form.budget - itinerary.totalCost >= 0 ? 'text-green-600 dark:text-green-400' : 'text-[#C8472A]'}`}>
                      ${Math.abs(form.budget - itinerary.totalCost).toLocaleString()}
                      {form.budget - itinerary.totalCost < 0 ? ' over' : ''}
                    </p>
                  </div>
                </div>
                {/* Budget bar */}
                <div className="mt-4 h-3 bg-[#F0EEEA] dark:bg-[#252720] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (itinerary.totalCost / form.budget) * 100)}%`,
                      backgroundColor: itinerary.totalCost > form.budget ? '#C8472A' : '#1F3A5F',
                    }}
                  />
                </div>
                <p className="text-xs text-[#9A9690] mt-1 text-right">
                  {Math.round((itinerary.totalCost / form.budget) * 100)}% of budget used
                </p>
              </div>
            </div>

            {/* Per day breakdown */}
            <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-6">
              <h3 className="font-semibold text-[#0D0D0D] dark:text-white mb-4">Daily Cost Breakdown</h3>
              <div className="space-y-3">
                {itinerary.days.map(d => (
                  <div key={d.day} className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-[#6B6560] dark:text-[#9A9690] w-12">Day {d.day}</span>
                    <div className="flex-1 h-6 bg-[#F0EEEA] dark:bg-[#252720] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1F3A5F] flex items-center justify-end pr-2 transition-all"
                        style={{ width: `${Math.min(100, (d.estimatedCost / (itinerary.totalCost / itinerary.days.length * 1.5)) * 100)}%` }}
                      >
                        <span className="text-[10px] text-white font-semibold">${d.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
