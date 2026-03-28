import express from "express";
import {
  subscribe,
  sendPush,
  testPush,
} from "../controllers/pushController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// user subscribes
router.post("/subscribe", authMiddleware, subscribe);

// admin sends notification
router.post("/send", sendPush);

// test route
router.post("/test", testPush);

export default router;