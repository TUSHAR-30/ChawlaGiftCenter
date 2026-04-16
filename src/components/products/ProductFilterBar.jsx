export default function ProductFilterBar({ categories, selectedCategory, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = selectedCategory === category;
        return (
          <button
            key={category}
            className={[
              "shrink-0 rounded-full px-5 py-3 text-sm font-bold transition-colors",
              isActive
                ? "bg-primary text-on-primary shadow-[0_14px_28px_-18px_rgba(234,179,8,0.8)]"
                : "bg-white text-on-surface ring-1 ring-outline-variant hover:bg-primary-container/40",
            ].join(" ")}
            onClick={() => onSelect(category)}
            type="button"
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
