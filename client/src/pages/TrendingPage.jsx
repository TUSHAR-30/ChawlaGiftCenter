import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

const INITIAL_PRODUCTS = 7;
const PRODUCT_BATCH = 4;

export default function TrendingPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    skip: 0,
    hasMore: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTrendingProducts() {
      setIsRefreshing(true);
      setErrorMessage("");

      try {
        const response = await fetchJson("/products/trending", {
          query: {
            page: 1,
            limit: INITIAL_PRODUCTS,
          },
          signal: controller.signal,
        });

        setProducts(response.data);
        setPagination(response.pagination);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.error("Failed to load trending products", error);
        setProducts([]);
        setPagination({ page: 1, skip: 0, hasMore: false });
        setErrorMessage("Trending products could not be loaded right now. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsRefreshing(false);
        }
      }
    }

    loadTrendingProducts();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (isRefreshing || isLoadingMore || !pagination.hasMore || !loadMoreRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoadingMore(true);
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isLoadingMore, isRefreshing, pagination.hasMore]);

  useEffect(() => {
    if (!isLoadingMore) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadMoreTrendingProducts() {
      try {
        const response = await fetchJson("/products/trending", {
          query: {
            skip: products.length,
            limit: PRODUCT_BATCH,
          },
          signal: controller.signal,
        });

        setProducts((currentProducts) => [...currentProducts, ...response.data]);
        setPagination(response.pagination);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load more trending products", error);
          setErrorMessage("More trending products could not be loaded right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMore(false);
        }
      }
    }

    loadMoreTrendingProducts();

    return () => {
      controller.abort();
    };
  }, [isLoadingMore, products.length]);

  const heroProducts = products.slice(0, 3);
  const moreProducts = products.slice(3);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(186,230,253,0.24),rgba(255,255,255,1)_28%,rgba(255,252,232,0.9)_100%)] pt-20 pb-32 lg:pt-24 lg:pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface sm:text-4xl">
              Trending Products
            </h1>
          </div>

          {isRefreshing ? (
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

          {!isRefreshing && moreProducts.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {moreProducts.map((product) => (
                <ProductCard key={product._id || product.title} product={product} />
              ))}
              {isLoadingMore
                ? Array.from({ length: PRODUCT_BATCH }).map((_, index) => (
                    <ProductCardSkeleton key={`loading-${index}`} />
                  ))
                : null}
            </div>
          ) : null}

          {!isRefreshing && !errorMessage && products.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No trending products found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Add products marked as trending in the database to feature them here.
              </p>
            </div>
          ) : null}

          {!isRefreshing && errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-6 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <p className="text-sm font-semibold text-on-surface-variant">{errorMessage}</p>
            </div>
          ) : null}

          {!isRefreshing && pagination.hasMore ? (
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
