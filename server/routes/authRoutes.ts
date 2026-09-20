import express from "express";
import { login, register } from "../controllers/authController.js";
import rateLimit from "../middleware/rateLimit.js";

const authRouter = express.Router();

// Slows down password guessing and bulk sign-ups from one address
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);

export default authRouter;
