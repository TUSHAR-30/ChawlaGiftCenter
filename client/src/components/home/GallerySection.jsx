const galleryImages= [
    {
      image: "shop/inside3.webp",
      alt: "1",
    },
    {
      image: "shop/inside4.jpg",
      alt: "2",
    },
    {
      image: "shop/inside5.jpg",
      alt: "3",
    },
    {
      image: "shop/inside6.jpg",
      alt: "4",
    },
  ];

export default function GallerySection() {

  return (
    <section className="relative mx-auto mt-16 max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(254,251,235,0.92),rgba(255,255,255,0.98)_42%,rgba(239,246,255,0.9)_100%)] px-4 py-8 shadow-[0_28px_70px_-40px_rgba(31,41,55,0.3)] ring-1 ring-white/70 sm:px-6 sm:py-10 lg:px-8" id="gallery">
      <div className="soft-shapes left-[-2rem] top-8 h-28 w-28 rounded-full bg-primary-container/45" />
      <div className="soft-shapes right-[-1rem] bottom-10 h-32 w-32 rounded-full bg-secondary-container/35" />

      <div className="relative">
        <h3 className="mb-6 px-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl lg:text-4xl">
          Inside Our Studio
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {galleryImages.map((item) => (
            <div key={item.image} className="group h-40 overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/65 shadow-[0_18px_40px_-30px_rgba(31,41,55,0.35)] backdrop-blur-sm sm:h-56 lg:h-72">
              <img alt={item.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" src={item.image} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
