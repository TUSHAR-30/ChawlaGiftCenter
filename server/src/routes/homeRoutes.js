import { Router } from "express";
import { getHomePageData } from "../controllers/homeController.js";

const router = Router();

router.get("/", getHomePageData);

export default router;
