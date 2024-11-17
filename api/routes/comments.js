import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
  getPostComments,
  updateComment,
} from "../controllers/comments.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getPostComments);
router.get("/find/:id", verifyToken, getComment);

router.post("/", verifyToken, addComment);
router.put("/:id", verifyToken, updateComment);
router.delete("/:id", verifyToken, deleteComment);
export default router;
