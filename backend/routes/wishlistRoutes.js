import express from "express";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishListController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/:tmdbId", authMiddleware, removeFromWishlist);

export default router;
