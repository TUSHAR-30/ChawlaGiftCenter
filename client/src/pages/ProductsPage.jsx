import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilterBar from "../components/products/ProductFilterBar";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

const INITIAL_PRODUCTS = 8;
const PRODUCT_BATCH = 4;

export default function ProductsPage() {
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    skip: 0,
    hasMore: false,
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetchJson("/products/categories", {
          signal: controller.signal,
        });

        setCategories(response.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load product categories", error);
        }
      } finally {
        setIsLoadingCategories(false);
      }
    }

    loadCategories();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setIsRefreshing(true);
      setErrorMessage("");

      try {
        const response = await fetchJson("/products", {
          query: {
            category: selectedCategory,
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

        console.error("Failed to load products", error);
        setProducts([]);
        setPagination({ page: 1, skip: 0, hasMore: false });
        setErrorMessage("Products could not be loaded right now. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsRefreshing(false);
        }
      }
    }

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

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

    async function loadMoreProducts() {
      try {
        const response = await fetchJson("/products", {
          query: {
            category: selectedCategory,
            skip: products.length,
            limit: PRODUCT_BATCH,
          },
          signal: controller.signal,
        });

        setProducts((currentProducts) => [...currentProducts, ...response.data]);
        setPagination(response.pagination);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load more products", error);
          setErrorMessage("More products could not be loaded right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMore(false);
        }
      }
    }

    loadMoreProducts();

    return () => {
      controller.abort();
    };
  }, [isLoadingMore, products.length, selectedCategory]);

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
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isRefreshing
              ? Array.from({ length: INITIAL_PRODUCTS }).map((_, index) => <ProductCardSkeleton key={index} />)
              : products.map((product) => <ProductCard key={product._id || product.title} product={product} />)}
            {!isRefreshing && isLoadingMore
              ? Array.from({ length: PRODUCT_BATCH }).map((_, index) => <ProductCardSkeleton key={`loading-${index}`} />)
              : null}
          </div>

          {!isRefreshing && !errorMessage && products.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] bg-white p-8 text-center shadow-[0_16px_32px_-24px_rgba(31,41,55,0.28)]">
              <h2 className="font-headline text-2xl font-bold text-on-surface">No products found</h2>
              <p className="mt-2 text-sm font-medium text-on-surface-variant">
                Try choosing another category to explore more products.
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
