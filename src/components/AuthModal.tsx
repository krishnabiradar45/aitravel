import { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      login(email, name || email.split('@')[0]);
      showToast(mode === 'signup' ? 'Account created! Welcome to TravelAI.' : 'Welcome back!');
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      showToast('Reset link sent to your email.', 'info');
      setLoading(false);
      setMode('login');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1C1E1A] rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6B6560] hover:text-[#0D0D0D] dark:hover:text-white transition-colors text-2xl">×</button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl">✈️</span>
            <span className="font-serif text-2xl font-bold text-[#1F3A5F] dark:text-[#7BAFD4]">TravelAI</span>
          </div>
          <h2 className="font-serif text-xl font-semibold text-[#0D0D0D] dark:text-white">
            {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
          </h2>
        </div>

        {mode !== 'forgot' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-[#6B6560] dark:text-[#9A9690] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Traveller"
                  className="w-full px-4 py-3 rounded-lg border border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#6B6560] dark:text-[#9A9690] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B6560] dark:text-[#9A9690] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
              />
            </div>
            {mode === 'login' && (
              <button type="button" onClick={() => setMode('forgot')} className="text-sm text-[#1F3A5F] dark:text-[#7BAFD4] hover:underline">
                Forgot password?
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1F3A5F] text-white rounded-lg font-semibold hover:bg-[#2d5280] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6B6560] dark:text-[#9A9690] mb-1">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D4D0C8] dark:border-[#2E302B] bg-[#F0EEEA] dark:bg-[#252720] text-[#0D0D0D] dark:text-white placeholder-[#9A9690] focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1F3A5F] text-white rounded-lg font-semibold hover:bg-[#2d5280] transition-colors disabled:opacity-60"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-sm text-[#6B6560] dark:text-[#9A9690]">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-[#1F3A5F] dark:text-[#7BAFD4] font-semibold hover:underline">Sign up</button>
            </>
          ) : mode === 'signup' ? (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#1F3A5F] dark:text-[#7BAFD4] font-semibold hover:underline">Sign in</button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-[#1F3A5F] dark:text-[#7BAFD4] font-semibold hover:underline">← Back to sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}
