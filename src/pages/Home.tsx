import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { destinations } from '../data/destinations';

const features = [
  { icon: '🤖', title: 'AI Itinerary Generator', desc: 'Get a personalised day-by-day plan in seconds based on your budget, style, and interests.' },
  { icon: '🌤️', title: 'Live Weather Updates', desc: 'Real-time weather forecasts with smart indoor alternatives when conditions change.' },
  { icon: '💰', title: 'Smart Budget Planner', desc: 'Visual budget dashboard with cost breakdowns, progress tracking, and money-saving tips.' },
  { icon: '🗺️', title: 'Interactive Maps', desc: 'Explore attractions, hotels, and restaurants on an integrated map with suggested routes.' },
  { icon: '✈️', title: 'AI Travel Chatbot', desc: '24/7 travel assistant answering questions about packing, costs, restaurants, and more.' },
  { icon: '⭐', title: 'Smart Recommendations', desc: 'Personalised suggestions for hotels, food, and activities based on your preferences.' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Solo Traveller',
    avatar: 'P',
    text: 'TravelAI planned my entire Bali trip in under 5 minutes. The itinerary was so detailed I didn\'t have to think once during my holiday. Absolutely incredible!',
    destination: 'Bali, Indonesia',
    rating: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Adventure Enthusiast',
    avatar: 'R',
    text: 'I gave it my budget of ₹20,000 for 4 days and it suggested Coorg with a perfect trek itinerary. Saved hours of research and it was spot on!',
    destination: 'Coorg, India',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    role: 'Family Traveller',
    avatar: 'S',
    text: 'Planned a family trip to Paris for 5 people with different interests. The AI balanced museums, food, and parks perfectly. Everyone loved it.',
    destination: 'Paris, France',
    rating: 5,
  },
];

