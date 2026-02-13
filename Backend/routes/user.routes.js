import express from "express";
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);
router.delete("/account", deleteAccount);

export default router;
