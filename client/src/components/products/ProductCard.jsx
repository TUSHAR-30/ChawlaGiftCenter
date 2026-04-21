export default function ProductCard({ product, featured = false }) {
  return (
    <article
      className={[
        "group overflow-hidden rounded-[1.25rem] bg-white shadow-[0_16px_36px_-24px_rgba(31,41,55,0.35)] ring-1 ring-primary/8 transition-transform duration-300 hover:-translate-y-1",
        featured ? "border border-primary/15" : "",
      ].join(" ")}
    >
      <div
        className={
          featured
            ? "aspect-[4/2.75] overflow-hidden bg-surface-container"
            : "aspect-[4/2.7] overflow-hidden bg-surface-container"
        }
      >
        <img
          alt={product.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={product.image}
        />
      </div>
      <div className="space-y-1.5 p-3 sm:p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-primary/80">{product.category}</p>
        <h3 className="font-headline text-[0.95rem] font-bold tracking-tight text-on-surface sm:text-base">{product.title}</h3>
        <p className="line-clamp-2 text-[0.82rem] leading-5 text-on-surface-variant sm:text-sm">{product.description}</p>
      </div>
    </article>
  );
}
