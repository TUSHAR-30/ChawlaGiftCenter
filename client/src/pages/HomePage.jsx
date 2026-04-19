import { useEffect, useState } from "react";
import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import GallerySection from "../components/home/GallerySection";
import HeroSection from "../components/home/HeroSection";
import LocationSection from "../components/home/LocationSection";
import TrendingSection from "../components/home/TrendingSection";
import ProductCardSkeleton from "../components/products/ProductCardSkeleton";
import { fetchJson } from "../utils/api";

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

export default function HomePage() {
  const [homeData, setHomeData] = useState({
    categories: [],
    features: [],
    gallery: [],
    trendingPreview: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      try {
        const response = await fetchJson("/home");

        if (!isMounted) {
          return;
        }

        setHomeData(response.data);
      } catch (error) {
        console.error("Failed to load homepage data", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="relative overflow-hidden pt-16 pb-28 lg:pt-20 lg:pb-10">
      <HeroSection />
      {isLoading ? <HomeSectionSkeleton /> : <CategoriesSection categories={homeData.categories} />}
      {isLoading ? <HomeSectionSkeleton /> : <TrendingSection products={homeData.trendingPreview} />}
      {isLoading ? <HomeSectionSkeleton /> : <FeaturesSection features={homeData.features} />}
      {isLoading ? <HomeSectionSkeleton /> : <GallerySection galleryImages={homeData.gallery} />}
      <LocationSection />
    </main>
  );
}
