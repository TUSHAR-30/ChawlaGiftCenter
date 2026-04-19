import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: "home", label: "HOME", activeIcon: true },
  { to: "/trending", icon: "trending_up", label: "Trending" },
  { to: "/products", icon: "inventory_2", label: "Products" },
  { to: "/unboxing", icon: "smart_display", label: "Unboxing" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[2.5rem] border-t border-primary/10 bg-white/95 px-2 pt-3 pb-7 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-4 lg:left-1/2 lg:bottom-6 lg:w-auto lg:min-w-[34rem] lg:-translate-x-1/2 lg:rounded-full lg:border lg:px-4 lg:py-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            [
              "flex min-w-0 flex-col items-center justify-center px-3 py-2 transition-all sm:px-5",
              isActive ? "rounded-2xl bg-primary-container text-primary" : "text-on-surface-variant hover:scale-105",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="material-symbols-outlined text-2xl"
                style={isActive && link.activeIcon ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              <span className="mt-1 font-headline text-[10px] font-black uppercase">{link.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
