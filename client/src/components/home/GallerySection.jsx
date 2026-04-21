export default function GallerySection({ galleryImages = [] }) {
  galleryImages = [
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

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8" id="gallery">
      <h3 className="mb-6 px-2 font-headline text-2xl font-bold text-on-surface sm:text-3xl lg:text-4xl">
        Inside Our Studio
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {galleryImages.map((item) => (
          <div key={item.image} className="h-40 overflow-hidden rounded-lg sm:h-56 lg:h-72">
            <img alt={item.alt} className="h-full w-full object-cover" src={item.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
