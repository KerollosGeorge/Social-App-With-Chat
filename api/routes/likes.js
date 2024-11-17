import express from "express";
import { addLike, getPostLikes, removeLike } from "../controllers/likes.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();
router.get("/", verifyToken, getPostLikes);
router.post("/", verifyToken, addLike);
router.delete("/", verifyToken, removeLike);
export default router;
