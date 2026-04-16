export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-container/40 to-white px-4 pt-8 pb-14 sm:px-6 sm:pt-10 lg:px-8 lg:pt-14 lg:pb-20">
      <div className="soft-shapes top-[-10%] left-[-10%] h-64 w-64 rounded-full bg-secondary-container" />
      <div className="soft-shapes right-[-5%] bottom-[10%] h-48 w-48 rounded-full bg-tertiary-container" />
      <div className="absolute top-12 right-6 animate-bounce opacity-40 duration-1000 sm:right-10 lg:right-[12%]">
        <span className="material-symbols-outlined text-4xl text-primary sm:text-5xl lg:text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          auto_awesome
        </span>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="w-full max-w-xl lg:order-2 lg:max-w-2xl">
          <div className="relative aspect-[4/3] w-full rotate-2 overflow-hidden rounded-3xl border-[6px] border-white transition-transform duration-500 vibrant-shadow hover:rotate-0 lg:aspect-[5/4]">
            <img
              alt="Toy store interior"
              className="h-full w-full scale-105 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuk0YX_qm_E1gqo0r84_odLfggW6QIeYta9gYmtNgz6NEIRhfyYxC1N6PtV0pJyJ0ldyY6aWUlwKPuZnA5MSHr28MKhvZVkOToE7IoFT1jXSosPrC8VbltoljkdQDZysCh6AMPsQn4_JN1is2FnJa-rMSR2Kk5-Qu-658olNkaFknW0FUra3oYYdEmIQfAgHrcMO6SdWr44WPAdLNA9OC7Fdyzp4esiooW6iaj_GOtYnwXEutVmI-Bl7gk19cvR5gWWdbC0KkNNlA"
            />
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md">
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

        <div className="max-w-xl lg:order-1 lg:flex-1">
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-on-surface sm:text-5xl lg:text-6xl xl:text-7xl">
            Make Every Moment <span className="text-primary italic">Magical &#10024;</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xs text-base font-medium text-on-surface-variant sm:max-w-lg sm:text-lg lg:mx-0 lg:mb-10 lg:text-xl">
            Discover the joy of gifting with Bhiwani&apos;s most vibrant collection of toys and surprises.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="vibrant-shadow flex items-center gap-3 rounded-2xl bg-primary px-7 py-4 text-base font-black text-on-primary transition-all hover:scale-105 active:scale-95 sm:px-10 sm:py-5 sm:text-lg">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
              View on Google Maps
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
