import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByPriority,
} from "../controllers/taskController";
import { validateTask } from "../middleware/validate";

const router = Router();

router.get("/", getAllTasks);
router.get("/priority/:level", getTasksByPriority);
router.get("/:id", getTaskById);
router.post("/", validateTask, createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
