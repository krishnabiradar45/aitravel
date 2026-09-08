import { useState } from 'react';
import { useApp } from '../context/AppContext';
import AuthModal from './AuthModal';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'explore', label: 'Explore' },
  { id: 'my-trips', label: 'My Trips' },
  { id: 'planner', label: 'AI Planner' },
  { id: 'about', label: 'About' },
];

export default function Navbar() {
  const { currentPage, setCurrentPage, darkMode, toggleDarkMode, user, logout, showToast } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    setProfileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F0EEEA]/90 dark:bg-[#111310]/90 backdrop-blur-md border-b border-[#D4D0C8] dark:border-[#2E302B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-xl">✈️</span>
            <span className="font-serif text-xl font-bold text-[#1F3A5F] dark:text-[#7BAFD4] tracking-tight">TravelAI</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${currentPage === link.id
                    ? 'bg-[#1F3A5F] text-white'
                    : 'text-[#6B6560] dark:text-[#9A9690] hover:text-[#0D0D0D] dark:hover:text-white hover:bg-[#E8E4DE] dark:hover:bg-[#252720]'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-[#6B6560] dark:text-[#9A9690] hover:bg-[#E8E4DE] dark:hover:bg-[#252720] transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4D0C8] dark:border-[#2E302B] hover:bg-[#E8E4DE] dark:hover:bg-[#252720] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1F3A5F] text-white flex items-center justify-center text-xs font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-[#0D0D0D] dark:text-white hidden sm:block max-w-24 truncate">{user.name}</span>
                  <span className="text-xs text-[#6B6560]">▾</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1C1E1A] rounded-xl shadow-xl border border-[#D4D0C8] dark:border-[#2E302B] py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#D4D0C8] dark:border-[#2E302B]">
                      <p className="text-sm font-semibold text-[#0D0D0D] dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-[#6B6560] dark:text-[#9A9690] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { setCurrentPage('my-trips'); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#0D0D0D] dark:text-white hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors"
                    >
                      My Trips
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#C8472A] hover:bg-[#F0EEEA] dark:hover:bg-[#252720] transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 bg-[#1F3A5F] text-white rounded-full text-sm font-semibold hover:bg-[#2d5280] transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-full hover:bg-[#E8E4DE] dark:hover:bg-[#252720] transition-colors"
            >
              <div className="space-y-1">
                <span className={`block w-5 h-0.5 bg-[#0D0D0D] dark:bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[#0D0D0D] dark:bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-[#0D0D0D] dark:bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#111310] py-2 px-4 animate-fade-in">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => { setCurrentPage(link.id); setMenuOpen(false); }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === link.id ? 'text-[#1F3A5F] dark:text-[#7BAFD4] font-semibold' : 'text-[#6B6560] dark:text-[#9A9690]'}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
