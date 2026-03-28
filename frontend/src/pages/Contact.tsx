import { Phone, MessageCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Contact() {
  const { settings, loading } = useSettings();

  // Settings from context are updated automatically
  const phone = settings?.phone || "+91 98765 43210";
  const wa = settings?.whatsapp || "+91 98765 43210";
  const waLink = wa.replace(/[^0-9]/g, "");

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section
      id="contact"
      className="py-12 md:py-24 px-4 sm:px-6 md:px-12 mx-auto w-full max-w-7xl flex flex-col items-center justify-center animate-on-scroll opacity-0 translate-y-[20px] transition-all duration-700"
    >
      <div className="text-center mb-10 md:mb-16 animate-fade-up">
        <span className="text-[var(--color-accent)] font-black uppercase tracking-[0.4em] text-sm mb-4 block">Communication</span>
        <h2 className="font-heading font-extrabold text-3xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] tracking-tighter uppercase leading-[1.1]">
          GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400">TOUCH</span>
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)] font-medium text-lg">
          Our team is available 24/7 for your every need.
        </p>
      </div>

      {/* Compact Contact Card */}
      <div className="glass max-w-[650px] w-full rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl p-5 md:p-14 flex flex-col items-center border border-gray-100 group text-center hover-lift transition-all duration-500 bg-white/50 backdrop-blur-xl">
        <div className="w-10 h-10 md:w-20 md:h-20 rounded-full bg-gray-50 flex items-center justify-center mb-5 md:mb-10 group-hover:scale-110 transition-transform duration-500 border border-gray-100 group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)]">
          <Phone
            className="w-5 h-5 md:w-9 md:h-9 text-black transition-colors"
          />
        </div>

        <p className="text-gray-400 mb-1 md:mb-2 font-black text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase">
          Direct Line
        </p>

        <button
          onClick={() =>
            (window.location.href = `tel:${phone.replace(/[^0-9+]/g, "")}`)
          }
          className="font-heading font-extrabold text-lg md:text-5xl text-black hover:text-[var(--color-accent)] transition-colors tracking-tighter whitespace-normal break-words"
        >
          {phone}
        </button>

        <p className="text-gray-500 mt-4 md:mt-8 text-xs md:text-lg font-semibold max-w-[400px] leading-relaxed mx-auto">
          One tap connects you with our support team. No wait, just service.
        </p>

        <div className="w-full h-[1px] bg-gray-100 my-6 md:my-12"></div>

        <button
          onClick={() => window.open(`https://wa.me/${waLink}`, "_blank")}
          className="bg-black text-white font-black flex items-center gap-3 md:gap-4 px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-2xl hover:bg-[var(--color-accent)] hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-[var(--color-accent)]/30 uppercase tracking-widest text-xs md:text-sm"
        >
          <MessageCircle
            size={18}
            className="text-[#25D366] group-hover:text-black transition-colors"
          />
          Connect on Whatsapp
        </button>
      </div>
    </section>
  );
}
