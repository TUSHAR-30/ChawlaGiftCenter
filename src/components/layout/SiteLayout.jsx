import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";

export default function SiteLayout() {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <ScrollToTop />
      <Header />
      <Outlet />
      <BottomNav />
    </div>
  );
}
