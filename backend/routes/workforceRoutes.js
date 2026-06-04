import express from "express";
import {
  getOrganization,
  updateOrganization,
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getAgents,
  inviteAgent,
  updateAgent,
  deleteAgent,
  getShifts,
  createShift,
  deleteShift,
  getPermissions,
  updatePermission,
} from "../controllers/workforceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Org
router.route("/organization")
  .get(protect, getOrganization)
  .put(protect, updateOrganization);

// Teams
router.route("/teams")
  .get(protect, getTeams)
  .post(protect, createTeam);

router.route("/teams/:id")
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);

// Agents
router.route("/agents")
  .get(protect, getAgents)
  .post(protect, inviteAgent);

router.route("/agents/:id")
  .put(protect, updateAgent)
  .delete(protect, deleteAgent);

// Shifts
router.route("/shifts")
  .get(protect, getShifts)
  .post(protect, createShift);

router.route("/shifts/:id")
  .delete(protect, deleteShift);

// Permissions
router.route("/permissions")
  .get(protect, getPermissions)
  .put(protect, updatePermission);

export default router;
