import express from "express";
import { getBillingRecords } from "../controllers/billingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getBillingRecords);

export default router;
