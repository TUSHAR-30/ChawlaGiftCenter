import ProductCard from "../components/products/ProductCard";
import { products } from "../data/productData";

const trendingProducts = products.filter((product) => product.trending);

export default function TrendingPage() {
  const heroProducts = trendingProducts.slice(0, 3);
  const moreProducts = trendingProducts.slice(3);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(186,230,253,0.24),rgba(255,255,255,1)_28%,rgba(255,252,232,0.9)_100%)] pt-20 pb-32 lg:pt-24 lg:pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              Trending Products
            </h1>
          </div>

          <div className="rounded-[2rem] bg-white/70 p-4 shadow-[0_24px_48px_-30px_rgba(31,41,55,0.3)] backdrop-blur sm:p-5">
            <div className="grid gap-4 lg:grid-cols-3">
              {heroProducts.map((product, index) => (
                <div key={product.title}>
                  <ProductCard featured={index === 0} product={product} />
                </div>
              ))}
            </div>
          </div>

          {moreProducts.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {moreProducts.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
