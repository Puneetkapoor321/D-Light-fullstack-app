import { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Car as CarIcon, X, Info, Gauge, Fuel, Upload, Loader2, LayoutGrid, InfoIcon } from 'lucide-react';
import { useCars } from '../../context/CarsContext';
import type { Car } from '../../types';
import { getImageUrl } from '../../config';

// -------------------- Sub-Components --------------------

// Car Card for Admin Panel
const CarCard = ({ 
  car, 
  onEdit, 
  onDelete, 
  onStatusToggle 
}: { 
  car: Car, 
  onEdit: (c: Car) => void, 
  onDelete: (id: number) => void, 
  onStatusToggle: (id: number, s: string) => void 
}) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full animate-fade-up">
      <div className="relative h-48 md:h-56 bg-gray-50 overflow-hidden shrink-0 group-hover:bg-gray-100 transition-colors">
        {car?.image_url ? (
          <img 
            src={getImageUrl(car.image_url)} 
            alt={car?.name || "unnamed car"} 
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <CarIcon size={48} className="opacity-20 translate-y-2 group-hover:translate-y-0 transition-transform" />
          </div>
        )}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-xl backdrop-blur-xl border transition-all duration-500 ${
          car?.status === 'active' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${car?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          {car?.status === 'active' ? 'ACTIVE' : 'OFFLINE'}
        </div>
      </div>
      
      <div className="p-6 md:p-8 flex flex-col flex-1 bg-gradient-to-b from-white to-gray-50/30">
        <div className="flex justify-between items-start mb-6">
          <div className="max-w-[70%] text-left">
            <h3 className="font-heading font-black text-lg md:text-xl text-gray-900 tracking-tight uppercase leading-tight line-clamp-1 group-hover:text-amber-500 transition-colors">{car?.name || "No Name"}</h3>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 truncate">{car?.brand || "Brand"}</p>
          </div>
          <div className="text-right">
            <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">₹{car?.price_per_day}</span>
            <span className="text-[9px] block text-gray-400 uppercase font-bold tracking-tight">/Day</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-8">
           <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl text-[9px] font-black text-gray-500 border border-gray-100 shadow-sm transition-all hover:border-amber-200">
              <Fuel size={12} className="text-amber-500 shrink-0" />
              {car?.fuel_type}
           </div>
           <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl text-[9px] font-black text-gray-500 border border-gray-100 shadow-sm transition-all hover:border-amber-200">
              <Gauge size={12} className="text-amber-500 shrink-0" />
              {car?.transmission}
           </div>
        </div>
        
        <div className="flex gap-3 mt-auto pt-6 border-t border-gray-100 items-center">
          <button 
            onClick={() => car?.id && onStatusToggle(car.id, car.status === 'active' ? 'inactive' : 'active')}
            title={car?.status === 'active' ? 'Hide from public' : 'Make public'}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-md active:scale-90 border-2 ${
              car?.status === 'active' 
                ? 'bg-emerald-50 text-emerald-500 border-emerald-100 hover:bg-emerald-100' 
                : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white hover:border-amber-500/20'
            }`}
          >
            {car?.status === 'active' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </button>

          <button 
            onClick={() => onEdit(car)}
            className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95 duration-300"
          >
            <Edit2 size={12} /> Sync Node
          </button>
          
          <button 
            onClick={() => car?.id && onDelete(car.id)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-red-300 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Form Modal for Adding/Editing Cars
const CarFormModal = ({ isOpen, onClose, onSubmit, initialData }: { isOpen: boolean, onClose: () => void, onSubmit: (f: any) => Promise<void>, initialData: any }) => {
  const { uploadCarImage } = useCars();
  const [formData, setFormData] = useState<any>(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData || {
      name: '', brand: '', price_per_day: 0, fuel_type: 'Petrol', 
      transmission: 'Manual', seats: 5, image_url: '', is_available: true, status: 'inactive',
      category: 'Luxury', color: '', description: ''
    });
    setError(null);
  }, [initialData, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
       setError('Illegal Asset: Only images (JPG/PNG/WEBP) allowed.');
       return;
    }
    if (file.size > 5 * 1024 * 1024) {
       setError('Buffer Overflow: File size exceeds 5MB limit.');
       return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const res = await uploadCarImage(file);
      // Backend returns full URL or relative path
      setFormData({ ...formData, image_url: res.image_url });
    } catch (err: any) {
      setError(err.message || 'Transmission Error: Asset upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      setError('Missing Asset: Car visual identity is required.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'System Error: Node synchronization failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500 overflow-y-auto">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 md:px-12 py-8 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl md:text-3xl font-heading font-black tracking-tighter uppercase leading-none">
              {initialData?.id ? 'SYNC NODE' : 'REGISTER ENTITY'}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] shadow-inner px-3 py-1 bg-gray-50 rounded-full inline-block">
                Garage Interface v5.2
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm active:scale-95">
            <X size={20} />
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Left Column: Form Fields */}
            <div className="space-y-8">
               <div className="flex flex-col gap-3">
                 <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">DESIGNATION MODEL</label>
                 <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner" placeholder="e.g. BMW M4 COMPETITION" />
               </div>
               
               <div className="flex flex-col gap-3">
                 <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">MANUFACTURER</label>
                 <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner" placeholder="e.g. BMW AG" />
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">DAILY FEE (₹)</label>
                    <input required type="number" value={formData.price_per_day} onChange={e => setFormData({...formData, price_per_day: Number(e.target.value)})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">SEATS</label>
                    <input required type="number" value={formData.seats} onChange={e => setFormData({...formData, seats: Number(e.target.value)})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner" />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">TRANSMISSION</label>
                    <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner cursor-pointer">
                      <option value="Manual">Manual Stick</option>
                      <option value="Automatic">Full Automatic</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">FUEL SOURCE</label>
                    <select value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner cursor-pointer">
                      <option value="Petrol">Petrol / Octane</option>
                      <option value="Diesel">Diesel Power</option>
                      <option value="Electric">Sustainable EV</option>
                      <option value="Hybrid">Dual Hybrid</option>
                    </select>
                  </div>
               </div>
               
               <div className="flex flex-col gap-3">
                 <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">DESCRIPTION (ENTITY LOG)</label>
                 <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-gray-50 border-2 border-transparent focus:border-amber-500/20 focus:bg-white px-6 py-5 rounded-2xl outline-none transition-all font-bold text-sm shadow-inner min-h-[120px] resize-none" placeholder="Enter technical specifications or notes..." />
               </div>
            </div>

            {/* Right Column: Image Upload & Status */}
            <div className="flex flex-col gap-8">
               <div className="flex flex-col gap-4">
                   <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">Visual Identity</label>
                   
                   <div 
                      className={`group/upload relative rounded-[2.5rem] p-6 border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center overflow-hidden min-h-[280px] cursor-pointer ${formData.image_url ? 'border-amber-500/10 bg-gray-50' : 'border-gray-100 bg-gray-50/50 hover:border-amber-500/30 hover:bg-amber-50/10'}`}
                      onClick={() => document.getElementById('car-image-upload')?.click()}
                   >
                      <input id="car-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center text-amber-500 animate-pulse">
                           <Loader2 size={40} className="animate-spin mb-4" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">SYNCHRONIZING ASSETS...</p>
                        </div>
                      ) : formData.image_url ? (
                        <div className="relative w-full aspect-[16/10] animate-in zoom-in-95 duration-500">
                           <img src={getImageUrl(formData.image_url)} alt="Preview" className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/upload:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-md rounded-3xl">
                              <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-xl tracking-[0.2em] transform -translate-y-2 group-hover/upload:translate-y-0 transition-transform">
                                 <Plus size={16} /> Update Image
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-300 group-hover/upload:text-amber-500 transition-colors">
                           <Upload size={48} className="mb-4 opacity-20 group-hover/upload:opacity-100 transition-all group-hover/upload:scale-110" />
                           <p className="text-[10px] font-black uppercase tracking-[0.25em]">DROP VISUAL ASSET</p>
                           <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase">MAX PAYLOAD: 5MB</p>
                        </div>
                      )}
                   </div>
                   
                   {/* Status Toggle in Modal */}
                   {formData.image_url && (
                     <div className="flex justify-center mt-2 animate-in slide-in-from-bottom-4 duration-700">
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'})}
                          className={`group/sw relative px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all duration-500 shadow-xl border-2 ${
                            formData.status === 'active' 
                              ? 'bg-black text-[var(--color-accent)] border-black' 
                              : 'bg-gray-100 text-gray-400 border-gray-100 hover:border-gray-200'
                          }`}
                        >
                           {formData.status === 'active' ? (
                             <>
                               <CheckCircle2 size={16} className="text-emerald-500" />
                               <span>FEED: LIVE</span>
                             </>
                           ) : (
                             <>
                               <XCircle size={16} />
                               <span>FEED: OFFLINE</span>
                             </>
                           )}
                        </button>
                     </div>
                   )}
               </div>
               
               {error && (
                  <div className="bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 text-[10px] font-black uppercase tracking-widest flex items-start gap-4 animate-in bounce-in duration-500">
                     <AlertCircle size={20} className="shrink-0 mt-0.5" />
                     <span className="leading-relaxed">{error}</span>
                  </div>
               )}

               <div className="mt-auto space-y-4">
                  <div className="bg-amber-50/50 text-amber-600 p-6 rounded-[2rem] border border-amber-100/50 text-[10px] font-bold uppercase tracking-widest flex items-start gap-4 leading-relaxed group hover:bg-amber-50 transition-colors">
                     <InfoIcon size={18} className="shrink-0 mt-0.5 text-amber-500 opacity-60 group-hover:scale-110 transition-transform" />
                     <span>SYSTEM NOTIFY: Propagation will be instantaneous across all public nodes after sync.</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting || isUploading}
                    className="w-full bg-black text-white font-black py-6 rounded-[2rem] hover:bg-amber-500 hover:text-black transition-all duration-500 uppercase tracking-[0.3em] shadow-2xl active:scale-95 text-xs flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing Sync...
                        </>
                    ) : (
                        initialData?.id ? 'EXECUTE SYNC' : 'INITIATE RECORD'
                    )}
                  </button>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------- Main Page Section --------------------

export default function ManageCars() {
  const { cars, addCar, updateCar, deleteCar, loading, updateCarStatus } = useCars();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const initialFormState: any = {
    name: '', 
    brand: '',
    price_per_day: 1500,
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    image_url: "",
    is_available: true,
    status: 'inactive',
    category: "Luxury",
    color: '', 
    description: ''
  };

  const handleCreateOrUpdate = async (formData: any) => {
    if (formData.id) {
      await updateCar(formData.id, formData);
    } else {
      await addCar(formData);
    }
    // Modal closure handling inside the component to ensure it waits for the async op
  };

  // Performant filtering with useMemo
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const carName = car?.name || '';
      const carBrand = car?.brand || '';
      const matchesSearch = carName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             carBrand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                             (statusFilter === 'available' ? car.status === 'active' : car.status === 'inactive');
      return matchesSearch && matchesStatus;
    });
  }, [cars, searchQuery, statusFilter]);

  if (loading) return (
    <div className="p-12 text-center h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-8 font-black text-[10px] uppercase tracking-[0.4em] text-gray-300 font-heading">Syncing Garage Matrix...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-14 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.25em] text-amber-600 uppercase">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
             Garage Network Online
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-none font-heading text-gray-900">Fleet Control</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Cloud access node: {API_BASE_URL}</p>
        </div>
        
        <button 
          onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
          className="bg-black text-white px-8 py-5 md:px-12 md:py-6 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-amber-500 hover:text-black transition-all duration-500 shadow-2xl hover:shadow-amber-500/20 uppercase tracking-[0.2em] text-[10px] md:text-xs active:scale-95 group"
        >
          <Plus size={18} className="transition-transform group-hover:rotate-90 duration-500" /> New Vehicle Entity
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12 md:mb-16">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-all duration-300" size={18} />
          <input 
            type="text" 
            placeholder="Query records by name or manufacturer..." 
            className="w-full pl-16 pr-8 py-5 rounded-2xl border-2 border-transparent bg-gray-50/50 shadow-inner outline-none focus:border-amber-500/10 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-gray-300"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className="w-full md:w-auto px-10 py-5 rounded-2xl border-2 border-transparent bg-gray-50/50 shadow-inner outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer focus:border-amber-500/10 focus:bg-white transition-all pr-16"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">COLLECTION: ALL</option>
            <option value="available">FILTER: ACTIVE</option>
            <option value="booked">FILTER: HIDDEN</option>
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
             <LayoutGrid size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <CarCard 
              key={car.id} 
              car={car} 
              onEdit={(c) => { setEditingCar(c); setIsModalOpen(true); }} 
              onDelete={deleteCar}
              onStatusToggle={updateCarStatus}
            />
          ))
        ) : (
          <div className="col-span-full py-24 md:py-40 flex flex-col items-center justify-center text-center bg-gray-50/30 rounded-[3rem] border-4 border-dashed border-gray-100/50">
             <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center mb-8 text-gray-200 border border-gray-50 group hover:scale-110 transition-transform">
                <CarIcon size={40} className="opacity-20 translate-y-2 group-hover:translate-y-0 transition-all" />
             </div>
             <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">No records matching system query</p>
             <button 
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="mt-6 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:underline underline-offset-8"
              >
                Reset System Filters
              </button>
          </div>
        )}
      </div>

      <CarFormModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingCar(null); }} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingCar || initialFormState}
      />
    </div>
  );
}
