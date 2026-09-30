import { Request, Response } from "express";
import { Task } from "../types";

// In-memory store
let tasks: Task[] = [
  {
    id: 1,
    title: "Setup project",
    description: "Initialize the repo",
    completed: false,
    priority: "high",
    assignedTo: null,
    createdAt: new Date().toISOString(),
    dueDate: null,
  },
  {
    id: 2,
    title: "Write tests",
    description: "Add unit tests",
    completed: false,
    priority: "medium",
    assignedTo: 1,
    createdAt: new Date().toISOString(),
    dueDate: "2026-12-31",
  },
];

let nextId = 3;

// GET /api/tasks
export function getAllTasks(_req: Request, res: Response) {
  res.json(tasks);
}

// GET /api/tasks/:id
export function getTaskById(req: Request, res: Response) {
  const id = parseInt(req.params.id, 10);               // BUG-001: id is string, never matches number
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
}

// POST /api/tasks
export function createTask(req: Request, res: Response) {
  const { title, description, priority, dueDate } = req.body;
  const newTask: Task = {
    id: nextId,
    title,
    description,
    completed: false,
    priority,
    assignedTo: null,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null,
  };
  nextId++;                               // BUG-002: nextId incremented AFTER push, id is stale
  tasks.push(newTask);
  res.status(201).json(newTask);
}

// PUT /api/tasks/:id
export function updateTask(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks[index] = { ...tasks[index], ...req.body };
  res.json(tasks[index]);
}

// DELETE /api/tasks/:id
export function deleteTask(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(index, 1);
  res.status(204).send();
}

// GET /api/tasks/priority/:level
// BUG-006: this function has 60+ lines of redundant repeated logic (high complexity bug)
export function getTasksByPriority(req: Request, res: Response) {
  const level = req.params.level;

  if (level === "high") {
    const highTasks: Task[] = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].priority === "high") {
        highTasks.push(tasks[i]);
      }
    }
    const sortedHigh: Task[] = [];
    for (let i = 0; i < highTasks.length; i++) {
      for (let j = i + 1; j < highTasks.length; j++) {
        if (highTasks[i].createdAt > highTasks[j].createdAt) {
          const tmp = highTasks[i];
          highTasks[i] = highTasks[j];
          highTasks[j] = tmp;
        }
      }
    }
    for (let i = 0; i < highTasks.length; i++) {
      sortedHigh.push(highTasks[i]);
    }
    return res.json(sortedHigh);
  }

  if (level === "medium") {
    const mediumTasks: Task[] = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].priority === "medium") {
        mediumTasks.push(tasks[i]);
      }
    }
    const sortedMedium: Task[] = [];
    for (let i = 0; i < mediumTasks.length; i++) {
      for (let j = i + 1; j < mediumTasks.length; j++) {
        if (mediumTasks[i].createdAt > mediumTasks[j].createdAt) {
          const tmp = mediumTasks[i];
          mediumTasks[i] = mediumTasks[j];
          mediumTasks[j] = tmp;
        }
      }
    }
    for (let i = 0; i < mediumTasks.length; i++) {
      sortedMedium.push(mediumTasks[i]);
    }
    return res.json(sortedMedium);
  }

  if (level === "low") {
    const lowTasks: Task[] = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].priority === "low") {
        lowTasks.push(tasks[i]);
      }
    }
    const sortedLow: Task[] = [];
    for (let i = 0; i < lowTasks.length; i++) {
      for (let j = i + 1; j < lowTasks.length; j++) {
        if (lowTasks[i].createdAt > lowTasks[j].createdAt) {
          const tmp = lowTasks[i];
          lowTasks[i] = lowTasks[j];
          lowTasks[j] = tmp;
        }
      }
    }
    for (let i = 0; i < lowTasks.length; i++) {
      sortedLow.push(lowTasks[i]);
    }
    return res.json(sortedLow);
  }

  return res.status(400).json({ error: "Invalid priority level. Use: high, medium, low" });
}
