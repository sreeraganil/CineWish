import express from "express";
import { collectionTMDB, discoverTMDB, getDetails, getLatestOTT, getNowPlaying, getPersonDetails, getRecommendations, getTrending, getUpcoming, getUpcomingList, relatedContent, searchTMDB } from "../controllers/tmdbController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import apicache from "apicache";

const cache = apicache.middleware;


const router = express.Router();


router.get("/trending", cache("30 minutes"), getTrending); 
router.get("/upcoming", cache("30 minutes"), getUpcoming);
router.get("/now-playing", cache("30 minutes"), getNowPlaying);
router.get("/upcoming/list", cache("30 minutes"), getUpcomingList);
router.get("/ott", cache("30 minutes"), getLatestOTT);
router.get("/search", searchTMDB);
router.get("/details/:media/:id", getDetails);
router.get("/recommendations/:media/:id", authMiddleware, getRecommendations);
router.get("/discover", cache("30 minutes"), discoverTMDB);
router.get("/:media/:id/:related", relatedContent);
router.get("/collection/:id", collectionTMDB);
router.get("/person/:id", getPersonDetails);

export default router;
