import { useEffect, useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Car, CalendarCheck, Settings, LogOut, Menu, X, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../config';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard Overview' },
  { path: '/admin/cars', icon: Car, label: 'Manage Cars' },
  { path: '/admin/bookings', icon: CalendarCheck, label: 'View Bookings' },
  { path: '/admin/settings', icon: Settings, label: 'Contact Settings' },
];

export default function AdminLayout() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setIsSidebarOpen(false); // Close sidebar on navigation
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to delete your admin account? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/admin/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        alert('Account deleted successfully.');
        handleLogout();
      } else {
        alert('Failed to delete account.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting account.');
    }
  };
  const handleBackToSite = () => {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-bg-soft)] relative overflow-x-hidden">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-[var(--color-border)] z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToSite}
            className="w-10 h-10 flex items-center justify-center bg-[#facc15] text-black rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-300 shadow-sm group"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-[18px] text-black tracking-tighter leading-none">
              D<span className="text-[#facc15] mx-[1px]">-</span>Light
            </span>
            <span className="font-bold text-[#9ca3af] text-[9px] uppercase tracking-[0.2em] mt-0.5">
              Internal Engine
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 bg-gray-50 rounded-xl text-black hover:bg-gray-100 transition-all border border-[var(--color-border)]"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] bg-white border-r border-[var(--color-border)] shadow-xl lg:shadow-none z-50 flex flex-col transition-transform duration-500 transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-[var(--color-border)] flex items-center gap-5">
          <button 
            onClick={handleBackToSite}
            className="w-10 h-10 min-w-[40px] flex items-center justify-center bg-[#facc15] text-black rounded-full hover:scale-110 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-300 shadow-sm shrink-0"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <span className="font-heading font-black text-[18px] text-black tracking-tighter leading-none">
              D<span className="text-[#facc15] mx-[1px]">-</span>Light
            </span>
            <span className="font-black text-[#9ca3af] text-[9px] uppercase tracking-[0.2em] mt-1">
              Internal Engine
            </span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1.5 px-4 overflow-y-auto">

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-black text-white shadow-xl shadow-black/10' 
                    : 'text-[var(--color-text-muted)] hover:bg-gray-50 hover:text-black'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[var(--color-accent)]' : 'opacity-40'} />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-[var(--color-border)] flex flex-col gap-3">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-4 px-6 py-4 text-gray-500 hover:bg-gray-50 hover:text-black transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} className="opacity-40" />
            Sign Out
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="flex w-full items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 transition-all rounded-2xl font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} className="rotate-180 opacity-40" />
            Delete Records
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className={`flex-1 w-full min-h-screen transition-all duration-500 pt-16 lg:pt-0 lg:ml-[260px] bg-white/40`}>
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
