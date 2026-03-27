import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Instagram, Facebook, Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cars from './pages/Cars';
import Booking from './pages/Booking';
import Social from './pages/Social';
import Contact from './pages/Contact';

import { CarsProvider } from './context/CarsContext';
import { BookingsProvider } from './context/BookingsContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

// Admin - Lazy Loaded
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminRegister = lazy(() => import('./pages/Admin/Register'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const ManageCars = lazy(() => import('./pages/Admin/ManageCars'));
const ViewBookings = lazy(() => import('./pages/Admin/ViewBookings'));
const ContactSettings = lazy(() => import('./pages/Admin/ContactSettings'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
    <Loader2 className="w-10 h-10 animate-spin text-black opacity-20" />
  </div>
);

const LandingPage = () => {
  const { settings } = useSettings();
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-[20px]');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col pt-12">
        <Home />
        <Cars />
        <Booking />
        <Social />
        <Contact />
      </main>

      <footer className="bg-black py-6 md:py-8 px-6 md:px-12 w-full mt-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start cursor-pointer group">
            <div className="font-heading font-extrabold text-2xl tracking-wide text-white">
              D
              <span className="text-[var(--color-accent)] group-hover:text-white transition-colors">
                -
              </span>
              LIGHT
            </div>
            <div className="text-[9px] font-black tracking-[0.4em] text-white/40 mt-[-2px] uppercase">
              Car Rentals
            </div>
            {settings.address && (
              <p className="text-[14px] text-white font-medium mt-3 max-w-[280px] leading-normal text-left tracking-wide">
                {settings.address}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/3 text-center flex flex-col items-center gap-1.5">
            <p className="text-white text-[15px] md:text-lg font-heading tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-90 leading-tight">
              Let's, Design your Vision of travel.
            </p>
            <div className="mt-2 text-[var(--color-accent)] text-[9px] md:text-[11px] font-semibold tracking-widest opacity-80 hover:opacity-100 transition-all duration-300 cursor-default group/dev flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[var(--color-accent)]/20"></span>
              <span>
                Developed by{" "}
                <span className="group-hover/dev:text-white transition-colors">
                  Puneet Kapoor
                </span>{" "}
                | Designed by{" "}
                <span className="group-hover/dev:text-white transition-colors">
                  Puneet Kapoor
                </span>
              </span>
              <span className="w-4 h-[1px] bg-[var(--color-accent)]/20"></span>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex gap-4 justify-center md:justify-end">
            <a
              href="https://www.instagram.com/i.punitkapoor_/"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-black hover:scale-110 transition-all duration-300"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 text-white/70 flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-black hover:scale-110 transition-all duration-300"
            >
              <Facebook size={16} fill="currentColor" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <CarsProvider>
        <BookingsProvider>
          <SettingsProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cars" element={<ManageCars />} />
                  <Route path="bookings" element={<ViewBookings />} />
                  <Route path="settings" element={<ContactSettings />} />
                </Route>
              </Routes>
            </Suspense>
          </SettingsProvider>
        </BookingsProvider>
      </CarsProvider>
    </Router>
  )
}

export default App;
