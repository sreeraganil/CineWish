import express from "express";
import { getEmoFeed, markWatchedEmo } from "../controllers/emoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/emo or /api/emo?feed=wishlist|upcoming|trending|ott
router.get("/", getEmoFeed);

// PUT /api/emo/watched/:id or POST /api/emo/watched
router.put("/watched/:id", authMiddleware, markWatchedEmo);
router.post("/watched", authMiddleware, markWatchedEmo);

export default router;
