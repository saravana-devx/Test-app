import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  assignTaskToUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/:id/assign", assignTaskToUser);

export default router;
