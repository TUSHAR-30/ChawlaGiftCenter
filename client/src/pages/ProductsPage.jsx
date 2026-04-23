import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilterBar from "../components/products/ProductFilterBar";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

const INITIAL_PRODUCTS = 8;
const PRODUCT_BATCH = 4;

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const loadMoreRef = useRef(null);

  const categoriesQuery = useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await fetchJson("/products/categories");
      return response.data;
    },
  });

  const productsQuery = useInfiniteQuery({
    queryKey: ["products", selectedCategory],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const limit = pageParam === 0 ? INITIAL_PRODUCTS : PRODUCT_BATCH;
      const response = await fetchJson("/products", {
        query: {
          category: selectedCategory,
          skip: pageParam,
          limit,
        },
      });

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.pagination?.hasMore) {
        return undefined;
      }

      return allPages.reduce((total, page) => total + page.data.length, 0);
    },
  });

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((page) => page.data) || [],
    [productsQuery.data],
  );

  useEffect(() => {
    if (!loadMoreRef.current || !productsQuery.hasNextPage || productsQuery.isFetchingNextPage || productsQuery.isLoading) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          productsQuery.fetchNextPage();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [productsQuery]);

  const errorMessage = productsQuery.isError ? "Products could not be loaded right now. Please try again." : "";
  const categories = categoriesQuery.data || ["All"];

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
            <ProductFilterBar categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsQuery.isLoading
              ? Array.from({ length: INITIAL_PRODUCTS }).map((_, index) => <ProductCardSkeleton key={index} />)
              : products.map((product) => <ProductCard key={product._id || product.title} product={product} />)}
            {!productsQuery.isLoading && productsQuery.isFetchingNextPage
              ? Array.from({ length: PRODUCT_BATCH }).map((_, index) => <ProductCardSkeleton key={`loading-${index}`} />)
              : null}
          </div>

          {!productsQuery.isLoading && !errorMessage && products.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No products found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Try choosing another category to explore more products.
              </p>
            </div>
          ) : null}

          {!productsQuery.isLoading && errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-6 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <p className="text-sm font-semibold text-on-surface-variant">{errorMessage}</p>
            </div>
          ) : null}

          {!productsQuery.isLoading && productsQuery.hasNextPage ? (
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
