import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { addStory, getStories } from "../controllers/stories.js";

const router = express.Router();

router.get("/", verifyToken, getStories);
router.post("/", verifyToken, addStory);

export default router;
