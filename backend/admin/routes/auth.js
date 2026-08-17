import express from "express";
import { loginAdmin,logoutAdmin,getAdminProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/logout",logoutAdmin);
router.get("/profile",authMiddleware,getAdminProfile);

export default router;