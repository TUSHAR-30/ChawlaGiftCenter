import { MdHomeFilled, MdInventory2, MdSmartDisplay, MdTrendingUp } from "react-icons/md";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", icon: MdHomeFilled, label: "HOME" },
  { to: "/trending", icon: MdTrendingUp, label: "Trending" },
  { to: "/products", icon: MdInventory2, label: "Products" },
  { to: "/unboxing", icon: MdSmartDisplay, label: "Unboxing" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[2.5rem] border-t border-primary/10 bg-white/95 px-2 pt-3 pb-7 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl sm:px-4 lg:left-1/2 lg:bottom-6 lg:w-auto lg:min-w-[34rem] lg:-translate-x-1/2 lg:rounded-full lg:border lg:px-4 lg:py-3">
      {links.map((link) => {
        const Icon = link.icon;

        return (
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
            {() => (
              <>
                <Icon className="text-2xl" />
                <span className="mt-1 font-headline text-[10px] font-black uppercase">{link.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
