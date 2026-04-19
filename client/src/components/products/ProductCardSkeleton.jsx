export default function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-primary/8">
      <div className="shimmer-surface aspect-[4/2.9]" />
      <div className="space-y-2 p-3.5 sm:p-4">
        <div className="shimmer-surface h-3 w-24 rounded-full" />
        <div className="shimmer-surface h-5 w-4/5 rounded-full" />
        <div className="shimmer-surface h-4 w-full rounded-full" />
        <div className="shimmer-surface h-4 w-2/3 rounded-full" />
      </div>
    </article>
  );
}
