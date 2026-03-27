import { useEffect, useState, useMemo } from 'react';
import { Car, CalendarCheck, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCars } from '../../context/CarsContext';
import { useBookings } from '../../context/BookingsContext';
import { API_BASE_URL } from '../../config';

interface Stats {
  total_cars: number;
  total_bookings: number;
  pending_bookings: number;
  monthly_bookings: number;
}

export default function Dashboard() {
  const { cars } = useCars();
  const { bookings } = useBookings();
  const [stats, setStats] = useState<Stats | null>(null);

  // Derived Stats for real-time consistency
  const totalBookings = bookings.length;
  const pendingBookings = useMemo(() => bookings.filter(b => b.status === 'pending').length, [bookings]);
  const recentBookings = useMemo(() => bookings.slice(0, 5), [bookings]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };

    fetchDashboardStats();
  }, [bookings.length]);

  return (
    <div className="flex flex-col gap-6 md:gap-10 w-full animate-in fade-in duration-700 p-4 md:p-14 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
         <div>
            <h1 className="font-heading font-black text-xl md:text-3xl tracking-tighter uppercase mb-1 md:mb-2">Workspace</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Real-time fleet monitoring engine</p>
         </div>
         <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-100/50 border border-gray-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full self-start md:self-center">
            Refreshed Real-time
         </div>
      </div>

      {/* Stats Grid: 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        <StatCard title="Cars" value={cars.length} icon={Car} color="bg-blue-50 text-blue-600" />
        <StatCard title="Bookings" value={totalBookings} icon={CalendarCheck} color="bg-green-50 text-green-600" />
        <StatCard title="Pending" value={pendingBookings} icon={Clock} color="bg-yellow-50 text-yellow-600" />
        <StatCard title="Volume" value={stats?.monthly_bookings ?? 0} icon={TrendingUp} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mt-2 md:mt-4">
        <div className="px-6 py-4 md:px-8 md:py-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <h2 className="font-heading font-extrabold text-sm md:text-xl tracking-tighter uppercase">RECENT ACTIVITY</h2>
          <Link to="/admin/bookings" className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[var(--color-accent)] hover:underline flex items-center gap-1.5 px-3 py-1.5 rounded-lg md:rounded-xl bg-purple-50">
             View Records <ChevronRight size={12} className="md:w-[14px]" />
          </Link>
        </div>
        
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Customer</th>
                <th className="px-8 py-4">Vehicle</th>
                <th className="px-8 py-4">Usage Fee</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                     <div className="font-heading font-black text-gray-900 tracking-tight uppercase text-sm">{b.customer_name}</div>
                     <div className="text-[10px] font-bold text-gray-400 mt-0.5">{b.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                     <div className="font-bold text-gray-900">{b.car_name}</div>
                     <div className="text-[10px] font-semibold text-gray-400">Duration: {b.total_days} Days</div>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">₹{b.total_price}</td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                      b.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      b.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBookings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest text-[10px]">
                    No recent booking activity detected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
           {recentBookings.map(b => (
             <div key={b.id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="font-heading font-black text-gray-900 tracking-tight uppercase text-xs">{b.customer_name}</div>
                      <div className="text-[8px] font-bold text-gray-400">{b.phone}</div>
                   </div>
                   <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border ${
                      b.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      b.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {b.status}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-[10px] font-bold text-gray-600">{b.car_name}</div>
                      <div className="text-[8px] text-gray-400 font-medium">Duration: {b.total_days} Days</div>
                   </div>
                   <div className="font-black text-gray-900 tracking-tighter text-base">₹{b.total_price}</div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover-lift transition-all shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-gray-500 text-[10px] md:text-[13px] font-semibold uppercase tracking-[0.15em] mb-1 md:mb-2">{title}</h3>
        <p className="font-heading font-black text-2xl md:text-4xl tracking-tighter text-gray-900 leading-tight">{value}</p>
      </div>
      <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-inner shrink-0 ${color}`}>
        <Icon size={18} className="md:w-[28px] md:h-[28px]" />
      </div>
    </div>
  );
}
