import { Instagram, Linkedin, Github } from 'lucide-react';

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/i.punitkapoor_/",
    handle: "@Puneet Kapoor",
    icon: <Instagram size={48} />,
    gradientBg: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    blurBg: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600",
    hoverRotate: "group-hover:rotate-6"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/puneet-kapoor-b501b5338/?skipRedirect=true",
    handle: "Puneet Kapoor",
    icon: <Linkedin size={48} fill="currentColor" />,
    gradientBg: "bg-[#0077B5]",
    blurBg: "bg-blue-600",
    hoverRotate: "group-hover:-rotate-6"
  },
  {
    name: "GitHub",
    url: "https://github.com/Puneetkapoor321",
    handle: "Puneetkapoor321",
    icon: <Github size={48} fill="currentColor" />,
    gradientBg: "bg-[#24292e]",
    blurBg: "bg-gray-800",
    hoverRotate: "group-hover:rotate-6"
  }
];

export default function Social() {
  return (
    <section
      id="social"
      className="py-12 md:py-24 px-4 sm:px-6 md:px-12 mx-auto w-full max-w-7xl flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="text-center mb-8 md:mb-16 animate-fade-up">
        <span className="text-[var(--color-accent)] font-black uppercase tracking-[0.4em] text-sm mb-4 block">
          Community
        </span>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] tracking-tighter uppercase leading-[1.05] mb-4">
          STAY{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400">
            CONNECTED
          </span>
        </h2>
        <p className="mt-2 text-[var(--color-text-muted)] font-medium text-base md:text-xl max-w-2xl mx-auto">
          Follow for exclusive design insights and luxury car fleet updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl justify-center items-center">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass group flex flex-col items-center justify-center p-6 md:p-12 rounded-[2.5rem] border border-[var(--color-border)] shadow-xl hover-lift transition-all duration-500 w-full relative overflow-hidden h-full"
          >
            {/* Ambient Background Blur */}
            <div className={`absolute top-0 right-0 w-40 h-40 ${link.blurBg} opacity-5 group-hover:opacity-20 transition-opacity duration-500 rounded-full blur-3xl`}></div>

            {/* Icon Container */}
            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] ${link.gradientBg} flex items-center justify-center mb-4 md:mb-6 text-white group-hover:scale-110 transition-transform duration-500 shadow-xl ${link.hoverRotate}`}>
              <div className="scale-50 md:scale-90">{link.icon}</div>
            </div>

            <span className="font-heading font-extrabold text-lg md:text-2xl text-[var(--color-text-primary)] tracking-wide whitespace-nowrap">
              {link.name}
            </span>
            <span className="text-[var(--color-text-muted)] mt-1 md:mt-2 font-bold text-[10px] md:text-sm tracking-widest uppercase opacity-60">
              {link.handle}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
