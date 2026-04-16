import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilterBar from "../components/products/ProductFilterBar";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { productCategories, products } from "../data/productData";

const INITIAL_PRODUCTS = 8;
const PRODUCT_BATCH = 4;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, Math.min(visibleCount, filteredProducts.length)),
    [filteredProducts, visibleCount],
  );

  useEffect(() => {
    setIsRefreshing(true);
    setVisibleCount(INITIAL_PRODUCTS);

    const timeoutId = window.setTimeout(() => {
      setIsRefreshing(false);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [selectedCategory]);

  useEffect(() => {
    if (isRefreshing || isLoadingMore || visibleCount >= filteredProducts.length || !loadMoreRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsLoadingMore(true);
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [filteredProducts.length, isLoadingMore, isRefreshing, visibleCount]);

  useEffect(() => {
    if (!isLoadingMore) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCount((current) => Math.min(current + PRODUCT_BATCH, filteredProducts.length));
      setIsLoadingMore(false);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [filteredProducts.length, isLoadingMore]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(254,240,138,0.22),rgba(255,255,255,1)_24%,rgba(255,251,235,0.9)_100%)] pt-20 pb-32 lg:pt-24 lg:pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              Products
            </h1>
          </div>

          <div className="rounded-[2rem] bg-surface-container-low/80 p-4 sm:p-5">
            <ProductFilterBar
              categories={productCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isRefreshing
              ? Array.from({ length: INITIAL_PRODUCTS }).map((_, index) => <ProductCardSkeleton key={index} />)
              : visibleProducts.map((product) => <ProductCard key={product.title} product={product} />)}
            {!isRefreshing && isLoadingMore
              ? Array.from({ length: PRODUCT_BATCH }).map((_, index) => <ProductCardSkeleton key={`loading-${index}`} />)
              : null}
          </div>

          {!isRefreshing && filteredProducts.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No products found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Try choosing another category to explore more products.
              </p>
            </div>
          ) : null}

          {!isRefreshing && visibleCount < filteredProducts.length ? (
            <div ref={loadMoreRef} className="mt-6 flex justify-center">
              <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant shadow-[0_14px_28px_-22px_rgba(31,41,55,0.3)]">
                Scroll to load more
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
