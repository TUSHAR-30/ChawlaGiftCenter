import { Router } from "express";
import { getUnboxingVideos } from "../controllers/unboxingController.js";

const router = Router();

router.get("/", getUnboxingVideos);

export default router;
