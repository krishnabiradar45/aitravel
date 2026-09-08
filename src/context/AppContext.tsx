import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type SavedTrip, type GeneratedItinerary, initialSavedTrips } from '../data/mockAI';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  savedTrips: SavedTrip[];
  saveTrip: (trip: SavedTrip) => void;
  deleteTrip: (id: string) => void;
  currentItinerary: GeneratedItinerary | null;
  setCurrentItinerary: (it: GeneratedItinerary | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  plannerDestination: string;
  setPlannerDestination: (d: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(initialSavedTrips);
  const [currentItinerary, setCurrentItinerary] = useState<GeneratedItinerary | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [plannerDestination, setPlannerDestination] = useState('');

  const toggleDarkMode = useCallback(() => {
    setDarkMode(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const login = useCallback((email: string, name: string) => {
    setUser({ name, email, avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}` });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const saveTrip = useCallback((trip: SavedTrip) => {
    setSavedTrips(prev => {
      const exists = prev.find(t => t.id === trip.id);
      if (exists) return prev.map(t => (t.id === trip.id ? trip : t));
      return [...prev, trip];
    });
  }, []);

  const deleteTrip = useCallback((id: string) => {
    setSavedTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = String(Date.now());
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      darkMode, toggleDarkMode,
      user, login, logout,
      savedTrips, saveTrip, deleteTrip,
      currentItinerary, setCurrentItinerary,
      toasts, showToast,
      searchQuery, setSearchQuery,
      plannerDestination, setPlannerDestination,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
