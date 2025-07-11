export interface User {
  email: string;
  userName: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "completed";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  status?: "pending" | "completed";
  dueDate?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  status?: "pending" | "completed";
  dueDate?: string;
} 