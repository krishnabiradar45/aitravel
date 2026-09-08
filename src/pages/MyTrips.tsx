import { useState } from 'react';
import { useApp } from '../context/AppContext';

const statusColors: Record<string, string> = {
  planned: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  ongoing: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  completed: 'bg-[#F0EEEA] dark:bg-[#252720] text-[#6B6560] dark:text-[#9A9690]',
};
const statusLabels: Record<string, string> = { planned: '📅 Planned', ongoing: '✈️ Ongoing', completed: '✅ Completed' };

export default function MyTrips() {
  const { savedTrips, deleteTrip, setCurrentPage, setCurrentItinerary, showToast, user } = useApp();
  const [filter, setFilter] = useState<'all' | 'planned' | 'ongoing' | 'completed'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = savedTrips.filter(t => filter === 'all' || t.status === filter);

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setConfirmDelete(null);
    showToast('Trip deleted.', 'info');
  };

  const handleView = (trip: typeof savedTrips[0]) => {
    if (trip.itinerary) {
      setCurrentItinerary(trip.itinerary);
    }
    setCurrentPage('planner');
    showToast(`Opening ${trip.destination} itinerary...`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#F0EEEA] dark:bg-[#111310] pt-16">
      {/* Header */}
      <div className="bg-[#1F3A5F] text-white py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-end justify-between">
          <div>
            <p className="text-sm text-[#C8E0F0] uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="font-serif text-4xl font-bold">My Trips</h1>
            <p className="text-white/70 mt-1">{savedTrips.length} trip{savedTrips.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={() => setCurrentPage('planner')}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            + Plan New Trip
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {(['all', 'planned', 'ongoing', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap
                ${filter === f
                  ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                  : 'border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] hover:border-[#1F3A5F]'
                }`}
            >
              {f === 'all' ? 'All Trips' : statusLabels[f]}
              <span className="ml-2 text-xs opacity-70">
                {f === 'all' ? savedTrips.length : savedTrips.filter(t => t.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B]">
            <span className="text-6xl block mb-4">🗺️</span>
            <h3 className="font-serif text-2xl font-bold text-[#0D0D0D] dark:text-white mb-2">
              {filter === 'all' ? 'No trips yet' : `No ${filter} trips`}
            </h3>
            <p className="text-[#6B6560] dark:text-[#9A9690] mb-6 text-sm">
              {filter === 'all' ? 'Start planning your dream adventure with TravelAI.' : 'Your adventures will show up here.'}
            </p>
            {filter === 'all' && (
              <button onClick={() => setCurrentPage('planner')} className="px-6 py-3 bg-[#1F3A5F] text-white rounded-xl font-semibold hover:bg-[#2d5280] transition-colors">
                Plan Your First Trip →
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(trip => (
              <div key={trip.id} className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-[#E8E4DE]">
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColors[trip.status]}`}>
                      {statusLabels[trip.status]}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-serif text-xl font-bold">{trip.destination}</h3>
                    <p className="text-xs text-white/80">{trip.country}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">Dates</p>
                      <p className="text-xs font-semibold text-[#0D0D0D] dark:text-white">
                        {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-center border-x border-[#D4D0C8] dark:border-[#2E302B]">
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">Duration</p>
                      <p className="text-xs font-semibold text-[#0D0D0D] dark:text-white">{trip.days} days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690]">Budget</p>
                      <p className="text-xs font-semibold text-[#1F3A5F] dark:text-[#7BAFD4]">${trip.budget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#6B6560] dark:text-[#9A9690] mb-4">
                    <span>👥 {trip.travelers} traveller{trip.travelers > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{trip.itinerary ? '📅 Itinerary ready' : '📝 No itinerary'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(trip)}
                      className="flex-1 py-2 bg-[#1F3A5F] text-white rounded-lg text-xs font-semibold hover:bg-[#2d5280] transition-colors"
                    >
                      View Itinerary
                    </button>
                    <button
                      onClick={() => handleView(trip)}
                      className="px-3 py-2 border border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] rounded-lg text-xs hover:border-[#1F3A5F] transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setConfirmDelete(trip.id)}
                      className="px-3 py-2 border border-[#D4D0C8] dark:border-[#2E302B] text-[#C8472A] rounded-lg text-xs hover:border-[#C8472A] hover:bg-[#C8472A]/5 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        {savedTrips.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Trips', value: savedTrips.length, icon: '🗺️' },
              { label: 'Countries', value: new Set(savedTrips.map(t => t.country)).size, icon: '🌍' },
              { label: 'Total Days', value: savedTrips.reduce((s, t) => s + t.days, 0), icon: '📅' },
              { label: 'Total Budget', value: `$${savedTrips.reduce((s, t) => s + t.budget, 0).toLocaleString()}`, icon: '💰' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-5 text-center">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className="font-serif text-2xl font-bold text-[#1F3A5F] dark:text-[#7BAFD4]">{s.value}</p>
                <p className="text-xs text-[#6B6560] dark:text-[#9A9690] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white dark:bg-[#1C1E1A] rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl font-bold text-[#0D0D0D] dark:text-white mb-2">Delete Trip?</h3>
            <p className="text-sm text-[#6B6560] dark:text-[#9A9690] mb-6">This action cannot be undone. Your itinerary and all trip data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-[#D4D0C8] dark:border-[#2E302B] text-[#6B6560] dark:text-[#9A9690] rounded-xl text-sm font-semibold hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2.5 bg-[#C8472A] text-white rounded-xl text-sm font-semibold hover:bg-[#a83820] transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
