import express from "express";
import {
  getConversations,
  updateConversation,
  getConversationMessages,
  sendConversationMessage,
  editConversationMessage,
  deleteConversationMessage,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getConversations);

router.route("/:id")
  .put(protect, updateConversation);

router.route("/:id/messages")
  .get(protect, getConversationMessages)
  .post(protect, sendConversationMessage);

router.route("/:id/messages/:msgId")
  .put(protect, editConversationMessage)
  .delete(protect, deleteConversationMessage);

export default router;
