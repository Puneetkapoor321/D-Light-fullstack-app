import { User, Phone, Car, MapPin, Calendar, Clock, XCircle, Trash2, CheckCircle } from 'lucide-react';
import { useBookings } from '../../context/BookingsContext';

export default function ViewBookings() {
  const { bookings, loading, deleteBooking, updateBookingStatus } = useBookings();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to permanently delete this reservation? This cannot be undone.")) {
       deleteBooking(id);
    }
  };

  const updateStatus = (id: number, status: string) => {
    updateBookingStatus(id, status);
  };

  if (loading) return (
    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh] gap-3 md:gap-4">
      <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] text-gray-400 font-heading">Syncing Reservations...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-14 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-12">
        <div>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase mb-1 md:mb-2 font-heading">Bookings Central</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Real-time reservation management engine</p>
        </div>
        <div className="bg-black text-white px-3 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] self-start md:self-center shadow-xl shadow-black/10">
           {bookings.length} Total Records
        </div>
      </div>

      <div className="grid gap-4 md:gap-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12 md:py-24 bg-gray-50/50 rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
             <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 md:mb-6 text-gray-200">
                <Clock size={24} className="md:w-[40px] md:h-[40px]" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-[8px] md:text-[10px]">No reservation data found in the cloud</p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Schedule</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Financials</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                           <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {bookings.map((booking) => (
                           <tr key={booking.id} className="hover:bg-gray-50/30 transition-colors">
                              <td className="px-8 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                       <User size={20} />
                                    </div>
                                    <div>
                                       <div className="font-heading font-black text-gray-900 uppercase tracking-tight">{booking.customer_name}</div>
                                       <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                                          <Phone size={12} className="text-[var(--color-accent)]" /> {booking.phone}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                       <Car size={20} />
                                    </div>
                                    <div>
                                       <div className="font-heading font-black text-gray-900 uppercase tracking-tight">{booking.car_name}</div>
                                       <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                                          <MapPin size={12} className="text-[var(--color-accent)]" /> {booking.location}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-8">
                                 <div className="space-y-1.5">
                                    <div className="flex items-center gap-2.5 text-sm font-bold text-gray-700">
                                       <Calendar size={14} className="text-gray-400" />
                                       {new Date(booking.pickup_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)] ml-6 opacity-60">
                                       DURATION: {booking.total_days} DAYS
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-8">
                                 <div className="font-heading font-black text-xl text-gray-900">₹{booking.total_price}</div>
                                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                                    RATE: ₹{booking.price_per_day}/DAY
                                 </div>
                              </td>
                              <td className="px-8 py-8">
                                 <span className={`
                                    px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border
                                    ${booking.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 
                                      booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                                      'bg-yellow-50 text-yellow-600 border-yellow-100'}
                                 `}>
                                    {booking.status}
                                 </span>
                              </td>
                              <td className="px-8 py-8 text-right">
                                 <div className="flex justify-end gap-2.5">
                                    {booking.status === 'pending' && (
                                       <>
                                          <button 
                                            onClick={() => updateStatus(booking.id, 'approved')}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm border border-green-100"
                                            title="Approve Booking"
                                          >
                                             <CheckCircle size={18} />
                                          </button>
                                          <button 
                                            onClick={() => updateStatus(booking.id, 'rejected')}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                                            title="Reject Booking"
                                          >
                                             <XCircle size={18} />
                                          </button>
                                       </>
                                    )}
                                    <button 
                                      onClick={() => handleDelete(booking.id)}
                                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm border border-gray-100"
                                      title="Delete Permanently"
                                    >
                                       <Trash2 size={18} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden relative">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                            <User size={14} />
                         </div>
                         <div>
                            <div className="font-heading font-black text-[11px] uppercase tracking-tight">{booking.customer_name}</div>
                            <div className="text-[8px] font-bold text-gray-400">{booking.phone}</div>
                         </div>
                      </div>
                      <span className={`
                          px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border
                          ${booking.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' : 
                            booking.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                            'bg-yellow-50 text-yellow-600 border-yellow-100'}
                      `}>
                          {booking.status}
                      </span>
                   </div>

                   <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                         <Car size={12} className="text-[var(--color-accent)]" />
                         {booking.car_name}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                         <Calendar size={12} className="text-[var(--color-accent)]" />
                         {new Date(booking.pickup_date).toLocaleDateString()} ({booking.total_days} Days)
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                         <MapPin size={12} className="text-[var(--color-accent)]" />
                         {booking.location}
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-gray-50/50">
                      <div>
                         <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest block mb-0.5">Total Value</span>
                         <span className="text-lg font-black text-gray-900 tracking-tighter">₹{booking.total_price}</span>
                      </div>
                      <div className="flex gap-1.5">
                         {booking.status === 'pending' && (
                            <>
                               <button 
                                 onClick={() => updateStatus(booking.id, 'approved')}
                                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 border border-green-100 shadow-sm"
                               >
                                  <CheckCircle size={14} />
                               </button>
                               <button 
                                 onClick={() => updateStatus(booking.id, 'rejected')}
                                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-100 shadow-sm"
                               >
                                  <XCircle size={14} />
                               </button>
                            </>
                         )}
                         <button 
                           onClick={() => handleDelete(booking.id)}
                           className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-red-400 border border-gray-100 shadow-sm"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