export default function Home() {
  const { setCurrentPage, setSearchQuery, setPlannerDestination } = useApp();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (!search.trim()) return;
    setSearchQuery(search);
    setPlannerDestination(search);
    setCurrentPage('planner');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const popularDests = destinations.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F0EEEA] dark:bg-[#111310]">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full-bleed background image */}
        <div
          className="absolute inset-0 bg-[#1F3A5F]"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1609779340167-207589f3f94f?w=1600&h=900&fit=crop&auto=format)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Travel Planning
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl font-bold text-white leading-tight mb-4">
              Your AI-Powered<br />
              <span className="italic text-[#C8E0F0]">Travel Companion</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
              Plan smarter. Travel better. Explore more.
            </p>

            {/* Search box */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6560] text-lg">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Where do you want to go?"
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/95 dark:bg-[#1C1E1A]/95 text-[#0D0D0D] dark:text-white placeholder-[#6B6560] text-base focus:outline-none focus:ring-2 focus:ring-white shadow-xl"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-4 bg-[#C8472A] hover:bg-[#a83820] text-white rounded-xl font-semibold text-base transition-colors shadow-xl whitespace-nowrap"
              >
                Plan My Trip
              </button>
            </div>

            <div className="flex gap-4 mt-5">
              <button
                onClick={() => setCurrentPage('explore')}
                className="px-6 py-3 rounded-xl border border-white/40 text-white hover:bg-white/10 transition-colors font-medium text-sm"
              >
                Explore Destinations
              </button>
              <button
                onClick={() => setCurrentPage('planner')}
                className="px-6 py-3 rounded-xl bg-[#1F3A5F]/80 border border-[#1F3A5F] text-white hover:bg-[#1F3A5F] transition-colors font-medium text-sm"
              >
                AI Planner →
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-8 right-8 hidden lg:flex gap-6">
          {[
            { val: '50K+', label: 'Trips Planned' },
            { val: '120+', label: 'Destinations' },
            { val: '4.9★', label: 'User Rating' },
          ].map(s => (
            <div key={s.label} className="text-center text-white backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="font-serif text-2xl font-bold">{s.val}</p>
              <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-[#C8472A] uppercase tracking-widest mb-2">Trending Now</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D0D0D] dark:text-white">Popular Destinations</h2>
          </div>
          <button onClick={() => setCurrentPage('explore')} className="hidden sm:block text-sm font-semibold text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDests.map((dest, i) => (
            <div
              key={dest.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}
              onClick={() => { setPlannerDestination(dest.name); setCurrentPage('planner'); }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wider">{dest.country}</p>
                <h3 className="font-serif text-2xl font-bold leading-tight">{dest.name}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
                  <span>⭐ {dest.rating}</span>
                  <span>•</span>
                  <span>From ${dest.avgBudget.min}</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium border border-white/20">
                {dest.bestTime}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-[#1F3A5F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-[#C8E0F0] uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold">Why TravelAI?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-3xl block mb-4">{f.icon}</span>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Interaction Example ── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-medium text-[#C8472A] uppercase tracking-widest mb-3">See AI in Action</p>
            <h2 className="font-serif text-4xl font-bold text-[#0D0D0D] dark:text-white mb-6">
              Budget Travel,<br />
              <span className="italic">Intelligently Planned</span>
            </h2>
            <p className="text-[#6B6560] dark:text-[#9A9690] mb-8 leading-relaxed">
              Just tell TravelAI your budget, dates, and travel style. It instantly recommends destinations and builds a complete day-by-day itinerary with costs, restaurants, and activities.
            </p>
            <button
              onClick={() => setCurrentPage('planner')}
              className="px-6 py-3 bg-[#1F3A5F] text-white rounded-xl font-semibold hover:bg-[#2d5280] transition-colors"
            >
              Try the AI Planner →
            </button>
          </div>

          {/* Mock chat */}
          <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl shadow-xl border border-[#D4D0C8] dark:border-[#2E302B] overflow-hidden">
            <div className="bg-[#1F3A5F] text-white px-5 py-3 text-sm font-semibold">TravelAI Chat</div>
            <div className="p-5 space-y-4">
              <div className="flex justify-end">
                <div className="bg-[#1F3A5F] text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs">
                  I have ₹20,000 and 4 days. I want an adventurous trip from Bengaluru.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xs flex-shrink-0">✈</div>
                <div className="bg-[#F0EEEA] dark:bg-[#252720] text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-xs text-[#0D0D0D] dark:text-white">
                  Great choice! Here are 3 ideal destinations within your budget:<br /><br />
                  <strong>1. 🏔️ Coorg</strong> — Coffee estates & waterfalls<br />
                  <strong>2. 🏖️ Gokarna</strong> — Secluded beaches & cliffs<br />
                  <strong>3. 🌿 Chikmagalur</strong> — Hill treks & wildlife<br /><br />
                  Which one would you like a full itinerary for?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#1F3A5F] text-white text-sm rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs">
                  Coorg sounds perfect! Generate the itinerary.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xs flex-shrink-0">✈</div>
                <div className="bg-[#F0EEEA] dark:bg-[#252720] text-sm rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-xs text-[#0D0D0D] dark:text-white">
                  ✅ 4-day Coorg adventure itinerary generated! Day 1 starts with Mullayanagiri Trek at sunrise...
                </div>
              </div>
            </div>
            <div className="px-5 pb-4">
              <button
                onClick={() => setCurrentPage('planner')}
                className="w-full py-2.5 bg-[#C8472A] text-white rounded-xl text-sm font-semibold hover:bg-[#a83820] transition-colors"
              >
                Try it yourself →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-[#E8E4DE] dark:bg-[#1C1E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-[#C8472A] uppercase tracking-widest mb-3">Real Travellers</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D0D0D] dark:text-white">What They're Saying</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white dark:bg-[#252720] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center font-bold text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0D0D0D] dark:text-white">{t.name}</p>
                    <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">{t.role} · {t.destination}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-[#6B6560] dark:text-[#9A9690] leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#0D0D0D] dark:text-white mb-4">
            Ready to Plan Your<br />
            <span className="italic text-[#1F3A5F] dark:text-[#7BAFD4]">Dream Trip?</span>
          </h2>
          <p className="text-[#6B6560] dark:text-[#9A9690] mb-8">Join 50,000+ travellers who plan smarter with TravelAI.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setCurrentPage('planner')}
              className="px-8 py-4 bg-[#1F3A5F] text-white rounded-xl font-semibold hover:bg-[#2d5280] transition-colors text-lg"
            >
              Start Planning Free →
            </button>
            <button
              onClick={() => setCurrentPage('explore')}
              className="px-8 py-4 border-2 border-[#1F3A5F] dark:border-[#7BAFD4] text-[#1F3A5F] dark:text-[#7BAFD4] rounded-xl font-semibold hover:bg-[#1F3A5F]/5 transition-colors text-lg"
            >
              Browse Destinations
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#D4D0C8] dark:border-[#2E302B] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">✈️</span>
              <span className="font-serif text-xl font-bold text-[#1F3A5F] dark:text-[#7BAFD4]">TravelAI</span>
            </div>
            <p className="text-sm text-[#6B6560] dark:text-[#9A9690] leading-relaxed max-w-xs">
              AI-powered travel planning that makes every trip extraordinary.
            </p>
          </div>
          {[
            { title: 'Product', links: ['AI Planner', 'Explore', 'My Trips', 'Budget Planner'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Support', links: ['Help Centre', 'Contact', 'Privacy Policy', 'Terms'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm text-[#0D0D0D] dark:text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><button className="text-sm text-[#6B6560] dark:text-[#9A9690] hover:text-[#1F3A5F] dark:hover:text-[#7BAFD4] transition-colors">{l}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#D4D0C8] dark:border-[#2E302B] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#6B6560] dark:text-[#9A9690]">
          <p>© 2026 TravelAI. All rights reserved.</p>
          <div className="flex gap-4">
            {['🐦', '📘', '📸', '▶️'].map((icon, i) => (
              <button key={i} className="hover:text-[#1F3A5F] dark:hover:text-[#7BAFD4] transition-colors text-xl">{icon}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
