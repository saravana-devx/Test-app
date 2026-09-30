import { Request, Response, NextFunction } from "express";

export function validateTask(req: Request, res: Response, next: NextFunction) {
  const { title, priority } = req.body;

  // BUG-004: missing null/undefined check — crashes with TypeError if body is empty
  if (title.length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Priority must be low, medium, or high" });
  }

  next();
}
