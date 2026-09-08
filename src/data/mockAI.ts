export interface Activity {
  id: string;
  name: string;
  duration: string;
  cost: number;
  type: 'attraction' | 'restaurant' | 'activity' | 'transport';
  description: string;
  address?: string | number;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  rating?: string | number;
  reviews?: string | number;
  openingHours?: string | number;
  phone?: string | number;
  website?: string;
  mapUrl?: string;
  image?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  restaurants: string[];
  travelTime: string;
  estimatedCost: number;
}

export interface GeneratedItinerary {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: DayPlan[];
  totalCost: number;
  travelStyle: string;
  travelers: number;
  location?: import('./realTravel').RealLocation;
  weather?: import('./realTravel').RealWeather;
  route?: { distance: number; duration: number } | null;
  dataSource?: string;
  places?: Activity[];
}

const activityDB: Record<string, { morning: Activity[]; afternoon: Activity[]; evening: Activity[] }> = {
  bali: {
    morning: [
      { id: 'b1', name: 'Sunrise at Mount Batur', duration: '4h', cost: 45, type: 'activity', description: 'Trek to the volcanic summit for a breathtaking sunrise above the clouds.' },
      { id: 'b2', name: 'Tegallalang Rice Terraces', duration: '2h', cost: 5, type: 'attraction', description: 'Iconic UNESCO rice terraces with Instagram-worthy views and jungle swings.' },
      { id: 'b3', name: 'Tanah Lot Temple', duration: '2h', cost: 4, type: 'attraction', description: 'Ancient sea temple perched on a rocky outcrop — magical at low tide.' },
    ],
    afternoon: [
      { id: 'b4', name: 'Ubud Monkey Forest', duration: '2h', cost: 7, type: 'attraction', description: 'Sacred nature reserve with 700+ Balinese long-tailed macaques.' },
      { id: 'b5', name: 'Traditional Balinese Cooking Class', duration: '3h', cost: 35, type: 'activity', description: 'Learn to make satay, rendang, and lawar from a local chef.' },
      { id: 'b6', name: 'Seminyak Beach & Surf Lesson', duration: '3h', cost: 30, type: 'activity', description: 'Surf lesson on one of Bali\'s most beautiful beaches.' },
    ],
    evening: [
      { id: 'b7', name: 'Kecak Fire Dance at Uluwatu', duration: '2h', cost: 10, type: 'activity', description: 'Dramatic traditional Balinese performance atop a clifftop temple.' },
      { id: 'b8', name: 'Seminyak Sunset Drinks', duration: '2h', cost: 20, type: 'activity', description: 'Rooftop cocktails overlooking the Indian Ocean at golden hour.' },
      { id: 'b9', name: 'Night Market at Gianyar', duration: '2h', cost: 12, type: 'activity', description: 'Local night market with dozens of traditional Balinese street food stalls.' },
    ],
  },
  paris: {
    morning: [
      { id: 'p1', name: 'Eiffel Tower at Dawn', duration: '2h', cost: 28, type: 'attraction', description: 'Skip the crowds with an early morning visit to the iron lady.' },
      { id: 'p2', name: 'Louvre Museum', duration: '3h', cost: 17, type: 'attraction', description: 'World\'s largest art museum — home to the Mona Lisa and 35,000+ works.' },
      { id: 'p3', name: 'Montmartre Walk', duration: '2h', cost: 0, type: 'activity', description: 'Bohemian hilltop neighbourhood with Sacré-Cœur and artists\' ateliers.' },
    ],
    afternoon: [
      { id: 'p4', name: 'Seine River Cruise', duration: '1.5h', cost: 16, type: 'activity', description: 'Bateaux Mouches cruise past Notre-Dame, the Musée d\'Orsay, and Pont Neuf.' },
      { id: 'p5', name: 'Musée d\'Orsay', duration: '2h', cost: 16, type: 'attraction', description: 'Impressionist masterpieces by Monet, Renoir, and Van Gogh in a stunning railway station.' },
      { id: 'p6', name: 'Marché des Enfants Rouges', duration: '1h', cost: 15, type: 'activity', description: 'Paris\'s oldest covered market with diverse food stalls from around the world.' },
    ],
    evening: [
      { id: 'p7', name: 'Dinner in Le Marais', duration: '2h', cost: 50, type: 'restaurant', description: 'Bistro dining in the historic Jewish quarter with classic French cuisine.' },
      { id: 'p8', name: 'Moulin Rouge Show', duration: '2.5h', cost: 110, type: 'activity', description: 'Legendary Parisian cabaret with dazzling costumes and can-can dancing.' },
      { id: 'p9', name: 'Evening Stroll on Pont des Arts', duration: '1h', cost: 0, type: 'activity', description: 'Walk the "Love Lock Bridge" as the city glows in the evening light.' },
    ],
  },
  coorg: {
    morning: [
      { id: 'c1', name: 'Mullayanagiri Trek', duration: '4h', cost: 10, type: 'activity', description: 'Trek to Karnataka\'s highest peak at 1,930m for panoramic Ghats views.' },
      { id: 'c2', name: 'Coffee Plantation Walk', duration: '2h', cost: 8, type: 'activity', description: 'Guided walk through fragrant Arabica and Robusta estates with tasting.' },
      { id: 'c3', name: 'Abbey Falls', duration: '2h', cost: 5, type: 'attraction', description: 'Stunning 70-ft waterfall surrounded by lush spice and coffee plantations.' },
    ],
    afternoon: [
      { id: 'c4', name: 'Dubare Elephant Camp', duration: '3h', cost: 15, type: 'activity', description: 'Bathe and interact with trained elephants in the Cauvery riverbed.' },
      { id: 'c5', name: 'Namdroling Monastery', duration: '2h', cost: 0, type: 'attraction', description: 'Golden Temple of Bylakuppe — largest Tibetan settlement outside Tibet.' },
      { id: 'c6', name: 'White Water Rafting, Barapole', duration: '3h', cost: 20, type: 'activity', description: 'Grade 3-4 rapids through dense jungle on the wild Barapole river.' },
    ],
    evening: [
      { id: 'c7', name: 'Pandi Curry Dinner', duration: '1.5h', cost: 8, type: 'restaurant', description: 'Traditional Kodava pork curry with akki rotti at a local homestay.' },
      { id: 'c8', name: 'Bonfire at Estate', duration: '2h', cost: 0, type: 'activity', description: 'Stargazing bonfire evening at a coffee estate resort.' },
      { id: 'c9', name: 'Raja\'s Seat Sunset', duration: '1h', cost: 2, type: 'attraction', description: 'The ancient seat of Coorg kings — perfect sunset viewing point.' },
    ],
  },
  default: {
    morning: [
      { id: 'd1', name: 'Old Town Walking Tour', duration: '2h', cost: 15, type: 'activity', description: 'Guided historical walking tour through the city\'s most iconic streets.' },
      { id: 'd2', name: 'Main Cathedral / Temple Visit', duration: '1.5h', cost: 5, type: 'attraction', description: 'Visit the city\'s most celebrated religious and architectural landmark.' },
      { id: 'd3', name: 'Local Market Breakfast', duration: '1h', cost: 8, type: 'restaurant', description: 'Start the day with local pastries, coffee, and fresh produce at the central market.' },
    ],
    afternoon: [
      { id: 'd4', name: 'National Museum', duration: '2h', cost: 12, type: 'attraction', description: 'Explore the country\'s history, art, and culture across impressive permanent collections.' },
      { id: 'd5', name: 'Viewpoint Hike', duration: '2h', cost: 0, type: 'activity', description: 'Short hike to a panoramic viewpoint overlooking the city and surroundings.' },
      { id: 'd6', name: 'Local Cooking Class', duration: '3h', cost: 40, type: 'activity', description: 'Learn to prepare 3 traditional dishes with a local chef.' },
    ],
    evening: [
      { id: 'd7', name: 'Sunset Rooftop Bar', duration: '2h', cost: 25, type: 'activity', description: 'Cocktails and canapes with sweeping views as the sun sets over the city.' },
      { id: 'd8', name: 'Traditional Dinner', duration: '2h', cost: 35, type: 'restaurant', description: 'Fine dining experience featuring traditional local cuisine and folk entertainment.' },
      { id: 'd9', name: 'Night City Walk', duration: '1h', cost: 0, type: 'activity', description: 'Explore the city at night — street food, lights, and local neighbourhoods.' },
    ],
  },
};

