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
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  status?: "pending" | "completed";
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  status?: "pending" | "completed";
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
} 