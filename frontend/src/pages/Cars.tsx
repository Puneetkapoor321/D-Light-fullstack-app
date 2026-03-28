import { useState, useMemo, useEffect } from "react";
import { useCars } from "../context/CarsContext";
import { Fuel, Eye, Gauge, Search, LayoutGrid } from "lucide-react";
import { getImageUrl } from "../config";

const CarSkeleton = () => (
  <div className="glass rounded-[2rem] border border-[var(--color-border)] shadow-xl overflow-hidden flex flex-col h-full animate-pulse">
    <div className="h-52 md:h-60 w-full bg-gray-200/50"></div>
    <div className="p-6 md:p-10 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200/50 rounded-lg"></div>
          <div className="h-3 w-16 bg-gray-200/50 rounded-lg"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200/50 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 bg-gray-200/50 rounded-xl"></div>
        <div className="h-10 bg-gray-200/50 rounded-xl"></div>
      </div>
      <div className="h-14 bg-gray-200/50 rounded-xl w-full mt-4"></div>
    </div>
  </div>
);

export default function Cars() {
  const { cars, loading } = useCars();
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Memoized filter results for performance
  const filteredCars = useMemo(() => {
    const activeOnes = cars.filter((c) => c.status === 'active');
    if (!searchTerm) return activeOnes;
    return activeOnes.filter(car => 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cars, searchTerm]);

  return (
    <div
      id="cars"
      className="py-12 md:py-24 px-4 sm:px-6 md:px-12 mx-auto w-full max-w-[1500px] flex flex-col items-center justify-center animate-on-scroll opacity-0 translate-y-[20px] transition-all duration-700"
    >
      <div className="text-center mb-10 md:mb-16 animate-fade-up">
        <span className="text-[var(--color-accent)] font-black uppercase tracking-[0.4em] text-sm mb-4 block">
          Elite Fleet
        </span>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] tracking-tighter uppercase mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
            Current
          </span>{" "}
          Inventory
        </h2>
        <div className="flex flex-col items-center text-center">
          <p className="text-[var(--color-text-muted)] font-medium max-w-xl text-lg">
            Discover precision-engineered performance. Our fleet is maintained to the highest standards of luxury and safety.
          </p>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl mx-auto">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by model or manufacturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-md border border-gray-200 px-14 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30 transition-all font-bold text-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch animate-fade-up">
          {[1, 2, 3, 4, 5, 6].map(i => <CarSkeleton key={i} />)}
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          {filteredCars.map((car, index) => (
            <div
              key={car.id}
              onClick={() => setSelectedCarId(car.id)}
              className={`
                glow-card glass rounded-[2rem] border border-[var(--color-border)] shadow-xl overflow-hidden group animate-fade-up
                delay-${(index % 3) * 100} flex flex-col h-full cursor-pointer transition-all duration-500
                ${selectedCarId === car.id ? 'active-glow scale-[1.02]' : 'hover:scale-[1.01] hover:shadow-2xl'}
              `}
            >
              <div className="relative h-56 md:h-64 lg:h-72 w-full overflow-hidden shrink-0">
                <img
                  src={getImageUrl(car.image_url)}
                  alt={car.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/95 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5 backdrop-blur-sm">
                  <span className={`w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse`}></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#22c55e]">Available</span>
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col flex-grow items-start text-left bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full mb-6 shrink-0">
                  <div className="max-w-full">
                    <h3 className="font-heading font-extrabold text-2xl md:text-3xl tracking-tighter hover:text-[var(--color-accent)] transition-colors line-clamp-1 uppercase">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest opacity-80">
                        {car.brand}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                      <span className="text-[9px] font-black text-amber-600 px-2 py-0.5 bg-amber-50 rounded-full uppercase tracking-tighter">
                        ULTRA-MODERN
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 text-left sm:text-right shrink-0">
                    <span className="font-black text-3xl md:text-4xl text-gray-900 leading-none">
                      ₹{car.price_per_day}
                    </span>
                    <span className="text-[10px] block md:inline font-bold text-gray-400 uppercase tracking-tighter sm:ml-2">
                       / Day
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mb-8">
                  <div className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-2xl border border-gray-100 transition-all hover:bg-gray-50 hover:shadow-inner group/icon">
                    <Fuel size={14} className="text-amber-500 shrink-0 transition-transform group-hover/icon:scale-110" />
                    <span className="text-xs font-bold text-gray-600 truncate uppercase">
                      {car.fuel_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-3.5 rounded-2xl border border-gray-100 transition-all hover:bg-gray-50 hover:shadow-inner group/icon">
                    <Gauge size={14} className="text-amber-500 shrink-0 transition-transform group-hover/icon:scale-110" />
                    <span className="text-xs font-bold text-gray-600 truncate uppercase">
                      {car.transmission}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = document.getElementById("booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    window.dispatchEvent(
                      new CustomEvent("selectCar", { detail: car.id }),
                    );
                  }}
                  className="w-full mt-auto bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.25em] group transition-all duration-300 flex items-center justify-center gap-3 hover:bg-amber-500 hover:text-black hover:shadow-2xl hover:shadow-amber-500/20 shadow-xl active:scale-95"
                >
                  <Eye size={16} className="group-hover:scale-125 transition-transform" />
                  Reserve Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
           <LayoutGrid size={48} className="mb-4 text-gray-300" />
           <p className="font-black uppercase tracking-widest text-sm text-gray-400">No vehicles found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