const restaurantDB: Record<string, string[]> = {
  bali: ['Locavore (Modern Indonesian)', 'Mozaic Restaurant (French-Balinese)', 'Warung Babi Guling Ibu Oka (Local)', 'Merah Putih (Indonesian)', 'Cuca Restaurant (Tapas)'],
  paris: ['Le Comptoir du Relais (Bistro)', 'L\'Ami Jean (Basque)', 'Septime (Modern French)', 'Au Pied de Cochon (Classic French)', 'Frenchie (Contemporary)'],
  coorg: ['Raintree (Coorg Cuisine)', 'Honey Valley Estate Restaurant', 'Café Coorg', 'Taj Madikeri Dining', 'Misty Valley Resort Kitchen'],
  default: ['Restaurant Centrale (Local Cuisine)', 'The Grand Terrace (International)', 'Street Food Market (Budget)', 'Le Gourmet (Fine Dining)', 'Café Botanico (Breakfast)'],
};

export function generateItinerary(params: {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  travelStyle: string;
  interests: string[];
}): GeneratedItinerary {
  const start = new Date(params.startDate);
  const end = new Date(params.endDate);
  const numDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const destKey = params.destination.toLowerCase().includes('bali')
    ? 'bali'
    : params.destination.toLowerCase().includes('paris')
    ? 'paris'
    : params.destination.toLowerCase().includes('coorg')
    ? 'coorg'
    : 'default';

  const acts = activityDB[destKey] || activityDB.default;
  const restaurants = restaurantDB[destKey] || restaurantDB.default;

  const days: DayPlan[] = [];
  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    const morningActs = acts.morning.slice(i % 3, (i % 3) + 1);
    const afternoonActs = acts.afternoon.slice(i % 3, (i % 3) + 1);
    const eveningActs = acts.evening.slice(i % 3, (i % 3) + 1);
    const dayCost = [...morningActs, ...afternoonActs, ...eveningActs].reduce((s, a) => s + a.cost, 0) * params.travelers + 40;

    days.push({
      day: i + 1,
      date: date.toISOString().split('T')[0],
      morning: morningActs,
      afternoon: afternoonActs,
      evening: eveningActs,
      restaurants: [restaurants[i % restaurants.length], restaurants[(i + 1) % restaurants.length]],
      travelTime: `${20 + i * 5} min avg between spots`,
      estimatedCost: dayCost,
    });
  }

  const totalCost = days.reduce((s, d) => s + d.estimatedCost, 0);

  return {
    id: `trip-${Date.now()}`,
    destination: params.destination,
    startDate: params.startDate,
    endDate: params.endDate,
    days,
    totalCost,
    travelStyle: params.travelStyle,
    travelers: params.travelers,
  };
}

