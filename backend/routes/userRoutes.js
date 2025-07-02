import express from "express";
import { getWatchStats } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getWatchStats);

export default router;
