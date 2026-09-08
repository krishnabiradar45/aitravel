import { useState, useMemo } from 'react';
import { destinations } from '../data/destinations';
import { useApp } from '../context/AppContext';

const budgetRanges = [
  { label: 'All Budgets', value: 'all' },
  { label: 'Budget (< $500)', value: 'budget' },
  { label: 'Mid-range ($500–$2K)', value: 'mid' },
  { label: 'Luxury ($2K+)', value: 'luxury' },
];

const destTypes = ['All', 'Beach', 'Mountains', 'City', 'Island', 'Nature'];
const styleFilters = ['All Styles', 'Adventure', 'Relaxation', 'Family', 'Luxury', 'Budget', 'Solo'];
const activityFilters = ['All Activities', 'Beaches', 'Mountains', 'Food', 'Culture', 'Shopping', 'History', 'Wildlife'];

export default function Explore() {
  const { setCurrentPage, setPlannerDestination } = useApp();
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('all');
  const [type, setType] = useState('All');
  const [style, setStyle] = useState('All Styles');
  const [activity, setActivity] = useState('All Activities');

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.country.toLowerCase().includes(search.toLowerCase())) return false;
      if (budget === 'budget' && d.avgBudget.min >= 500) return false;
      if (budget === 'mid' && (d.avgBudget.min < 500 || d.avgBudget.min >= 2000)) return false;
      if (budget === 'luxury' && d.avgBudget.min < 2000) return false;
      if (type !== 'All' && !d.type.includes(type)) return false;
      if (style !== 'All Styles' && !d.travelStyles.includes(style)) return false;
      if (activity !== 'All Activities' && !d.tags.includes(activity)) return false;
      return true;
    });
  }, [search, budget, type, style, activity]);

  const handleExplore = (dest: typeof destinations[0]) => {
    setPlannerDestination(dest.name);
    setCurrentPage('planner');
  };

  return (
    <div className="min-h-screen bg-[#F0EEEA] dark:bg-[#111310] pt-16">
      {/* Header */}
      <div className="bg-[#1F3A5F] text-white py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-[#C8E0F0] uppercase tracking-widest mb-2">Discover</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-white/70 max-w-lg">Find your perfect destination from our curated collection of the world's most beautiful places.</p>

          {/* Search */}
          <div className="mt-6 max-w-lg relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#6B6560] dark:text-[#9A9690] uppercase tracking-wider mr-2">Budget:</span>
            {budgetRanges.map(b => (
              <button
                key={b.value}
                onClick={() => setBudget(b.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${budget === b.value
                    ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                    : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F] dark:hover:border-[#7BAFD4]'
                  }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#6B6560] dark:text-[#9A9690] uppercase tracking-wider mr-2">Type:</span>
            {destTypes.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${type === t
                    ? 'bg-[#C8472A] text-white border-[#C8472A]'
                    : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#C8472A]'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-[#6B6560] dark:text-[#9A9690] uppercase tracking-wider mr-2">Style:</span>
            {styleFilters.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${style === s
                    ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                    : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F]'
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6B6560] dark:text-[#9A9690] mb-6 font-medium">
          {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🗺️</span>
            <p className="font-serif text-xl text-[#0D0D0D] dark:text-white mb-2">No destinations found</p>
            <p className="text-[#6B6560] dark:text-[#9A9690] text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(dest => (
              <div key={dest.id} className="bg-white dark:bg-[#1C1E1A] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="relative h-52 overflow-hidden bg-[#E8E4DE]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                    {dest.type[0]}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 dark:bg-[#1C1E1A]/90 text-[#1F3A5F] dark:text-[#7BAFD4] text-xs rounded-full font-semibold">
                    ⭐ {dest.rating}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0D0D0D] dark:text-white">{dest.name}</h3>
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">{dest.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">From</p>
                      <p className="font-semibold text-[#1F3A5F] dark:text-[#7BAFD4] text-sm">${dest.avgBudget.min}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#6B6560] dark:text-[#9A9690] line-clamp-2 mb-3 leading-relaxed">{dest.description}</p>

                  <div className="flex items-center gap-2 text-xs text-[#6B6560] dark:text-[#9A9690] mb-3">
                    <span>🗓️ {dest.bestTime}</span>
                    <span>•</span>
                    <span>👥 {dest.reviews.toLocaleString()} reviews</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {dest.activities.slice(0, 3).map(a => (
                      <span key={a} className="px-2 py-0.5 bg-[#F0EEEA] dark:bg-[#252720] text-[#1F3A5F] dark:text-[#7BAFD4] text-[10px] rounded-full font-medium">{a}</span>
                    ))}
                    {dest.activities.length > 3 && (
                      <span className="px-2 py-0.5 bg-[#F0EEEA] dark:bg-[#252720] text-[#6B6560] text-[10px] rounded-full">+{dest.activities.length - 3}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleExplore(dest)}
                    className="w-full py-2.5 bg-[#1F3A5F] hover:bg-[#2d5280] text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Explore & Plan Trip →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
