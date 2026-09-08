import { useApp } from '../context/AppContext';

const team = [
  { name: 'Aisha Nair', role: 'CEO & Co-founder', emoji: 'A', bio: 'Former Google engineer passionate about making travel accessible to everyone.' },
  { name: 'Marcus Chen', role: 'CTO', emoji: 'M', bio: 'AI researcher with 10 years of experience in natural language processing and travel tech.' },
  { name: 'Priya Iyer', role: 'Head of Design', emoji: 'P', bio: 'Previously at Airbnb, Priya crafts every pixel of the TravelAI experience.' },
];

export default function About() {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-[#F0EEEA] dark:bg-[#111310] pt-16">
      <div className="bg-[#1F3A5F] text-white py-16 px-4 sm:px-6 text-center">
        <p className="text-sm text-[#C8E0F0] uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="font-serif text-5xl font-bold mb-4">About TravelAI</h1>
        <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
          We're on a mission to make world travel effortless, intelligent, and personal — for everyone.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#0D0D0D] dark:text-white mb-4">Born from a travel problem</h2>
            <p className="text-[#6B6560] dark:text-[#9A9690] leading-relaxed mb-4">
              TravelAI was founded in 2024 when our team spent 40 hours planning a 5-day trip — browsing dozens of blogs, comparing hotels, and piecing together an itinerary manually. There had to be a better way.
            </p>
            <p className="text-[#6B6560] dark:text-[#9A9690] leading-relaxed">
              We built the AI-powered travel assistant we always wished existed. Today, TravelAI has helped over 50,000 travellers plan trips to 120+ destinations worldwide.
            </p>
          </div>
          <div className="bg-[#1F3A5F] text-white rounded-2xl p-8 text-center">
            <div className="grid grid-cols-2 gap-6">
              {[
                { val: '50K+', label: 'Trips Planned' },
                { val: '120+', label: 'Destinations' },
                { val: '4.9★', label: 'App Rating' },
                { val: '98%', label: 'Satisfaction' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-serif text-3xl font-bold">{s.val}</p>
                  <p className="text-white/70 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-serif text-3xl font-bold text-[#0D0D0D] dark:text-white mb-8 text-center">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map(m => (
              <div key={m.name} className="bg-white dark:bg-[#1C1E1A] rounded-2xl border border-[#D4D0C8] dark:border-[#2E302B] p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {m.emoji}
                </div>
                <h3 className="font-semibold text-[#0D0D0D] dark:text-white">{m.name}</h3>
                <p className="text-xs text-[#C8472A] font-medium mb-3">{m.role}</p>
                <p className="text-xs text-[#6B6560] dark:text-[#9A9690] leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#1F3A5F] text-white rounded-2xl p-10 text-center">
          <h2 className="font-serif text-3xl font-bold mb-3">Start Your Journey Today</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">Join thousands of travellers who use TravelAI to plan smarter, travel better, and explore more.</p>
          <button onClick={() => setCurrentPage('planner')} className="px-8 py-4 bg-white text-[#1F3A5F] rounded-xl font-bold text-base hover:bg-[#F0EEEA] transition-colors">
            Plan My Trip Free →
          </button>
        </section>
      </div>
    </div>
  );
}
