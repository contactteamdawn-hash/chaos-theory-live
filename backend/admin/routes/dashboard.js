import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboard,
  getSubmissions,
} from "../controllers/DashboardController.js";

const router = express.Router();


/*
 * Protected dashboard endpoint
 *
 * GET /api/admin/dashboard
 */
router.get(
  "/dashboard",
  authMiddleware,
  getDashboard
);


/*
 * Protected submissions endpoint
 *
 * GET /api/admin/submissions
 */
router.get(
  "/submissions",
  authMiddleware,
  getSubmissions
);


export default router;