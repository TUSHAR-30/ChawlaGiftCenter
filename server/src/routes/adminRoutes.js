import { Router } from "express";
import {
  createCategory,
  createProduct,
  createUnboxingVideo,
  deleteCategory,
  deleteProduct,
  deleteUnboxingVideo,
  getAdminDashboardData,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  reorderCategories,
  updateCategory,
  updateProduct,
  updateUnboxingVideo,
} from "../controllers/adminController.js";
import { requireAdminAuth } from "../middleware/requireAdminAuth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/session", requireAdminAuth, getAdminSession);
router.get("/dashboard", requireAdminAuth, getAdminDashboardData);
router.post("/categories", requireAdminAuth, upload.single("image"), createCategory);
router.patch("/categories/reorder", requireAdminAuth, reorderCategories);
router.put("/categories/:id", requireAdminAuth, upload.single("image"), updateCategory);
router.delete("/categories/:id", requireAdminAuth, deleteCategory);
router.post("/products", requireAdminAuth, upload.single("image"), createProduct);
router.put("/products/:id", requireAdminAuth, upload.single("image"), updateProduct);
router.delete("/products/:id", requireAdminAuth, deleteProduct);
router.post(
  "/unboxing",
  requireAdminAuth,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createUnboxingVideo,
);
router.put(
  "/unboxing/:id",
  requireAdminAuth,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updateUnboxingVideo,
);
router.delete("/unboxing/:id", requireAdminAuth, deleteUnboxingVideo);

export default router;
