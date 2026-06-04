import express from "express";
import { getVisitors, getVisitorById, upsertVisitor, updateVisitor, deleteVisitor } from "../controllers/visitorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getVisitors)
  .post(upsertVisitor); // allow public chat widget integration to register visitor session

router.route("/:id")
  .get(protect, getVisitorById)
  .put(protect, updateVisitor)
  .delete(protect, deleteVisitor);

export default router;
