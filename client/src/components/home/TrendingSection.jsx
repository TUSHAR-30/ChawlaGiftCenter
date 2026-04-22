import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";
import ProductCard from "../products/ProductCard";

export default function TrendingSection({ products = [] }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(254,252,232,0.2),rgba(255,255,255,0.96)_18%,rgba(255,247,237,0.85)_100%)] py-14" id="trending">
      <div className="soft-shapes left-[8%] top-12 h-28 w-28 rounded-full bg-primary-container/45" />
      <div className="soft-shapes right-[10%] bottom-8 h-36 w-36 rounded-full bg-secondary-container/35" />

      <div className="relative mx-auto mb-8 flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="mb-1 text-2xl font-black tracking-tight text-on-surface sm:text-3xl lg:text-4xl">
            Trending Gifts
          </h2>
          <p className="text-sm font-medium text-on-surface-variant">Most loved picks this week</p>
        </div>
        <Link className="flex items-center gap-1 text-sm font-bold text-primary" to="/trending">
          View All <MdArrowForward className="text-sm" />
        </Link>
      </div>

      <div className="no-scrollbar relative mx-auto flex max-w-7xl gap-3.5 overflow-x-auto px-4 pb-4 sm:gap-4 sm:px-6 lg:px-8">
        {products.map((product) => (
          <div key={product.title} className="w-[72vw] max-w-[17.5rem] flex-none sm:w-64 lg:w-68 xl:w-72">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
