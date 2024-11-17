import express from "express";
import {
  addFollow,
  getFriends,
  getSuggest,
  removeFollow,
} from "../controllers/relationships.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getFriends);
router.get("/suggestion", verifyToken, getSuggest);
router.post("/", verifyToken, addFollow);
router.delete("/", verifyToken, removeFollow);

export default router;
