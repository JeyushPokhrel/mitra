import express from "express";
import { runAiAction } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, runAiAction);

export default router;
