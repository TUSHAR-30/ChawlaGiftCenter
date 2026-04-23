import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import GallerySection from "../components/home/GallerySection";
import HeroSection from "../components/home/HeroSection";
import LocationSection from "../components/home/LocationSection";
import TrendingSection from "../components/home/TrendingSection";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

const ProductShowcaseSection = lazy(() => import("../components/home/ProductShowcaseSection"));

function HomeSectionSkeleton() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 space-y-3">
          <div className="shimmer-surface h-8 w-60 rounded-full" />
          <div className="shimmer-surface h-4 w-80 rounded-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,251,235,0.68),rgba(255,255,255,0.98)_24%,rgba(239,246,255,0.72)_100%)] py-16 sm:py-18">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mx-auto mb-4 shimmer-surface h-10 w-48 rounded-full" />
          <div className="mx-auto shimmer-surface h-10 w-80 rounded-full" />
        </div>
        <div className="space-y-14 sm:space-y-18 lg:space-y-22">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="mx-auto h-[330px] w-full max-w-6xl sm:h-[390px] md:h-[430px] lg:h-[520px]">
              <div className="relative mx-auto h-full w-[52%] max-w-[430px]">
                <div className="h-full rounded-[2.1rem] bg-white/80 p-3 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.18)] ring-1 ring-white/70 sm:p-4">
                  <div className="shimmer-surface h-[260px] rounded-[1.7rem] sm:h-[310px] md:h-[340px] lg:h-[430px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: async () => {
      const response = await fetchJson("/home");
      return response.data;
    },
  });

  const homeData = data || { categories: [], trendingPreview: [] };

  return (
    <main className="relative overflow-hidden bg-[linear-gradient(180deg,#fffdf6_0%,#fffaf0_18%,#f8fbff_56%,#fffef9_100%)] pt-16 pb-28 lg:pt-20 lg:pb-10">
      <div className="soft-shapes left-[-4rem] top-32 h-64 w-64 rounded-full bg-primary-container/55" />
      <div className="soft-shapes right-[-5rem] top-[30rem] h-72 w-72 rounded-full bg-secondary-container/45" />
      <div className="soft-shapes bottom-24 left-1/3 h-56 w-56 rounded-full bg-tertiary-container/35" />

      <HeroSection />
      {isLoading ? <HomeSectionSkeleton /> : <CategoriesSection categories={homeData.categories} />}
      <Suspense fallback={<ShowcaseSkeleton />}>
        <ProductShowcaseSection />
      </Suspense>
      {isLoading ? <HomeSectionSkeleton /> : <TrendingSection products={homeData.trendingPreview} />}
      {isLoading ? <HomeSectionSkeleton /> : <FeaturesSection />}
      {isLoading ? <HomeSectionSkeleton /> : <GallerySection />}
      <LocationSection />
    </main>
  );
}
