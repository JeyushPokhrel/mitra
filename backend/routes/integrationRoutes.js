import express from "express";
import { getIntegrations, toggleIntegration } from "../controllers/integrationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getIntegrations)
  .post(protect, toggleIntegration);

export default router;