export function chatbotReply(message: string, context: { destination?: string; budget?: number } = {}): string {
  return `I only recommend places and travel details verified from live geographic data. Open the AI Planner and enter a destination or request such as “Find beaches within 20 km of Goa” to search real places. If a place cannot be verified, I will say so instead of guessing.`;
  const msg = message.toLowerCase();

  if (msg.includes('best place') || msg.includes('where') || msg.includes('destination')) {
    return `Great question! Based on your preferences, here are my top picks:\n\n🏝️ **Bali, Indonesia** — Spiritual vibes, rice terraces, and world-class surf. Budget: ~$80/day\n\n🗼 **Paris, France** — Art, cuisine, and romance in one city. Budget: ~$180/day\n\n🌸 **Kyoto, Japan** — Ancient temples, bullet trains, and cherry blossoms. Budget: ~$120/day\n\nWould you like a detailed itinerary for any of these?`;
  }

  if (msg.includes('restaurant') || msg.includes('food') || msg.includes('eat')) {
    const dest = context.destination || 'your destination';
    return `Top dining picks in ${dest}:\n\n🍽️ **Local Market** — Authentic street food, budget-friendly (~$5–10)\n🥘 **Heritage Restaurant** — Traditional cuisine in a beautiful setting (~$25–40)\n🌟 **Fine Dining** — Chef's tasting menu for a special evening (~$80–150)\n\nWould you like me to add a restaurant to your itinerary?`;
  }

  if (msg.includes('pack') || msg.includes('luggage') || msg.includes('bring')) {
    return `Here's your smart packing list 🧳:\n\n**Essentials**\n• Passport & travel docs\n• Travel insurance card\n• Local currency + card\n\n**Clothing**\n• Lightweight, versatile layers\n• Comfortable walking shoes\n• Quick-dry fabrics\n\n**Tech**\n• Universal power adapter\n• Portable charger\n• Offline maps downloaded\n\n**Health**\n• First aid kit\n• Sunscreen SPF 50+\n• Hand sanitiser\n\nWant me to customise this for your specific destination?`;
  }

  if (msg.includes('weather') || msg.includes('climate') || msg.includes('temperature')) {
    return `Current weather update ☀️:\n\n**Temperature:** 28°C / 82°F\n**Condition:** Partly Cloudy\n**Humidity:** 68%\n**Wind:** 12 km/h\n\n**5-Day Outlook:**\n• Mon: ☀️ 30°C\n• Tue: 🌦️ 27°C\n• Wed: 🌧️ 24°C — Indoor alternatives suggested!\n• Thu: ⛅ 28°C\n• Fri: ☀️ 31°C\n\nI'll automatically suggest indoor activities when rain is forecast!`;
  }

  if (msg.includes('cost') || msg.includes('budget') || msg.includes('price') || msg.includes('₹') || msg.includes('$')) {
    const budget = context.budget || 20000;
    return `Budget breakdown for your trip 💰:\n\n**Daily Estimates:**\n• 🏨 Accommodation: $40–80/night\n• 🍽️ Food: $20–40/day\n• 🚗 Transport: $15–25/day\n• 🎯 Activities: $20–50/day\n\n**Total for 4 days (2 people):** $380–780\n\n**Money-saving tips:**\n✓ Book accommodation 2–3 weeks ahead\n✓ Eat lunch at local markets\n✓ Use public transport or share rides\n✓ Visit free attractions in the morning\n\nShall I generate a detailed budget planner?`;
  }

  if (msg.includes('itinerary') || msg.includes('change') || msg.includes('modify') || msg.includes('update')) {
    return `I can help you modify your itinerary! 📝\n\nWhat would you like to change?\n\n1. **Swap an activity** — tell me the day and I'll suggest alternatives\n2. **Add a new spot** — "Add a beach on Day 2"\n3. **Change pace** — make it more relaxed or action-packed\n4. **Reorder days** — rearrange stops to optimise travel time\n5. **Budget adjustment** — find cheaper or premium options\n\nJust describe what you'd like and I'll update it instantly!`;
  }

  if (msg.includes('activity') || msg.includes('activities') || msg.includes('suggest') || msg.includes('today')) {
    return `Here are today's activity suggestions 🎯:\n\n**Morning**\n🌅 Sunrise viewpoint walk — free & magical\n☕ Local café breakfast with coffee tasting\n\n**Afternoon**\n🏛️ Cultural site visit — ~$10\n🛶 Local experience (cooking/craft class) — ~$30\n\n**Evening**\n🌇 Sunset spot with locals\n🎭 Traditional performance or live music\n🍜 Dinner at a recommended local restaurant\n\nWant me to book or add any of these to your itinerary?`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('help')) {
    return `Hello! I'm your TravelAI assistant ✈️\n\nI can help you with:\n\n• 🗺️ **Destination recommendations**\n• 📅 **Itinerary planning & changes**\n• 🌤️ **Weather updates**\n• 💰 **Budget estimates**\n• 🍽️ **Restaurant suggestions**\n• 🎒 **Packing advice**\n• 🏨 **Hotel recommendations**\n\nWhat can I help you plan today?`;
  }

  if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation')) {
    return `Hotel recommendations for your trip 🏨:\n\n**Budget (under $50/night)**\n• Backpacker Haven Hostel — ⭐4.2, dorms & private rooms\n• The Local Guesthouse — ⭐4.5, family-run, great breakfast\n\n**Mid-range ($50–150/night)**\n• Boutique Heritage Hotel — ⭐4.7, central location\n• Garden View Resort — ⭐4.6, pool & spa included\n\n**Luxury ($150+/night)**\n• Grand Palace Hotel — ⭐5.0, rooftop pool & concierge\n• The Signature Collection — ⭐4.9, private villas\n\nShall I add accommodation to your budget planner?`;
  }

  return `I'm thinking about the best answer for you... 🤔\n\nBased on your question about "${message}", I suggest exploring the destination guides in the Explore section, or use the AI Planner to generate a complete personalised itinerary.\n\nYou can also ask me about:\n• Weather & packing tips\n• Budget estimates\n• Restaurant recommendations\n• Activity suggestions\n• Itinerary changes\n\nWhat else can I help you with?`;
}

export interface SavedTrip {
  id: string;
  destination: string;
  country: string;
  image: string;
  startDate: string;
  endDate: string;
  days: number;
  budget: number;
  currency: string;
  status: 'planned' | 'ongoing' | 'completed';
  travelers: number;
  itinerary?: GeneratedItinerary;
}

export const initialSavedTrips: SavedTrip[] = [
  {
    id: 'trip-001',
    destination: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&h=300&fit=crop&auto=format',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    days: 7,
    budget: 1800,
    currency: 'USD',
    status: 'planned',
    travelers: 2,
  },
  {
    id: 'trip-002',
    destination: 'Coorg',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1503079230625-8a7c589a9007?w=400&h=300&fit=crop&auto=format',
    startDate: '2026-09-20',
    endDate: '2026-09-24',
    days: 4,
    budget: 350,
    currency: 'USD',
    status: 'planned',
    travelers: 1,
  },
];
