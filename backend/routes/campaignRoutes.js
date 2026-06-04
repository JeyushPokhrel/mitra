import express from "express";
import { getCampaigns, createCampaign } from "../controllers/campaignController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getCampaigns)
  .post(protect, createCampaign);

export default router;
