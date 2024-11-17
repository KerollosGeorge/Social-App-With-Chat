import express from "express";
import { Login, Register, Logout, RefreshToken } from "../controllers/auth.js";
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/refresh", RefreshToken);
router.post("/logout", Logout);

export default router;
