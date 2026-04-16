import { Link } from "react-router-dom";
import { trendingPreviewProducts } from "../../data/productData";
import ProductCard from "../products/ProductCard";

export default function TrendingSection() {
  return (
    <section className="bg-surface-container-lowest py-14" id="trending">
      <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="mb-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
            Trending Gifts
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">Most loved picks this week</p>
        </div>
        <Link className="flex items-center gap-1 text-sm font-bold text-primary" to="/trending">
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      <div className="no-scrollbar mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-6 lg:px-8">
        {trendingPreviewProducts.map((product) => (
          <div key={product.title} className="w-[78vw] max-w-xs flex-none sm:w-72 lg:w-80">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
