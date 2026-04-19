import { Router } from "express";
import {
  getProductCategories,
  getProducts,
  getTrendingProducts,
} from "../controllers/productController.js";

const router = Router();

router.get("/", getProducts);
router.get("/categories", getProductCategories);
router.get("/trending", getTrendingProducts);

export default router;
