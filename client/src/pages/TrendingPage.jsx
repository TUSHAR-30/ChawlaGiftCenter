import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

const INITIAL_PRODUCTS = 7;
const PRODUCT_BATCH = 4;

export default function TrendingPage() {
  const loadMoreRef = useRef(null);

  const trendingQuery = useInfiniteQuery({
    queryKey: ["trending-products"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const limit = pageParam === 0 ? INITIAL_PRODUCTS : PRODUCT_BATCH;
      return fetchJson("/products/trending", {
        query: {
          skip: pageParam,
          limit,
        },
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination?.hasMore) {
        return undefined;
      }

      return allPages.reduce((total, page) => total + page.data.length, 0);
    },
  });

  const products = useMemo(
    () => trendingQuery.data?.pages.flatMap((page) => page.data) || [],
    [trendingQuery.data],
  );

  useEffect(() => {
    if (!loadMoreRef.current || !trendingQuery.hasNextPage || trendingQuery.isFetchingNextPage || trendingQuery.isLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trendingQuery.fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [trendingQuery]);

  const heroProducts = products.slice(0, 3);
  const moreProducts = products.slice(3);
  const errorMessage = trendingQuery.isError ? "Trending products could not be loaded right now. Please try again." : "";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(186,230,253,0.24),rgba(255,255,255,1)_28%,rgba(255,252,232,0.9)_100%)] pt-20 pb-32 lg:pt-24 lg:pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              Trending Products
            </h1>
          </div>

          {trendingQuery.isLoading ? (
            <div className="rounded-[2rem] bg-white/70 p-4 shadow-[0_24px_48px_-30px_rgba(31,41,55,0.3)] backdrop-blur sm:p-5">
              <div className="grid gap-4 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : heroProducts.length > 0 ? (
            <div className="rounded-[2rem] bg-white/70 p-4 shadow-[0_24px_48px_-30px_rgba(31,41,55,0.3)] backdrop-blur sm:p-5">
              <div className="grid gap-4 lg:grid-cols-3">
                {heroProducts.map((product, index) => (
                  <div key={product._id || product.title}>
                    <ProductCard featured={index === 0} product={product} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {!trendingQuery.isLoading && moreProducts.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {moreProducts.map((product) => (
                <ProductCard key={product._id || product.title} product={product} />
              ))}
              {trendingQuery.isFetchingNextPage
                ? Array.from({ length: PRODUCT_BATCH }).map((_, index) => <ProductCardSkeleton key={`loading-${index}`} />)
                : null}
            </div>
          ) : null}

          {!trendingQuery.isLoading && !errorMessage && products.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No trending products found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Add products marked as trending in the database to feature them here.
              </p>
            </div>
          ) : null}

          {!trendingQuery.isLoading && errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-6 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <p className="text-sm font-semibold text-on-surface-variant">{errorMessage}</p>
            </div>
          ) : null}

          {!trendingQuery.isLoading && trendingQuery.hasNextPage ? (
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
