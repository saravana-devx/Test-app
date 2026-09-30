export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  assignedTo: number | null;   // user id
  createdAt: string;
  dueDate: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member";
  taskIds: number[];
}
