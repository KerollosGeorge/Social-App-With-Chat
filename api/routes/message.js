import express from "express";

import {
  DeleteMessage,
  GetMessages,
  sendMessage,
  UpdateMessage,
} from "../controllers/message.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/:id", verifyToken, sendMessage);
router.get("/:id", verifyToken, GetMessages);
router.put("/", verifyToken, UpdateMessage);
router.delete("/", verifyToken, DeleteMessage);

export default router;
