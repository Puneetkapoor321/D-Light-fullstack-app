import { useState } from "react";
import { useCars } from "../context/CarsContext";
import { Fuel, Eye, Gauge } from "lucide-react";

export default function Cars() {
  const { cars, loading } = useCars();
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  // Filter for active cars for the public view
  const availableCars = cars.filter((c) => c.status === 'active');

  return (
    <div
      id="cars"
      className="py-12 md:py-24 px-4 sm:px-6 md:px-12 mx-auto w-full max-w-[1500px] flex flex-col items-center justify-center animate-on-scroll opacity-0 translate-y-[20px] transition-all duration-700"
    >
      <div className="text-center mb-10 md:mb-16 animate-fade-up">
        <span className="text-[var(--color-accent)] font-black uppercase tracking-[0.4em] text-sm mb-4">
          Our Fleet
        </span>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] tracking-tighter uppercase mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-500">
            Live
          </span>{" "}
          Collections
        </h2>
        <div className="flex flex-col items-center text-center">
          <p className="text-[var(--color-text-muted)] font-medium max-w-xl text-lg">
            Choose from our ultra-premium performance vehicles. Data persists
            across your session.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
          {availableCars.map((car, index) => (
            <div
              key={car.id}
              onClick={() => setSelectedCarId(car.id)}
              className={`
                glow-card glass rounded-[2rem] border border-[var(--color-border)] shadow-xl overflow-hidden group animate-fade-up
                delay-${(index % 3) * 100} flex flex-col h-full cursor-pointer
                ${selectedCarId === car.id ? 'active-glow' : ''}
              `}
            >
              <div className="relative h-52 md:h-60 w-full img-zoom-hover shrink-0">
                <img
                  src={
                    car.image_url ||
                    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800"
                  }
                  alt={car.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/95 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5 backdrop-blur-sm">
                  <span
                    className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}
                  ></span>
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#22c55e]">
                    Ready
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-10 flex flex-col flex-grow items-start text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full mb-4 shrink-0">
                  <div className="max-w-full">
                    <h3 className="font-heading font-extrabold text-xl md:text-2xl tracking-tighter hover:text-[var(--color-accent)] transition-colors line-clamp-1 uppercase">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest opacity-60">
                        {car.brand}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                      <span className="text-[8px] font-black text-[var(--color-accent)] uppercase tracking-tighter">
                        Top Model
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0 text-left sm:text-right shrink-0">
                    <span className="font-black text-2xl md:text-3xl text-gray-900">
                      ₹{car.price_per_day}
                    </span>
                    <span className="text-[9px] md:text-[10px] block md:inline font-bold text-gray-400 uppercase tracking-tighter sm:ml-2">
                       / Day
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:gap-3 w-full mt-2 mb-6">
                  <div className="flex items-center gap-2 md:gap-3 bg-gray-50/80 px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                    <Fuel size={12} className="text-[var(--color-accent)] shrink-0" />
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-500 truncate">
                      {car.fuel_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 bg-gray-50/80 px-3 py-2.5 md:px-4 md:py-3 rounded-xl md:rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-sm">
                    <Gauge size={12} className="text-[var(--color-accent)] shrink-0" />
                    <span className="text-[10px] md:text-[11px] font-bold text-gray-500 truncate">
                      {car.transmission}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById("booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    window.dispatchEvent(
                      new CustomEvent("selectCar", { detail: car.id }),
                    );
                  }}
                  className="w-full mt-auto bg-black text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] group transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] hover:text-black hover:shadow-xl hover:shadow-[var(--color-accent)]/20 shadow-lg active:scale-95"
                >
                  <Eye
                    size={14}
                    className="group-hover:scale-125 transition-transform"
                  />
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
