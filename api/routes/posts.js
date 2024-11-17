import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  updatePost,
} from "../controllers/posts.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.get("/find", verifyToken, getUserPosts);
router.get("/find/:id", verifyToken, getPost);

router.post("/", verifyToken, addPost);
router.put("/", verifyToken, updatePost);
router.delete("/", verifyToken, deletePost);
export default router;
