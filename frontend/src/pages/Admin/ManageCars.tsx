import { useEffect, useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, CheckCircle2, XCircle, Car as CarIcon, X, Info, Gauge, Fuel, Upload, Loader2 } from 'lucide-react';
import { useCars } from '../../context/CarsContext';
import type { Car } from '../../types';

// --- Sub-Components ---

const CarCard = ({ car, onEdit, onDelete, onStatusToggle }: { car: Car, onEdit: (c: Car) => void, onDelete: (id: number) => void, onStatusToggle: (id: number, s: string) => void }) => {
  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] lg:rounded-[20px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 group flex flex-col h-full w-full">
      <div className="relative h-40 md:h-56 lg:h-[220px] bg-gray-50 overflow-hidden shrink-0">
        {car?.image_url ? (
          <img 
            src={car.image_url} 
            alt={car?.name || "unnamed car"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <CarIcon size={32} className="md:w-16 md:h-16" />
          </div>
        )}
        <div className={`absolute top-3 right-3 md:top-6 md:right-6 px-2 py-1 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-1 md:gap-1.5 shadow-sm border backdrop-blur-md ${
          car?.status === 'active' 
            ? 'bg-green-50/90 text-green-600 border-green-100' 
            : 'bg-red-50/90 text-red-600 border-red-100'
        }`}>
          {car?.status === 'active' ? <CheckCircle2 size={10} className="md:w-3 md:h-3" /> : <XCircle size={10} className="md:w-3 md:h-3" />}
          {car?.status === 'active' ? 'LIVE' : 'OFFLINE'}
        </div>
      </div>
      
      <div className="p-4 md:p-8 lg:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 md:mb-8">
          <div className="max-w-[70%] text-left">
            <h3 className="font-heading font-black text-sm md:text-xl lg:text-2xl text-gray-900 tracking-tight uppercase leading-tight line-clamp-1">{car?.name || "No Name"}</h3>
            <p className="text-[8px] md:text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-widest mt-1 md:mt-2 truncate">{car?.brand || "Brand"}</p>
          </div>
          <div className="text-right">
            <span className="text-base md:text-2xl lg:text-3xl font-black text-gray-900 tracking-tighter">₹{car?.price_per_day || 0}</span>
            <span className="text-[8px] md:text-[10px] block text-gray-400 uppercase font-bold tracking-tight">/Day</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-8">
           <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold text-gray-500 border border-gray-100">
              <Fuel size={10} className="text-[var(--color-accent)] md:w-3 md:h-3" />
              {car?.fuel_type}
           </div>
           <div className="flex items-center gap-1.5 md:gap-2 bg-gray-50 px-2 py-1.5 md:px-3 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-bold text-gray-500 border border-gray-100">
              <Gauge size={10} className="text-[var(--color-accent)] md:w-3 md:h-3" />
              {car?.transmission}
           </div>
        </div>
        
        <div className="flex gap-2 md:gap-4 mt-auto pt-4 md:pt-6 border-t border-gray-50 items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); car?.id && onStatusToggle(car.id, car.status === 'active' ? 'inactive' : 'active') }}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl transition-all shadow-sm active:scale-95 ${
              car?.status === 'active' 
                ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100' 
                : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'
            }`}
          >
            {car?.status === 'active' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          </button>

          <button 
            onClick={() => onEdit(car)}
            className="flex-1 flex items-center justify-center gap-1.5 md:gap-3 py-2.5 md:py-4 rounded-xl bg-black text-white font-black text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-purple-600 transition-all shadow-lg active:scale-95"
          >
            <Edit2 size={10} /> Modify
          </button>
          
          <button 
            onClick={() => car?.id && onDelete(car.id)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-red-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CarFormModal = ({ isOpen, onClose, onSubmit, initialData }: { isOpen: boolean, onClose: () => void, onSubmit: (f: any) => void, initialData: any }) => {
  const { uploadCarImage } = useCars();
  const [formData, setFormData] = useState<any>(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData(initialData || {
      name: '', brand: '', price_per_day: 0, fuel_type: 'Petrol', 
      transmission: 'Manual', seats: 5, image_url: '', is_available: true, status: 'inactive',
      category: 'Standard', color: '', description: ''
    });
    setError(null);
  }, [initialData, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
       setError('Invalid file type. Please upload an image (JPG, PNG, WEBP).');
       return;
    }
    if (file.size > 5 * 1024 * 1024) {
       setError('File too large. Maximum size is 5MB.');
       return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const res = await uploadCarImage(file);
      setFormData({ ...formData, image_url: res.image_url });
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      setError('Please upload an image before confirming registration.');
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center md:items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto px-4 py-8">
      <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="px-6 md:px-12 py-5 md:py-8 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl md:text-3xl font-heading font-black tracking-tighter uppercase">{initialData?.id ? 'SYNC VEHICLE' : 'REGISTER A NEW CAR'}</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[9px] mt-0.5 md:mt-1 shadow-inner px-2 py-0.5 bg-gray-50 rounded-full inline-block">Cloud Node v5.2</p>
          </div>
          <button onClick={onClose} className="p-2 md:p-3 bg-gray-50 hover:bg-black hover:text-white rounded-xl md:rounded-2xl transition-all"><X size={18} /></button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-6 md:p-12 max-h-[70vh] md:max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-14">
            <div className="space-y-6 md:space-y-8">
               <div className="flex flex-col gap-1.5 md:gap-3">
                 <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">CAR DESIGNATION</label>
                 <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm" placeholder="e.g. BMW M4 Competition" />
               </div>
               <div className="flex flex-col gap-1.5 md:gap-3">
                 <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">MANUFACTURER</label>
                 <input required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm" placeholder="e.g. BMW AG" />
               </div>
               <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-1.5 md:gap-3">
                    <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">USAGE FEE (₹)</label>
                    <input required type="number" value={formData.price_per_day} onChange={e => setFormData({...formData, price_per_day: Number(e.target.value)})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5 md:gap-3">
                    <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">SEATING</label>
                    <input required type="number" value={formData.seats} onChange={e => setFormData({...formData, seats: Number(e.target.value)})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm" />
                  </div>
               </div>
               <div className="flex flex-col gap-1.5 md:gap-3">
                 <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">DESCRIPTION (OPTIONAL)</label>
                 <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm min-h-[100px]" placeholder="Vehicle details..." />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col gap-1.5 md:gap-3">
                    <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">TRANSMISSION</label>
                    <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm appearance-none cursor-pointer">
                      <option value="Manual">Manual Stick</option>
                      <option value="Automatic">Full Automatic</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 md:gap-3">
                    <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">PROPELLANT</label>
                    <select value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value})} className="bg-gray-50 border border-transparent focus:border-purple-300 focus:bg-white px-5 py-3 md:px-6 md:py-5 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-xs md:text-sm appearance-none cursor-pointer">
                      <option value="Petrol">Petrol / Octane</option>
                      <option value="Diesel">Diesel Power</option>
                      <option value="Electric">Sustainable EV</option>
                      <option value="Hybrid">Dual Hybrid</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-6 md:gap-8">
               <div className="flex flex-col gap-2 md:gap-3">
                   <label className="text-[8px] md:text-[10px] font-black uppercase text-gray-300 tracking-widest text-center">{initialData?.id ? 'Vehicle Identity' : 'Vehicle ID Section'}</label>
                   <div 
                      className={`group/upload relative bg-gray-50 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 border-2 border-dashed transition-all duration-500 flex flex-col items-center shadow-inner overflow-hidden ${formData.image_url ? 'border-purple-200 bg-purple-50/10' : 'border-gray-200 hover:border-purple-400 hover:bg-purple-50/30'}`}
                      onClick={() => document.getElementById('car-image-upload')?.click()}
                   >
                      <input 
                        id="car-image-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                      
                      {isUploading ? (
                        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-white flex flex-col items-center justify-center text-purple-600 animate-pulse">
                           <Loader2 size={32} className="animate-spin mb-2" />
                           <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">UPLOADING ASSETS...</p>
                        </div>
                      ) : formData.image_url ? (
                        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6 shadow-2xl border-2 md:border-4 border-white animate-in zoom-in-95 duration-500">
                           <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <div className="bg-white text-black px-4 py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase flex items-center gap-2">
                                 <Plus size={12} /> Replace Image
                              </div>
                           </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/10] rounded-2xl md:rounded-3xl bg-white flex flex-col items-center justify-center text-gray-300 mb-4 md:mb-6 border border-gray-100 cursor-pointer">
                           <Upload size={32} className="opacity-20 md:w-12 md:h-12 mb-2 group-hover/upload:scale-110 transition-transform" />
                           <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest opacity-40">Drop Car Image or Click</p>
                           <p className="text-[6px] md:text-[8px] font-bold text-gray-400 mt-1 uppercase">JPG, PNG, WEBP (MAX 5MB)</p>
                        </div>
                      )}

                      <div className="w-full text-center">
                        <h4 className="font-heading font-black text-sm md:text-2xl uppercase tracking-tighter text-gray-900 line-clamp-1">{formData.name || 'Vehicle ID'}</h4>
                        
                        {formData.image_url && (
                          <div className="flex items-center justify-center mt-3 md:mt-6 animate-in slide-in-from-bottom-2 duration-500">
                             <div 
                               onClick={(e) => { e.stopPropagation(); setFormData({...formData, status: formData.status === 'active' ? 'inactive' : 'active'}) }}
                               className={`group/toggle relative px-6 py-2.5 md:px-8 md:py-4 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 md:gap-3 cursor-pointer transition-all duration-500 shadow-xl overflow-hidden ${
                                 formData.status === 'active' 
                                   ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-900/20' 
                                   : 'bg-gray-200 text-gray-500'
                               }`}
                             >
                                <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover/toggle:opacity-100 transition-opacity`}></div>
                                {formData.status === 'active' ? (
                                  <>
                                    <CheckCircle2 size={12} className="animate-in zoom-in" />
                                    <span>Feed Active</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={12} className="animate-in zoom-in" />
                                    <span>Feed Not Active</span>
                                  </>
                                )}
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                   
                   {error && (
                      <div className="bg-red-50 text-red-500 p-3 md:p-4 rounded-xl border border-red-100 text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 animate-in shake duration-500">
                         <XCircle size={14} className="shrink-0" />
                         {error}
                      </div>
                   )}
               </div>

               <div className="mt-auto space-y-3 md:space-y-4">
                  <div className="bg-purple-50/80 text-purple-600 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-purple-100 text-[8px] md:text-[10px] font-bold uppercase tracking-widest flex items-start gap-2 md:gap-3 leading-relaxed">
                     <Info size={16} className="shrink-0 mt-0.5 md:w-5 md:h-5" />
                     <span>SYSTEM ALERT: Propagation will be instantaneous across the public frontend layer.</span>
                  </div>
                  <button type="submit" className="w-full bg-black text-white font-black py-4 md:py-6 rounded-xl md:rounded-[2rem] hover:bg-purple-600 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-purple-900/10 active:scale-95 text-[10px] md:text-xs">
                    {initialData?.id ? 'Confirm Changes' : 'Confirm Registration'}
                  </button>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page ---

