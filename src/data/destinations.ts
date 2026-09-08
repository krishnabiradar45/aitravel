export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  avgBudget: { min: number; max: number; currency: string };
  bestTime: string;
  activities: string[];
  type: string[];
  travelStyles: string[];
  rating: number;
  reviews: number;
  tags: string[];
}

export const destinations: Destination[] = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    description: 'Island of gods with lush rice terraces, ancient temples, volcanic mountains, and vibrant arts scene.',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 800, max: 2500, currency: 'USD' },
    bestTime: 'Apr – Oct',
    activities: ['Temples', 'Surfing', 'Rice Terraces', 'Yoga', 'Cooking Classes'],
    type: ['Beach', 'Culture', 'Relaxation'],
    travelStyles: ['Relaxation', 'Adventure', 'Budget', 'Solo'],
    rating: 4.8,
    reviews: 12480,
    tags: ['Beaches', 'Culture', 'Nightlife', 'Food'],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    description: 'The city of light — world-class museums, haute cuisine, romantic boulevards, and architectural splendor.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 1500, max: 4000, currency: 'USD' },
    bestTime: 'Apr – Jun, Sep – Nov',
    activities: ['Eiffel Tower', 'Louvre', 'Seine River Cruise', 'Versailles', 'Montmartre'],
    type: ['City', 'Culture', 'Luxury'],
    travelStyles: ['Luxury', 'Family', 'Relaxation'],
    rating: 4.9,
    reviews: 28900,
    tags: ['Culture', 'Food', 'Shopping', 'History'],
  },
  {
    id: 'japan',
    name: 'Kyoto & Tokyo',
    country: 'Japan',
    description: 'A seamless blend of ancient shrines, bullet trains, neon-lit streets, and cherry blossoms.',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 2000, max: 5000, currency: 'USD' },
    bestTime: 'Mar – May, Sep – Nov',
    activities: ['Fushimi Inari', 'Shibuya Crossing', 'Mt Fuji', 'Tea Ceremony', 'Ramen'],
    type: ['City', 'Culture', 'Mountains'],
    travelStyles: ['Solo', 'Adventure', 'Luxury', 'Family'],
    rating: 4.9,
    reviews: 19200,
    tags: ['Culture', 'Food', 'History', 'Mountains'],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    description: 'Iconic blue-domed churches, sheer volcanic cliffs, and legendary Aegean sunsets.',
    image: 'https://images.unsplash.com/photo-1663052722151-2264b940cb08?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 2000, max: 6000, currency: 'USD' },
    bestTime: 'May – Oct',
    activities: ['Caldera Views', 'Wine Tasting', 'Sailing', 'Oia Sunset', 'Volcano Hike'],
    type: ['Beach', 'Luxury', 'Island'],
    travelStyles: ['Luxury', 'Relaxation', 'Solo'],
    rating: 4.8,
    reviews: 15700,
    tags: ['Beaches', 'Food', 'Nightlife', 'Culture'],
  },
  {
    id: 'coorg',
    name: 'Coorg',
    country: 'India',
    description: 'Scotland of India — mist-covered coffee estates, waterfalls, and tribal culture in Karnataka.',
    image: 'https://images.unsplash.com/photo-1503079230625-8a7c589a9007?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 150, max: 500, currency: 'USD' },
    bestTime: 'Oct – Mar',
    activities: ['Coffee Plantation Trek', 'Abbey Falls', 'Namdroling Monastery', 'Elephant Camp', 'White Water Rafting'],
    type: ['Mountains', 'Nature', 'Adventure'],
    travelStyles: ['Adventure', 'Budget', 'Family', 'Solo'],
    rating: 4.6,
    reviews: 8900,
    tags: ['Mountains', 'Wildlife', 'Culture'],
  },
  {
    id: 'gokarna',
    name: 'Gokarna',
    country: 'India',
    description: 'Secluded beaches, sea-cliffs, and a laid-back vibe ideal for trekkers and spiritual seekers.',
    image: 'https://images.unsplash.com/photo-1654941762521-644b3ba9c0fb?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 100, max: 350, currency: 'USD' },
    bestTime: 'Oct – Mar',
    activities: ['Beach Trek', 'Om Beach', 'Mahabaleshwar Temple', 'Snorkeling', 'Cliff Jumping'],
    type: ['Beach', 'Adventure', 'Nature'],
    travelStyles: ['Adventure', 'Budget', 'Solo'],
    rating: 4.5,
    reviews: 5200,
    tags: ['Beaches', 'Wildlife', 'History'],
  },
  {
    id: 'chikmagalur',
    name: 'Chikmagalur',
    country: 'India',
    description: 'Green hill station known for its coffee estates, Mullayanagiri peak, and pristine forests.',
    image: 'https://images.unsplash.com/photo-1651149164822-210246e81f99?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 120, max: 400, currency: 'USD' },
    bestTime: 'Sep – Mar',
    activities: ['Mullayanagiri Trek', 'Coffee Estate Tour', 'Bhadra Wildlife Sanctuary', 'Z Point', 'Kemmanagundi'],
    type: ['Mountains', 'Nature', 'Adventure'],
    travelStyles: ['Adventure', 'Budget', 'Solo', 'Family'],
    rating: 4.5,
    reviews: 6100,
    tags: ['Mountains', 'Wildlife', 'Food'],
  },
  {
    id: 'maldives',
    name: 'Maldives',
    country: 'Maldives',
    description: 'Crystal turquoise lagoons, overwater bungalows, and pristine coral reefs in the Indian Ocean.',
    image: 'https://images.unsplash.com/photo-1654593777128-d187ed9820e5?w=800&h=600&fit=crop&auto=format',
    avgBudget: { min: 3000, max: 10000, currency: 'USD' },
    bestTime: 'Nov – Apr',
    activities: ['Snorkeling', 'Scuba Diving', 'Overwater Villa', 'Dolphin Watching', 'Spa'],
    type: ['Beach', 'Luxury', 'Island'],
    travelStyles: ['Luxury', 'Relaxation'],
    rating: 4.9,
    reviews: 10300,
    tags: ['Beaches', 'Wildlife'],
  },
];

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  icon: string;
  forecast: { day: string; high: number; low: number; icon: string; condition: string }[];
}

