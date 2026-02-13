import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Stats route should be before /:id to avoid conflict
router.get("/stats", getTaskStats);

router.route("/").get(getTasks).post(createTask);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