export default function ManageCars() {
  const { cars, addCar, updateCar, deleteCar, loading, updateCarStatus } = useCars();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const initialFormState: any = {
    name: '', brand: '',
    price_per_day: 1200,
    fuel_type: "Petrol",
    transmission: "Manual",
    seats: 5,
    image_url: "",
    is_available: true,
    status: 'inactive',
    category: "Hatchback",
    color: '', description: ''
  };

  const handleCreateOrUpdate = async (formData: any) => {
    if (formData.id) {
      await updateCar(formData.id, formData);
    } else {
      await addCar(formData);
    }
    setIsModalOpen(false);
  };



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
    <div className="p-12 text-center h-screen flex flex-col items-center justify-center bg-gray-50/50">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-[8px] uppercase tracking-[0.3em] opacity-40 font-heading">SYNCING DATA BLOCKS...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-14 lg:px-8 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 mb-6 md:mb-16">
        <div>
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black tracking-widest text-[var(--color-accent)] uppercase mb-2 md:mb-3">
             <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
             Cloud Network Optimized
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter uppercase mb-1 md:mb-2 font-heading">Garage Control</h1>
        </div>
        <button 
          onClick={() => { setEditingCar(null); setIsModalOpen(true); }}
          className="bg-black text-white px-6 py-3 md:px-10 md:py-6 rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 md:gap-3 hover:bg-purple-600 transition-all shadow-xl shadow-black/10 uppercase tracking-widest text-[9px] md:text-[10px] active:scale-95 font-heading self-start md:self-center"
        >
          <Plus size={16} className="md:w-[18px]" /> Add New Car
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-8 md:mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Query records..." 
            className="w-full pl-12 md:pl-16 pr-5 md:pr-6 py-3 md:py-5 rounded-xl md:rounded-2xl border border-gray-100 bg-white shadow-sm outline-none focus:ring-2 md:focus:ring-4 focus:ring-purple-50 transition-all font-bold text-xs md:text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="px-6 py-3 md:px-10 md:py-5 rounded-xl md:rounded-2xl border border-gray-100 bg-white shadow-sm outline-none font-bold text-[9px] md:text-[10px] uppercase tracking-widest appearance-none cursor-pointer focus:ring-2 md:focus:ring-4 focus:ring-purple-50 pr-12 md:pr-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDZMMTIgMSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-[length:10px_6px] md:bg-[length:12px_8px] bg-[right_1.5rem_center] md:bg-[right_2rem_center] bg-no-repeat"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">COLLECTION: ALL</option>
          <option value="available">FILTER: ACTIVE</option>
          <option value="booked">FILTER: HIDDEN</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-8">
        {filteredCars && filteredCars.length > 0 && filteredCars.map(car => (
          <CarCard 
            key={car.id} 
            car={car} 
            onEdit={(c) => { setEditingCar(c || null); setIsModalOpen(true); }} 
            onDelete={deleteCar}
            onStatusToggle={updateCarStatus}
          />
        ))}
        
        {(!filteredCars || filteredCars.length === 0) && (
          <div className="col-span-full py-20 md:py-40 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[2rem] md:rounded-[4rem] border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 md:mb-8 text-gray-200">
                <CarIcon size={32} className="md:w-12 md:h-12" />
             </div>
             <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] opacity-40">Zero records matching query</p>
          </div>
        )}
      </div>

      <CarFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingCar || initialFormState}
      />
    </div>
  );
}
