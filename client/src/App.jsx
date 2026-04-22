import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/layout/SiteLayout";

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const TrendingPage = lazy(() => import("./pages/TrendingPage"));
const UnboxingPage = lazy(() => import("./pages/UnboxingPage"));

function PageFallback() {
  return (
    <main className="min-h-screen bg-background px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-3">
          <div className="shimmer-surface h-10 w-56 rounded-full" />
          <div className="shimmer-surface h-4 w-80 rounded-full" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-primary/8">
              <div className="shimmer-surface aspect-[4/3]" />
              <div className="space-y-2 p-4">
                <div className="shimmer-surface h-4 w-24 rounded-full" />
                <div className="shimmer-surface h-5 w-4/5 rounded-full" />
                <div className="shimmer-surface h-4 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={withSuspense(<AdminDashboardPage />)} />
      <Route element={<SiteLayout />}>
        <Route path="/" element={withSuspense(<HomePage />)} />
        <Route path="/trending" element={withSuspense(<TrendingPage />)} />
        <Route path="/products" element={withSuspense(<ProductsPage />)} />
        <Route path="/unboxing" element={withSuspense(<UnboxingPage />)} />
        <Route path="/categories" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
