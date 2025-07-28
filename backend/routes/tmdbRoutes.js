import express from "express";
import { getDetails, getRecommendations, getTrending, getUpcoming, getUpcomingList, searchTMDB } from "../controllers/tmdbController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/trending", getTrending); 
router.get("/upcoming", getUpcoming);
router.get("/upcoming/list", getUpcomingList);
router.get("/search", searchTMDB);
router.get("/details/:media/:id", getDetails);
router.get("/recommendations/:media/:id", authMiddleware, getRecommendations);

export default router;
