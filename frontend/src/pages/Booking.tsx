import { useState, useMemo, useEffect } from "react";
import {
  Car as CarIcon,
  MapPin,
  Calendar,
  User,
  Phone,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useCars } from "../context/CarsContext";
import { useBookings } from "../context/BookingsContext";
import { getImageUrl } from "../config";

export default function Booking() {
  const { cars, loading: carsLoading } = useCars();
  const { addBooking } = useBookings();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // State for selected car object
  const [selectedCar, setSelectedCar] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickupLocation: "",
    pickupDate: "",
    returnDate: "",
    carId: "",
  });

  // Filter only active cars for booking
  const availableCars = useMemo(
    () => cars.filter((c) => c.status === 'active'),
    [cars],
  );

  // Listen for car selection from external components (like Home/Cars)
  useEffect(() => {
    const handleSelectCar = (e: any) => {
      const carId = e.detail;
      const car = availableCars.find((c) => c.id === carId);
      if (car) {
        setFormData((prev) => ({ ...prev, carId: carId.toString() }));
        setSelectedCar(car);
      }
    };

    window.addEventListener("selectCar", handleSelectCar);
    return () => window.removeEventListener("selectCar", handleSelectCar);
  }, [availableCars]);

  const priceDetails = useMemo(() => {
    if (!selectedCar || !formData.pickupDate || !formData.returnDate)
      return null;

    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const total = diffDays * selectedCar.price_per_day;

    return { days: diffDays, total };
  }, [selectedCar, formData.pickupDate, formData.returnDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        customer_name: formData.name,
        phone: formData.phone,
        car_id: parseInt(formData.carId),
        car_name: selectedCar?.name || "",
        price_per_day: selectedCar?.price_per_day || 0,
        pickup_date: formData.pickupDate,
        return_date: formData.returnDate,
        total_days: priceDetails?.days || 0,
        total_price: priceDetails?.total || 0,
        location: formData.pickupLocation,
        status: "pending",
      };

      const success = await addBooking(payload);

      if (success) {
        setShowSuccess(true);
        setSelectedCar(null);
        setFormData({
          name: "",
          phone: "",
          pickupLocation: "",
          pickupDate: "",
          returnDate: "",
          carId: "",
        });
      } else {
        setError("Reservation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Falling back to WhatsApp booking...");

      // WhatsApp Fallback
      const message = `Booking Request:\n- Name: ${formData.name}\n- Car ID: ${formData.carId}\n- Dates: ${formData.pickupDate} to ${formData.returnDate}`;
      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/919999999999?text=${encodedMsg}`, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="booking"
      className="py-12 md:py-24 px-4 sm:px-6 md:px-12 mx-auto w-full max-w-7xl flex flex-col items-center justify-center animate-on-scroll opacity-0 translate-y-[20px] transition-all duration-700"
    >
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
              <CheckCircle size={48} className="animate-bounce" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4 text-gray-900">
              Ride Confirmed!
            </h3>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Your reservation for the{" "}
              <span className="text-black font-bold">{selectedCar?.name}</span>{" "}
              has been successfully logged. Our concierge will contact you
              shortly.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all hover:shadow-xl hover:shadow-green-900/20 active:scale-95"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-16 animate-fade-up">
        <span className="text-[var(--color-accent)] font-black uppercase tracking-[0.4em] text-sm mb-4 block">
          Reservation
        </span>
        <h2 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] tracking-tighter uppercase leading-[1.1]">
          SECURE YOUR
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400">
            EXPERIENCE
          </span>
        </h2>
        <p className="mt-6 text-[var(--color-text-muted)] font-medium text-lg">
          Instant booking with dynamic price calculation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 w-full">
        {/* Left: Form */}
        <div className="lg:col-span-3 glass rounded-[2.5rem] shadow-2xl border border-[var(--color-border)] p-6 md:p-12 animate-fade-up delay-100">
          {error && (
            <div className="mb-8 flex items-center gap-3 bg-red-50 text-red-600 p-5 rounded-2xl border border-red-100 text-sm font-bold animate-fade-up">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Select Vehicle
                </label>
                <div className="relative group">
                  <CarIcon
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <select
                    required
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 appearance-none cursor-pointer"
                    value={formData.carId}
                    onChange={(e) => {
                      const carId = e.target.value;
                      setFormData({ ...formData, carId });
                      const car = availableCars.find(
                        (c) => c.id === parseInt(carId),
                      );
                      setSelectedCar(car || null);
                    }}
                    disabled={carsLoading}
                  >
                    <option value="" disabled>
                      {carsLoading ? "Loading cars..." : "Choose your car..."}
                    </option>
                    {availableCars.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - ₹{c.price_per_day}/day
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Your Phone Number"
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Pickup Location
                </label>
                <div className="relative group">
                  <MapPin
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Your Location"
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100"
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupLocation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Pickup Date
                </label>
                <div className="relative group">
                  <Calendar
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    required
                    type="date"
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100"
                    value={formData.pickupDate}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Return Date
                </label>
                <div className="relative group">
                  <Calendar
                    size={18}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-accent)] transition-colors"
                  />
                  <input
                    required
                    type="date"
                    className="input-focus-glow bg-gray-50/50 font-bold text-sm outline-none w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100"
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData({ ...formData, returnDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[var(--color-accent)] hover:text-black hover:shadow-2xl hover:shadow-[var(--color-accent)]/30 transition-all duration-500 shadow-xl group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  SAVING REQUEST...
                </>
              ) : (
                <>
                  CONFIRM RESERVATION
                  <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:bg-black group-hover:scale-150 transition-all"></div>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-2 flex flex-col gap-8 animate-fade-up delay-200">
          {/* Detailed Pricing */}
          <div className="glass rounded-[2.5rem] p-8 md:p-10 border border-[var(--color-border)] shadow-xl bg-gradient-to-br from-white to-gray-50/50 flex flex-col">
            {/* Car Image Preview Section */}
            <div className="mb-8">
              {selectedCar ? (
                <div className="w-full h-56 rounded-3xl overflow-hidden shadow-2xl transition duration-500 hover:scale-[1.05] relative group border-4 border-white/50">
                  <img
                    src={getImageUrl(selectedCar.image_url)}
                    alt={selectedCar.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-56 bg-gray-100 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300 mb-2">
                    <CarIcon size={32} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Select a vehicle
                  </span>
                </div>
              )}
            </div>

            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-4">
              Rental Breakdown
            </h3>

            <div className="space-y-6">
              {selectedCar ? (
                <>
                  <div className="flex justify-between items-center group">
                    <span className="text-sm font-bold text-gray-500">
                      Vehicle Base Rate
                    </span>
                    <span className="text-lg font-black text-gray-900 group-hover:text-[var(--color-accent)] transition-colors">
                      ₹{selectedCar.price_per_day}{" "}
                      <span className="text-[10px] text-gray-400">/day</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-500">
                        Duration
                      </span>
                      <span className="text-[10px] font-black uppercase text-gray-300">
                        Days calculated
                      </span>
                    </div>
                    <span className="text-lg font-black text-gray-900">
                      {priceDetails?.days || 1} Days
                    </span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-end mt-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1">
                        TOTAL ESTIMATION
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">
                        Inclusive of all taxes
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-gray-900">
                        ₹{priceDetails?.total || selectedCar.price_per_day}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300 border border-gray-100">
                    <Info size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                    Select a vehicle to unlock
                    <br />
                    instant pricing calculation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
