import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import TrendingPage from "./pages/TrendingPage";
import UnboxingPage from "./pages/UnboxingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/unboxing" element={<UnboxingPage />} />
        <Route path="/categories" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
