export default function Home() {
  return (
    <div id="home" className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-start pt-6 md:pt-16 overflow-hidden px-4 sm:px-6 md:px-12 pb-12 md:pb-24 max-w-7xl mx-auto w-full">
        <div className="z-10 text-center flex flex-col items-center mt-4 md:mt-8 mb-8 md:mb-16 w-full max-w-4xl mx-auto">
          <p className="text-sm font-black tracking-[0.4em] text-[var(--color-accent)] mb-4 animate-fade-up uppercase">
            Rent Your Dreams
          </p>
          <h1 className="font-heading font-extrabold text-3xl md:text-6xl lg:text-7xl text-[var(--color-text-primary)] leading-[1.05] tracking-tighter mb-4 animate-fade-up delay-100">
            D&middot;LIGHT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-400">
              LUXURY
            </span>
            <br />
            COLLECTION
          </h1>
          <p className="text-base md:text-xl font-medium text-[var(--color-text-muted)] mt-2 animate-fade-up delay-200">
            Drive the future. Rent the experience.
          </p>
        </div>

        {/* Hero Car Floating with Parallax feel */}
        <div className="relative w-full max-w-5xl mx-auto flex justify-center items-end px-4 z-20 animate-fade-up delay-300">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-[var(--color-accent)] z-[-1] rounded-full opacity-10 filter blur-[120px]"></div>
          <img
            src="https://img.gaadicdn.com/images/carexteriorimages/930x620/Mahindra/Thar-ROXX/11928/1754637539478/exterior-image-164.jpg"
            alt="Premium Collection Car"
            className="w-full max-w-screen-lg object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-float"
            loading="eager"
            style={{ height: "auto", maxHeight: "45vh" }}
          />
        </div>

        {/* Floating Booking Action - ALIGNMENT FIXED */}
        <div className="relative z-30 flex justify-center mt-[-4vh] md:mt-[-8vh] px-6 w-full max-w-[900px]">
          <div className="glass rounded-[2rem] shadow-card flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-10 md:px-12 gap-6 hover-lift border border-white/40 backdrop-blur-md">
            <div className="flex flex-col text-left flex-1">
              <h3 className="font-heading font-black text-2xl md:text-3xl tracking-tighter mb-1">
                Ready to Drive?
              </h3>
              <p className="text-[var(--color-text-muted)] text-sm md:text-base font-semibold">
                Your keys are waiting. Exclusive rates today.
              </p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-black text-white px-12 py-5 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center hover:bg-[var(--color-accent)] hover:text-black transition-all group min-w-[220px] w-full md:w-auto shadow-xl hover:shadow-[var(--color-accent)]/30 active:scale-95 duration-300 whitespace-nowrap"
            >
              Book Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
