import { Router } from "express";
import { getProfile, login, register } from "../controllers/auth/authController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;
