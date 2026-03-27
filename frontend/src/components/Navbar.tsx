import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const sections = ["home", "cars", "booking", "social", "contact"];
      let current = "home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "cars", label: "Cars" },
    { id: "booking", label: "Booking" },
    { id: "social", label: "Social Connect" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100 py-3" : "bg-transparent py-4 md:py-6 border-b border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex flex-col cursor-pointer text-left group"
        >
          <div className="font-heading font-extrabold text-2xl tracking-wide text-black transition-colors group-hover:text-[var(--color-accent)]">
            D
            <span className="text-[var(--color-accent)] group-hover:text-black">
              -
            </span>
            LIGHT
          </div>
          <div className="text-[9px] font-black tracking-[0.4em] text-[var(--color-text-muted)] mt-[-2px] uppercase">
            Car Rentals
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`relative text-xs font-black transition-all py-2 uppercase tracking-[0.15em] hover:text-[var(--color-accent)] ${activeSection === link.id ? "text-black" : "text-gray-500"}`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 w-full h-[3px] bg-[var(--color-accent)] rounded-full transition-all duration-500 ${activeSection === link.id ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
              />
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/admin/login"
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black hover:text-white text-black flex items-center justify-center transition-all duration-300 transform hover:rotate-12"
            title="Admin Login"
          >
            <User size={18} />
          </Link>
          <button
            onClick={() => scrollTo("booking")}
            className="bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-[var(--color-accent)] hover:text-black shadow-md transition-all hover:-translate-y-1 duration-300 text-xs tracking-[0.1em] uppercase"
          >
            Book Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-black bg-black/5 p-2.5 rounded-xl backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl shadow-2xl py-6 px-6 flex flex-col gap-3.5 md:hidden border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left font-black uppercase tracking-widest py-2 text-sm border-b border-gray-50 last:border-0"
            >
              {link.label}
            </button>
          ))}
          <div className="flex flex-col gap-3 mt-2 pt-2">
            <Link
              to="/admin/login"
              className="text-left font-bold py-1.5 text-gray-500 flex items-center gap-3 text-xs"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={16} />
              </div>
              Admin Dashboard
            </Link>
            <button
              onClick={() => scrollTo("booking")}
              className="bg-[var(--color-accent)] text-black px-6 py-4 rounded-xl font-black text-center w-full shadow-lg uppercase tracking-widest text-[11px] mt-1"
            >
              Book Your Ride
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
