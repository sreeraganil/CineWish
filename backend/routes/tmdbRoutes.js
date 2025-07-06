import express from "express";
import { getDetails, getRecommendations, getTrending, getUpcoming, searchTMDB } from "../controllers/tmdbController.js";

const router = express.Router();

router.get("/trending", getTrending); 
router.get("/upcoming", getUpcoming);
router.get("/search", searchTMDB);
router.get("/details/:media/:id", getDetails);
router.get("/recommendations/:media/:id", getRecommendations);

export default router;
