import { useEffect, useMemo, useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import CategoryForm from "../components/admin/CategoryForm";
import { EditModal, EmptyState, Field, Input, Status, TableWrap } from "../components/admin/AdminUi";
import ProductForm from "../components/admin/ProductForm";
import UnboxingForm from "../components/admin/UnboxingForm";
import { fetchJson, requestApi } from "../utils/api";

const tabs = [
  ["categories", "Categories"],
  ["products", "Product Details"],
  ["unboxing", "Unboxing Video Details"],
  ["add-product", "Add Product"],
  ["add-unboxing", "Add Unboxing Video"],
];

const emptyCategoryForm = {
  title: "",
  subtitle: "",
  alt: "",
  image: null,
};

const emptyProductForm = {
  title: "",
  description: "",
  alt: "",
  category: "",
  trending: false,
  image: null,
};

const emptyUnboxingForm = {
  title: "",
  description: "",
  productName: "",
  poster: null,
  video: null,
};

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
    : "-";
}

export default function AdminDashboardPage() {
  const [auth, setAuth] = useState({ checking: true, loggedIn: false, username: "" });
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginStatus, setLoginStatus] = useState({ type: "", message: "" });
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [activeTab, setActiveTab] = useState("categories");
  const [data, setData] = useState({ categories: [], products: [], unboxingVideos: [] });
  const [addCategoryForm, setAddCategoryForm] = useState(emptyCategoryForm);
  const [addProductForm, setAddProductForm] = useState(emptyProductForm);
  const [addUnboxingForm, setAddUnboxingForm] = useState(emptyUnboxingForm);
  const [categoryStatus, setCategoryStatus] = useState({ type: "", message: "" });
  const [productStatus, setProductStatus] = useState({ type: "", message: "" });
  const [videoStatus, setVideoStatus] = useState({ type: "", message: "" });
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryForm, setEditingCategoryForm] = useState(emptyCategoryForm);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductForm, setEditingProductForm] = useState(emptyProductForm);
  const [editingUnboxing, setEditingUnboxing] = useState(null);
  const [editingUnboxingForm, setEditingUnboxingForm] = useState(emptyUnboxingForm);
  const [editCategoryStatus, setEditCategoryStatus] = useState({ type: "", message: "" });
  const [editProductStatus, setEditProductStatus] = useState({ type: "", message: "" });
  const [editVideoStatus, setEditVideoStatus] = useState({ type: "", message: "" });
  const [savingEditCategory, setSavingEditCategory] = useState(false);
  const [savingEditProduct, setSavingEditProduct] = useState(false);
  const [savingEditVideo, setSavingEditVideo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRearrangingCategories, setIsRearrangingCategories] = useState(false);
  const [categoryDraftOrder, setCategoryDraftOrder] = useState([]);
  const [draggedCategoryId, setDraggedCategoryId] = useState("");
  const [dragOverCategoryId, setDragOverCategoryId] = useState("");
  const [savingCategoryOrder, setSavingCategoryOrder] = useState(false);

  const categories = useMemo(() => data.categories || [], [data.categories]);
  const categoryTitles = useMemo(() => categories.map((category) => category.title), [categories]);

  async function loadDashboard() {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetchJson("/admin/dashboard");
      setData(response.data);
    } catch (error) {
      if (error.message.toLowerCase().includes("log in")) {
        setAuth({ checking: false, loggedIn: false, username: "" });
      }
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        const response = await fetchJson("/admin/session");
        if (mounted) {
          setAuth({ checking: false, loggedIn: true, username: response.data.username });
        }
      } catch {
        if (mounted) {
          setAuth({ checking: false, loggedIn: false, username: "" });
        }
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (auth.loggedIn) {
      loadDashboard();
    }
  }, [auth.loggedIn]);

  useEffect(() => {
    setCategoryDraftOrder(categories);
  }, [categories]);

  function updateAddCategory(key, value) {
    setAddCategoryForm((current) => ({ ...current, [key]: value }));
    setCategoryStatus((current) => (current.message ? { type: "", message: "" } : current));
  }

  function updateAddProduct(key, value) {
    setAddProductForm((current) => ({ ...current, [key]: value }));
    setProductStatus((current) => (current.message ? { type: "", message: "" } : current));
  }

  function updateAddUnboxing(key, value) {
    setAddUnboxingForm((current) => ({ ...current, [key]: value }));
    setVideoStatus((current) => (current.message ? { type: "", message: "" } : current));
  }

  function updateEditingCategory(key, value) {
    setEditingCategoryForm((current) => ({ ...current, [key]: value }));
  }

  function updateEditingProduct(key, value) {
    setEditingProductForm((current) => ({ ...current, [key]: value }));
  }

  function updateEditingUnboxing(key, value) {
    setEditingUnboxingForm((current) => ({ ...current, [key]: value }));
  }

  function resetAddCategory() {
    setAddCategoryForm(emptyCategoryForm);
    setCategoryStatus({ type: "", message: "" });
  }

  function resetAddProduct() {
    setAddProductForm(emptyProductForm);
    setProductStatus({ type: "", message: "" });
  }

  function resetAddUnboxing() {
    setAddUnboxingForm(emptyUnboxingForm);
    setVideoStatus({ type: "", message: "" });
  }

  function openCategoryEditor(item) {
    setEditingCategory(item);
    setEditingCategoryForm({
      title: item.title,
      subtitle: item.subtitle || "",
      alt: item.alt,
      image: null,
    });
    setEditCategoryStatus({ type: "", message: "" });
  }

  function closeCategoryEditor() {
    setEditingCategory(null);
    setEditingCategoryForm(emptyCategoryForm);
    setEditCategoryStatus({ type: "", message: "" });
  }

  function openProductEditor(item) {
    setEditingProduct(item);
    setEditingProductForm({
      title: item.title,
      description: item.description,
      alt: item.alt,
      category: item.category || "",
      trending: item.trending,
      image: null,
    });
    setEditProductStatus({ type: "", message: "" });
  }

  function closeProductEditor() {
    setEditingProduct(null);
    setEditingProductForm(emptyProductForm);
    setEditProductStatus({ type: "", message: "" });
  }

  function openUnboxingEditor(item) {
    setEditingUnboxing(item);
    setEditingUnboxingForm({
      title: item.title,
      description: item.description,
      productName: item.productName,
      poster: null,
      video: null,
    });
    setEditVideoStatus({ type: "", message: "" });
  }

  function closeUnboxingEditor() {
    setEditingUnboxing(null);
    setEditingUnboxingForm(emptyUnboxingForm);
    setEditVideoStatus({ type: "", message: "" });
  }

  async function onLogin(event) {
    event.preventDefault();
    setLoggingIn(true);
    setLoginStatus({ type: "", message: "" });

    try {
      const response = await requestApi("/admin/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      setAuth({ checking: false, loggedIn: true, username: response.data.username });
      setLogin({ username: "", password: "" });
    } catch (error) {
      setLoginStatus({ type: "error", message: error.message });
    } finally {
      setLoggingIn(false);
    }
  }

  async function onLogout() {
    setLoggingOut(true);

    try {
      await requestApi("/admin/logout", { method: "POST" });
    } finally {
      setAuth({ checking: false, loggedIn: false, username: "" });
      setData({ categories: [], products: [], unboxingVideos: [] });
      setActiveTab("categories");
      resetAddCategory();
      resetAddProduct();
      resetAddUnboxing();
      closeCategoryEditor();
      closeProductEditor();
      closeUnboxingEditor();
      setLoggingOut(false);
    }
  }

  async function submitCategoryForm(form, mode) {
    const body = new FormData();
    body.append("title", form.title);
    body.append("subtitle", form.subtitle);
    body.append("alt", form.alt);

    if (form.image) {
      body.append("image", form.image);
    }

    return requestApi(mode === "edit" ? `/admin/categories/${editingCategory._id}` : "/admin/categories", {
      method: mode === "edit" ? "PUT" : "POST",
      body,
    });
  }

  async function submitProductForm(form, mode) {
    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("alt", form.alt);
    body.append("category", form.category);
    body.append("trending", String(form.trending));

    if (form.image) {
      body.append("image", form.image);
    }

    return requestApi(mode === "edit" ? `/admin/products/${editingProduct._id}` : "/admin/products", {
      method: mode === "edit" ? "PUT" : "POST",
      body,
    });
  }

  async function submitUnboxingForm(form, mode) {
    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("productName", form.productName);

    if (form.poster) {
      body.append("poster", form.poster);
    }

    if (form.video) {
      body.append("video", form.video);
    }

    return requestApi(mode === "edit" ? `/admin/unboxing/${editingUnboxing._id}` : "/admin/unboxing", {
      method: mode === "edit" ? "PUT" : "POST",
      body,
    });
  }

  async function saveNewProduct(event) {
    event.preventDefault();
    setSavingProduct(true);
    setProductStatus({ type: "", message: "" });

    try {
      const response = await submitProductForm(addProductForm, "add");
      resetAddProduct();
      setProductStatus({ type: "success", message: response.message });
      await loadDashboard();
      setActiveTab("products");
    } catch (error) {
      setProductStatus({ type: "error", message: error.message });
    } finally {
      setSavingProduct(false);
    }
  }

  async function saveNewCategory(event) {
    event.preventDefault();
    setSavingCategory(true);
    setCategoryStatus({ type: "", message: "" });

    try {
      const response = await submitCategoryForm(addCategoryForm, "add");
      resetAddCategory();
      setCategoryStatus({ type: "success", message: response.message });
      await loadDashboard();
    } catch (error) {
      setCategoryStatus({ type: "error", message: error.message });
    } finally {
      setSavingCategory(false);
    }
  }

  async function saveEditedCategory(event) {
    event.preventDefault();
    setSavingEditCategory(true);
    setEditCategoryStatus({ type: "", message: "" });

    try {
      const response = await submitCategoryForm(editingCategoryForm, "edit");
      setEditCategoryStatus({ type: "success", message: response.message });
      await loadDashboard();
      closeCategoryEditor();
    } catch (error) {
      setEditCategoryStatus({ type: "error", message: error.message });
    } finally {
      setSavingEditCategory(false);
    }
  }

  async function saveNewUnboxing(event) {
    event.preventDefault();
    setSavingVideo(true);
    setVideoStatus({ type: "", message: "" });

    try {
      const response = await submitUnboxingForm(addUnboxingForm, "add");
      resetAddUnboxing();
      setVideoStatus({ type: "success", message: response.message });
      await loadDashboard();
      setActiveTab("unboxing");
    } catch (error) {
      setVideoStatus({ type: "error", message: error.message });
    } finally {
      setSavingVideo(false);
    }
  }

  async function saveEditedProduct(event) {
    event.preventDefault();
    setSavingEditProduct(true);
    setEditProductStatus({ type: "", message: "" });

    try {
      const response = await submitProductForm(editingProductForm, "edit");
      setEditProductStatus({ type: "success", message: response.message });
      await loadDashboard();
      closeProductEditor();
    } catch (error) {
      setEditProductStatus({ type: "error", message: error.message });
    } finally {
      setSavingEditProduct(false);
    }
  }

  async function saveEditedUnboxing(event) {
    event.preventDefault();
    setSavingEditVideo(true);
    setEditVideoStatus({ type: "", message: "" });

    try {
      const response = await submitUnboxingForm(editingUnboxingForm, "edit");
      setEditVideoStatus({ type: "success", message: response.message });
      await loadDashboard();
      closeUnboxingEditor();
    } catch (error) {
      setEditVideoStatus({ type: "error", message: error.message });
    } finally {
      setSavingEditVideo(false);
    }
  }

  async function deleteProduct(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      await requestApi(`/admin/products/${item._id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Product deleted successfully." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  async function deleteCategory(item) {
    if (!window.confirm(`Delete category "${item.title}"? Related products will move to No Category.`)) {
      return;
    }

    try {
      await requestApi(`/admin/categories/${item._id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Category deleted successfully." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  function startRearrangingCategories() {
    setCategoryDraftOrder(categories);
    setIsRearrangingCategories(true);
    setStatus({ type: "", message: "" });
  }

  function cancelRearrangingCategories() {
    setCategoryDraftOrder(categories);
    setIsRearrangingCategories(false);
    setDraggedCategoryId("");
    setDragOverCategoryId("");
  }

  function moveCategoryInDraft(targetCategoryId) {
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) {
      return;
    }

    setCategoryDraftOrder((currentCategories) => {
      const draggedIndex = currentCategories.findIndex((category) => category._id === draggedCategoryId);
      const targetIndex = currentCategories.findIndex((category) => category._id === targetCategoryId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return currentCategories;
      }

      const nextCategories = [...currentCategories];
      const [draggedCategory] = nextCategories.splice(draggedIndex, 1);
      nextCategories.splice(targetIndex, 0, draggedCategory);
      return nextCategories;
    });
  }

  async function saveCategoryOrder() {
    setSavingCategoryOrder(true);

    try {
      await requestApi("/admin/categories/reorder", {
        method: "PATCH",
        body: JSON.stringify({
          categoryIds: categoryDraftOrder.map((category) => category._id),
        }),
      });
      setIsRearrangingCategories(false);
      setDraggedCategoryId("");
      setDragOverCategoryId("");
      setStatus({ type: "success", message: "Category order updated successfully." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingCategoryOrder(false);
    }
  }

  async function deleteUnboxing(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    try {
      await requestApi(`/admin/unboxing/${item._id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Unboxing video deleted successfully." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  if (auth.checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-full bg-white px-5 py-3 text-sm font-bold text-on-surface shadow-[0_16px_32px_-24px_rgba(31,41,55,0.3)]">
          Checking admin session...
        </div>
      </main>
    );
  }

  if (!auth.loggedIn) {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,rgba(254,240,138,0.26),rgba(255,255,255,1)_26%,rgba(186,230,253,0.16)_100%)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
          <div className="grid w-full gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(250,204,21,0.22),rgba(14,165,233,0.14))] p-8 shadow-[0_35px_70px_-44px_rgba(31,41,55,0.45)] ring-1 ring-white/70">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-primary-dim">Admin Access</p>
              <h1 className="mt-4 font-headline text-4xl font-black tracking-tight text-on-surface">
                Sign in to manage the dashboard.
              </h1>
              <p className="mt-4 text-sm font-medium leading-6 text-on-surface-variant sm:text-base">
                The admin route is separate from the public storefront. Once logged in, returning to
                <span className="font-black text-on-surface"> /admin</span> opens the admin view directly.
              </p>
            </section>

            <section className="rounded-[2.25rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(31,41,55,0.4)] ring-1 ring-primary/10 sm:p-8">
              <h2 className="font-headline text-2xl font-black tracking-tight text-on-surface">Admin Login</h2>
              <form className="mt-6 grid gap-4" onSubmit={onLogin}>
                <Field label="Username" required>
                  <Input
                    autoComplete="username"
                    onChange={(event) => setLogin((current) => ({ ...current, username: event.target.value }))}
                    required
                    value={login.username}
                  />
                </Field>
                <Field label="Password" required>
                  <div className="relative">
                    <Input
                      autoComplete="current-password"
                      onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))}
                      required
                      type={showPassword ? "text" : "password"}
                      value={login.password}
                    />
                    <button
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-on-surface-variant transition hover:bg-surface-container"
                      onClick={() => setShowPassword((current) => !current)}
                      type="button"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </Field>
                <Status value={loginStatus} />
                <button
                  className="inline-flex items-center justify-center rounded-full bg-on-surface px-6 py-3 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loggingIn}
                  type="submit"
                >
                  {loggingIn ? "Signing In..." : "Login"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(250,250,249,1),rgba(255,251,235,0.88)_100%)]">
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-primary-dim">Admin Dashboard</p>
            <h1 className="mt-1 font-headline text-2xl font-black tracking-tight text-on-surface">Chawla Gift Centre</h1>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">Logged in as {auth.username}</p>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-full border border-outline-variant bg-white px-5 py-3 text-sm font-black text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loggingOut}
            onClick={onLogout}
            type="button"
          >
            {loggingOut ? "Logging Out..." : "Logout"}
          </button>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap gap-3">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                className={[
                  "rounded-full px-5 py-3 text-sm font-black transition",
                  activeTab === id
                    ? "bg-on-surface text-white"
                    : "border border-outline-variant bg-white text-on-surface hover:bg-surface-container",
                ].join(" ")}
                onClick={() => setActiveTab(id)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <Status value={status} />

          {activeTab === "categories" ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-end gap-3">
                {isRearrangingCategories ? (
                  <>
                    <button
                      className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container"
                      onClick={cancelRearrangingCategories}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-full bg-on-surface px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={savingCategoryOrder}
                      onClick={saveCategoryOrder}
                      type="button"
                    >
                      {savingCategoryOrder ? "Saving..." : "Save Order"}
                    </button>
                  </>
                ) : (
                  <button
                    className="rounded-full border border-outline-variant bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container"
                    onClick={startRearrangingCategories}
                    type="button"
                  >
                    Rearrange
                  </button>
                )}
              </div>

              {data.categories.length === 0 && !loading ? (
                <EmptyState
                  title="No categories added yet"
                  description="Create categories here and the homepage will show the first 6 by sort order."
                />
              ) : (
                <TableWrap>
                  <table className="min-w-full text-left">
                    <thead className="bg-surface-container text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                      <tr>
                        <th className="px-4 py-4">Move</th>
                        <th className="px-4 py-4">Image</th>
                        <th className="px-4 py-4">Name</th>
                        <th className="px-4 py-4">Sort</th>
                        <th className="px-4 py-4">Updated</th>
                        <th className="px-4 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(isRearrangingCategories ? categoryDraftOrder : data.categories).map((item, index) => (
                        <tr
                          key={item._id}
                          className={[
                            "border-t border-outline-variant text-sm transition-all duration-150",
                            draggedCategoryId === item._id ? "scale-[1.01] bg-primary-container/40 opacity-65 shadow-[inset_0_0_0_2px_rgba(234,179,8,0.22)]" : "",
                            dragOverCategoryId === item._id && draggedCategoryId !== item._id
                              ? "bg-secondary-container/25 shadow-[inset_0_0_0_2px_rgba(14,165,233,0.18)]"
                              : "",
                          ].join(" ")}
                          onDragEnter={() => {
                            if (isRearrangingCategories && draggedCategoryId && draggedCategoryId !== item._id) {
                              setDragOverCategoryId(item._id);
                              moveCategoryInDraft(item._id);
                            }
                          }}
                          onDragOver={(event) => {
                            if (isRearrangingCategories) {
                              event.preventDefault();
                            }
                          }}
                          onDrop={() => {
                            if (isRearrangingCategories) {
                              setDragOverCategoryId("");
                            }
                          }}
                        >
                          <td className="px-4 py-4">
                            {isRearrangingCategories ? (
                              <button
                                aria-label={`Drag ${item.title}`}
                                className={[
                                  "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container text-on-surface-variant",
                                  draggedCategoryId === item._id ? "cursor-grabbing bg-primary-container text-primary shadow-[0_10px_30px_-18px_rgba(234,179,8,0.9)]" : "cursor-grab",
                                ].join(" ")}
                                draggable
                                onDragEnd={() => {
                                  setDraggedCategoryId("");
                                  setDragOverCategoryId("");
                                }}
                                onDragStart={(event) => {
                                  setDraggedCategoryId(item._id);
                                  setDragOverCategoryId(item._id);
                                  event.dataTransfer.effectAllowed = "move";
                                }}
                                type="button"
                              >
                                <MdDragIndicator className="text-lg" />
                              </button>
                            ) : (
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant">
                                <MdDragIndicator className="text-lg" />
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <img alt={item.title} className="h-14 w-14 rounded-2xl object-cover" src={item.image} />
                              <a className="inline-flex text-xs font-black uppercase tracking-[0.14em] text-primary" href={item.image} rel="noreferrer" target="_blank">
                                Open Image
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-on-surface">{item.title}</p>
                            <p className="mt-1 max-w-md line-clamp-2 text-on-surface-variant">{item.subtitle || "No subtitle"}</p>
                          </td>
                          <td className="px-4 py-4 font-semibold text-on-surface-variant">
                            {isRearrangingCategories ? `#${index + 1}` : `#${item.sortOrder + 1}`}
                          </td>
                          <td className="px-4 py-4 font-semibold text-on-surface-variant">{formatDate(item.updatedAt)}</td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-2">
                              <button className="rounded-full border border-outline-variant px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container" onClick={() => openCategoryEditor(item)} type="button">
                                Edit
                              </button>
                              <button className="rounded-full border border-error/20 bg-error-container px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-error-container transition hover:opacity-90" onClick={() => deleteCategory(item)} type="button">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              )}

              <CategoryForm
                currentImage=""
                form={addCategoryForm}
                isSaving={savingCategory}
                onChange={updateAddCategory}
                onSubmit={saveNewCategory}
                status={categoryStatus}
                submitLabel="Save Category"
                subtitle="Categories here power both the homepage and the products page. Only the first 8 appear on the homepage."
                title="Add Category"
              />
            </div>
          ) : null}

          {activeTab === "products" ? (
            data.products.length === 0 && !loading ? (
              <EmptyState title="No products added yet" description="Use the Add Product tab to create your first product." />
            ) : (
              <TableWrap>
                <table className="min-w-full text-left">
                  <thead className="bg-surface-container text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-4">Image</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Trending</th>
                      <th className="px-4 py-4">Updated</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((item) => (
                      <tr key={item._id} className="border-t border-outline-variant text-sm">
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <img alt={item.title} className="h-14 w-14 rounded-2xl object-cover" src={item.image} />
                            <a className="inline-flex text-xs font-black uppercase tracking-[0.14em] text-primary" href={item.image} rel="noreferrer" target="_blank">
                              Open Image
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-on-surface">{item.title}</p>
                          <p className="mt-1 max-w-md line-clamp-2 text-on-surface-variant">{item.description}</p>
                        </td>
                        <td className="px-4 py-4 font-semibold text-on-surface-variant">{item.category || "No Category"}</td>
                        <td className="px-4 py-4">
                          <span className={["rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em]", item.trending ? "bg-mint-container text-on-mint" : "bg-surface-container text-on-surface-variant"].join(" ")}>
                            {item.trending ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-on-surface-variant">{formatDate(item.updatedAt)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button className="rounded-full border border-outline-variant px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container" onClick={() => openProductEditor(item)} type="button">
                              Edit
                            </button>
                            <button className="rounded-full border border-error/20 bg-error-container px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-error-container transition hover:opacity-90" onClick={() => deleteProduct(item)} type="button">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )
          ) : null}

          {activeTab === "unboxing" ? (
            data.unboxingVideos.length === 0 && !loading ? (
              <EmptyState title="No unboxing videos added yet" description="Use the Add Unboxing Video tab to create your first record." />
            ) : (
              <TableWrap>
                <table className="min-w-full text-left">
                  <thead className="bg-surface-container text-xs font-black uppercase tracking-[0.18em] text-on-surface-variant">
                    <tr>
                      <th className="px-4 py-4">Poster</th>
                      <th className="px-4 py-4">Video</th>
                      <th className="px-4 py-4">Details</th>
                      <th className="px-4 py-4">Updated</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.unboxingVideos.map((item) => (
                      <tr key={item._id} className="border-t border-outline-variant text-sm align-top">
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <img alt={item.title} className="h-14 w-14 rounded-2xl object-cover" src={item.poster} />
                            <a className="inline-flex text-xs font-black uppercase tracking-[0.14em] text-primary" href={item.poster} rel="noreferrer" target="_blank">
                              Open Poster
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <video className="h-24 w-40 rounded-2xl bg-black object-cover" controls src={item.videoUrl} />
                            <a className="inline-flex text-xs font-black uppercase tracking-[0.14em] text-primary" href={item.videoUrl} rel="noreferrer" target="_blank">
                              Play Video
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-on-surface">{item.title}</p>
                          <p className="mt-1 font-semibold text-on-surface-variant">{item.productName}</p>
                          <p className="mt-2 max-w-md line-clamp-2 text-on-surface-variant">{item.description}</p>
                        </td>
                        <td className="px-4 py-4 font-semibold text-on-surface-variant">{formatDate(item.updatedAt)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button className="rounded-full border border-outline-variant px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-surface transition hover:bg-surface-container" onClick={() => openUnboxingEditor(item)} type="button">
                              Edit
                            </button>
                            <button className="rounded-full border border-error/20 bg-error-container px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-on-error-container transition hover:opacity-90" onClick={() => deleteUnboxing(item)} type="button">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableWrap>
            )
          ) : null}

          {activeTab === "add-product" ? (
            <ProductForm
              categories={categoryTitles}
              currentImage=""
              form={addProductForm}
              isSaving={savingProduct}
              onChange={updateAddProduct}
              onSubmit={saveNewProduct}
              status={productStatus}
              submitLabel="Save Product"
              subtitle="Add a new product. Category is optional and uses the shared category list."
              title="Add Product"
            />
          ) : null}

          {activeTab === "add-unboxing" ? (
            <UnboxingForm
              currentPoster=""
              currentVideo=""
              form={addUnboxingForm}
              isSaving={savingVideo}
              onChange={updateAddUnboxing}
              onSubmit={saveNewUnboxing}
              status={videoStatus}
              submitLabel="Save Unboxing Video"
              subtitle="Add a new unboxing video. This form is only for new entries."
              title="Add Unboxing Video"
            />
          ) : null}
        </div>
      </main>

      <EditModal isOpen={Boolean(editingCategory)} onClose={closeCategoryEditor} title="Edit Category">
        <CategoryForm
          currentImage={editingCategory?.image || ""}
          form={editingCategoryForm}
          isSaving={savingEditCategory}
          onCancel={closeCategoryEditor}
          onChange={updateEditingCategory}
          onSubmit={saveEditedCategory}
          status={editCategoryStatus}
          submitLabel="Update Category"
          subtitle="Renaming a category updates all linked products automatically. Deleting it moves products to No Category."
          title={editingCategory?.title || "Edit Category"}
        />
      </EditModal>

      <EditModal isOpen={Boolean(editingProduct)} onClose={closeProductEditor} title="Edit Product">
        <ProductForm
          categories={categoryTitles}
          currentImage={editingProduct?.image || ""}
          form={editingProductForm}
          isSaving={savingEditProduct}
          onCancel={closeProductEditor}
          onChange={updateEditingProduct}
          onSubmit={saveEditedProduct}
          status={editProductStatus}
          submitLabel="Update Product"
          subtitle="Review the current image and compare it with the new selected file before saving."
          title={editingProduct?.title || "Edit Product"}
        />
      </EditModal>

      <EditModal isOpen={Boolean(editingUnboxing)} onClose={closeUnboxingEditor} title="Edit Unboxing Video">
        <UnboxingForm
          currentPoster={editingUnboxing?.poster || ""}
          currentVideo={editingUnboxing?.videoUrl || ""}
          form={editingUnboxingForm}
          isSaving={savingEditVideo}
          onCancel={closeUnboxingEditor}
          onChange={updateEditingUnboxing}
          onSubmit={saveEditedUnboxing}
          status={editVideoStatus}
          submitLabel="Update Unboxing Video"
          subtitle="Review the current poster and video, then compare them with the new selected files before saving."
          title={editingUnboxing?.title || "Edit Unboxing Video"}
        />
      </EditModal>
    </div>
  );
}
