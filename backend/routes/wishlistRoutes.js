import express from "express";
import { addToWishlist, getWishlist, markAsWatched, removeFromWishlist } from "../controllers/wishListController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/:id", authMiddleware, removeFromWishlist);
router.put("/:id", authMiddleware, markAsWatched);

export default router;
