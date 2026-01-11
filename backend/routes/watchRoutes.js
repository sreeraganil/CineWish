import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getAllWatchProgress, getCompletedWatchList, getContinueWatching, getWatchProgressByMedia, removeFromHistory, saveProgress } from "../controllers/watchController.js";

const router = express.Router();

router.post("/progress", authMiddleware, saveProgress);
router.get("/progress", authMiddleware, getAllWatchProgress);
router.get("/continue", authMiddleware, getContinueWatching);
router.get("/completed", authMiddleware, getCompletedWatchList);
router.get("/progress/:mediaType/:mediaId", authMiddleware, getWatchProgressByMedia);
router.delete("/history/:mediaType/:mediaId", authMiddleware, removeFromHistory);


export default router;
