import CategoriesSection from "../components/home/CategoriesSection";
import FeaturesSection from "../components/home/FeaturesSection";
import GallerySection from "../components/home/GallerySection";
import HeroSection from "../components/home/HeroSection";
import LocationSection from "../components/home/LocationSection";
import TrendingSection from "../components/home/TrendingSection";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden pt-16 pb-28 lg:pt-20 lg:pb-10">
      <HeroSection />
      <CategoriesSection />
      <TrendingSection />
      <FeaturesSection />
      <GallerySection />
      <LocationSection />
    </main>
  );
}
