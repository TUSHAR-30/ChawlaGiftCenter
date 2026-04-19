const galleryLayoutClasses = [
  "h-40 overflow-hidden rounded-lg sm:h-52 lg:row-span-2 lg:h-full lg:min-h-[34rem]",
  "h-40 overflow-hidden rounded-lg sm:h-52 lg:h-full lg:min-h-[16.5rem]",
  "col-span-2 h-48 overflow-hidden rounded-lg sm:h-64 lg:col-span-1 lg:h-full lg:min-h-[16.5rem]",
];

export default function GallerySection({ galleryImages = [] }) {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8" id="gallery">
      <h3 className="mb-6 px-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl lg:text-4xl">
        Inside Our Studio
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:grid-rows-2">
        {galleryImages.map((item, index) => (
          <div key={item.image} className={galleryLayoutClasses[index]}>
            <img alt={item.alt} className="h-full w-full object-cover" src={item.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
