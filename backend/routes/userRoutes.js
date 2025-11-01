import express from "express";
import { getProfileData, getWatchStats } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getWatchStats);
router.get("/profile", authMiddleware, getProfileData);

export default router;
