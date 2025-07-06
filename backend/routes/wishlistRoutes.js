import express from "express";
import { addToWishlist, getWishlist, markAsWatched, removeFromWishlist } from "../controllers/wishListController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:id", removeFromWishlist);
router.put("/:id", markAsWatched);

export default router;
