import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Toast from './components/Toast';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import MyTrips from './pages/MyTrips';
import About from './pages/About';

function PageRouter() {
  const { currentPage } = useApp();

  const pages: Record<string, React.ReactNode> = {
    home: <Home />,
    explore: <Explore />,
    planner: <Planner />,
    'my-trips': <MyTrips />,
    about: <About />,
  };

  return (
    <div className="bg-[#F0EEEA] dark:bg-[#111310] min-h-screen transition-colors duration-300">
      <Navbar />
      <main className="animate-fade-in" key={currentPage}>
        {pages[currentPage] ?? <Home />}
      </main>
      <Chatbot />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}
