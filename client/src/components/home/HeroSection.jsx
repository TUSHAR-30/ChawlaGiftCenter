export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-container/40 to-white px-4 pt-8 pb-14 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14 lg:pb-20">
      <div className="soft-shapes motion-float-slow top-[-10%] left-[-10%] h-64 w-64 rounded-full bg-secondary-container" />
      <div className="soft-shapes motion-float-medium right-[-5%] bottom-[10%] h-48 w-48 rounded-full bg-tertiary-container" />
      <div className="absolute top-12 right-6 opacity-40 sm:right-10 lg:right-[12%]">
        <span className="material-symbols-outlined text-4xl text-primary sm:text-5xl lg:text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </div>
      <div className="motion-spin-slow absolute left-[8%] top-28 hidden h-20 w-20 rounded-full border border-primary/20 bg-white/40 lg:block" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="motion-rise motion-rise-delay-2 w-full max-w-xl lg:order-2 lg:max-w-2xl">
          <div className="relative aspect-[4/3] w-full rotate-2 overflow-hidden rounded-3xl border-[6px] border-white transition-transform duration-500 vibrant-shadow hover:rotate-0 lg:aspect-[5/4]">
            <img
              alt="Toy store interior"
              className="h-full w-full scale-105 object-cover transition-transform duration-700 hover:scale-110"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuk0YX_qm_E1gqo0r84_odLfggW6QIeYta9gYmtNgz6NEIRhfyYxC1N6PtV0pJyJ0ldyY6aWUlwKPuZnA5MSHr28MKhvZVkOToE7IoFT1jXSosPrC8VbltoljkdQDZysCh6AMPsQn4_JN1is2FnJa-rMSR2Kk5-Qu-658olNkaFknW0FUra3oYYdEmIQfAgHrcMO6SdWr44WPAdLNA9OC7Fdyzp4esiooW6iaj_GOtYnwXEutVmI-Bl7gk19cvR5gWWdbC0KkNNlA"
            />
            <div className="motion-float-medium absolute top-4 left-4 z-20 hidden items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md sm:flex">
              <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">Gift Joy</span>
            </div>
            <div className="motion-float-delay motion-float-slow absolute bottom-4 right-4 z-20 hidden items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md sm:flex">
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_mall
              </span>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">Fresh Finds</span>
            </div>
            <div className="motion-pulse-soft absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
              <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-on-surface">4.9</span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="motion-rise max-w-xl lg:order-1 lg:flex-1">
          <div className="motion-rise motion-rise-delay-1 mb-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-primary shadow-[0_12px_24px_-18px_rgba(31,41,55,0.25)]">
            <span className="material-symbols-outlined text-sm motion-float-medium" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Joy of Discovery
          </div>
          <h1 className="motion-rise motion-rise-delay-1 mb-4 text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-5xl lg:text-6xl xl:text-7xl">
            Make Every Moment <span className="text-primary italic">Magical &#10024;</span>
          </h1>
          <p className="motion-rise motion-rise-delay-2 mx-auto mb-8 max-w-xs text-base font-medium text-on-surface-variant sm:max-w-lg sm:text-lg lg:mx-0 lg:mb-10 lg:text-xl">
            Discover the joy of gifting with Bhiwani&apos;s most vibrant collection of toys and surprises.
          </p>
          <div className="motion-rise motion-rise-delay-3 flex justify-center lg:justify-start">
            <button className="vibrant-shadow flex items-center gap-3 rounded-2xl bg-primary px-7 py-4 text-base font-black text-on-primary transition-all hover:scale-105 hover:shadow-[0_24px_48px_-24px_rgba(234,179,8,0.55)] active:scale-95 sm:px-10 sm:py-5 sm:text-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              View on Google Maps
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
