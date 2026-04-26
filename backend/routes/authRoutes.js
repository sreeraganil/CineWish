import express from "express";
import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from "../controllers/authController.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/register", registerLimiter, registerUser);
router.post("/login", loginLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
