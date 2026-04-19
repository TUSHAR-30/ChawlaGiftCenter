const categoryLayoutClasses = [
  "col-span-2 row-span-1 md:col-span-2 md:row-span-2 xl:col-span-2 xl:row-span-2",
  "col-span-2 row-span-1 md:col-span-1 md:row-span-2 xl:col-span-2 xl:row-span-1",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1",
  "col-span-1 row-span-1 md:col-span-1 md:row-span-1 xl:col-span-1",
  "col-span-1 row-span-1 md:col-span-3 md:row-span-1 xl:col-span-3 xl:row-span-1",
];

export default function CategoriesSection({ categories = [] }) {
  return (
    <section className="dot-pattern relative bg-white px-4 py-14 sm:px-6 lg:px-8" id="categories">
      <div className="mx-auto max-w-7xl">
        <div className="motion-rise mb-10 text-center">
          <h2 className="mb-2 text-3xl font-black tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
            Browse Categories
          </h2>
          <p className="font-medium text-on-surface-variant">Something special for everyone on your list</p>
        </div>

        <div className="bento-grid">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={`joy-shadow hover-lift group relative cursor-pointer overflow-hidden rounded-3xl border-4 border-white shadow-lg ${categoryLayoutClasses[index]}`}
            >
              <img
                alt={category.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={category.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="motion-float-medium absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/88 text-primary shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div className="absolute bottom-4 left-4 translate-y-1 text-white transition-transform duration-400 group-hover:translate-y-0 sm:bottom-6 sm:left-6">
                <span className="block font-headline text-lg font-bold leading-tight sm:text-2xl sm:font-extrabold">
                  {category.title}
                </span>
                {category.subtitle ? (
                  <span className="text-sm font-medium opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    {category.subtitle}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
