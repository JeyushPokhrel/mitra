import express from "express";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  bulkAssignContacts,
  getCompanies,
  getDeals,
  createDeal,
  updateDeal,
} from "../controllers/crmController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Contacts
router.route("/contacts")
  .get(protect, getContacts)
  .post(protect, createContact);

router.route("/contacts/bulk-delete")
  .post(protect, bulkDeleteContacts);

router.route("/contacts/bulk-assign")
  .post(protect, bulkAssignContacts);

router.route("/contacts/:id")
  .put(protect, updateContact)
  .delete(protect, deleteContact);

// Companies
router.route("/companies")
  .get(protect, getCompanies);

// Deals
router.route("/deals")
  .get(protect, getDeals)
  .post(protect, createDeal);

router.route("/deals/:id")
  .put(protect, updateDeal);

export default router;
