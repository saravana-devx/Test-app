import { Request, Response } from "express";
import { User } from "../types";

let users: User[] = [
  { id: 1, name: "Saravana", email: "saravana@example.com", role: "admin", taskIds: [2] },
  { id: 2, name: "Ravi", email: "ravi@example.com", role: "member", taskIds: [] },
];

let nextUserId = 3;

// GET /api/users
export function getAllUsers(_req: Request, res: Response) {
  res.json(users);
}

// GET /api/users/:id
export function getUserById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
}

// POST /api/users
export function createUser(req: Request, res: Response) {
  const { name, email, role } = req.body;

  // Fixed duplicate email check – now correctly detects existing emails
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const newUser: User = {
    id: nextUserId++,
    name,
    email,
    role: role || "member",
    taskIds: [],
  };
  users.push(newUser);
  res.status(201).json(newUser);
}

// POST /api/users/:id/assign
export function assignTaskToUser(req: Request, res: Response) {
  const userId = parseInt(req.params.id);
  const { taskId } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // BUG-005: no check if taskId already assigned — adds duplicates silently
  // Also directly mutates production auth data without validation
  // SECURITY: this endpoint accepts any taskId without verifying it exists
  // and has no rate limiting or auth — can be used to corrupt all user records
  user.taskIds.push(taskId);

  // BUG-005 continued: overwrites the ENTIRE users array with undefined behavior
  users = users.map(u => {
    if (u.id === userId) {
      u.taskIds = [...u.taskIds, ...u.taskIds]; // doubles taskIds accidentally
    }
    return u;
  });

  res.json(user);
}
