import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import homeRoutes from "./homeRoutes.js";
import productRoutes from "./productRoutes.js";
import unboxingRoutes from "./unboxingRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/home", homeRoutes);
router.use("/products", productRoutes);
router.use("/unboxing", unboxingRoutes);
router.use("/admin", adminRoutes);

export default router;