export const weatherData: Record<string, WeatherData> = {
  bali: {
    city: 'Bali',
    temp: 30,
    condition: 'Partly Cloudy',
    humidity: 75,
    wind: 14,
    icon: '⛅',
    forecast: [
      { day: 'Mon', high: 31, low: 24, icon: '☀️', condition: 'Sunny' },
      { day: 'Tue', high: 29, low: 23, icon: '🌦️', condition: 'Light Rain' },
      { day: 'Wed', high: 27, low: 22, icon: '🌧️', condition: 'Heavy Rain' },
      { day: 'Thu', high: 30, low: 24, icon: '⛅', condition: 'Cloudy' },
      { day: 'Fri', high: 32, low: 25, icon: '☀️', condition: 'Sunny' },
    ],
  },
  paris: {
    city: 'Paris',
    temp: 18,
    condition: 'Clear',
    humidity: 60,
    wind: 10,
    icon: '☀️',
    forecast: [
      { day: 'Mon', high: 19, low: 12, icon: '☀️', condition: 'Clear' },
      { day: 'Tue', high: 17, low: 11, icon: '⛅', condition: 'Cloudy' },
      { day: 'Wed', high: 15, low: 10, icon: '🌦️', condition: 'Light Rain' },
      { day: 'Thu', high: 16, low: 9, icon: '⛅', condition: 'Partly Cloudy' },
      { day: 'Fri', high: 20, low: 13, icon: '☀️', condition: 'Clear' },
    ],
  },
  default: {
    city: 'Your Destination',
    temp: 25,
    condition: 'Sunny',
    humidity: 55,
    wind: 12,
    icon: '☀️',
    forecast: [
      { day: 'Mon', high: 26, low: 18, icon: '☀️', condition: 'Sunny' },
      { day: 'Tue', high: 24, low: 17, icon: '⛅', condition: 'Partly Cloudy' },
      { day: 'Wed', high: 22, low: 16, icon: '🌦️', condition: 'Light Rain' },
      { day: 'Thu', high: 25, low: 18, icon: '⛅', condition: 'Cloudy' },
      { day: 'Fri', high: 27, low: 19, icon: '☀️', condition: 'Sunny' },
    ],
  },
};
