import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type { Todo, CreateTodoData, UpdateTodoData } from "../types";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = status ? { status } : {};
      const { data } = await api.get("/todos", { params });
      setTodos(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (todoData: CreateTodoData) => {
    try {
      setError(null);
      const { data } = await api.post("/todos", todoData);
      setTodos(prev => [data.data, ...prev]);
      return data.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create todo");
      throw err;
    }
  }, []);

  const updateTodo = useCallback(async (id: string, updates: UpdateTodoData) => {
    try {
      setError(null);
      const { data } = await api.patch(`/todos/${id}`, updates);
      setTodos(prev => 
        prev.map(todo => todo._id === id ? data.data : todo)
      );
      return data.data;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update todo");
      throw err;
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await api.delete(`/todos/${id}`);
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete todo");
      throw err;
    }
  }, []);

  const toggleTodoStatus = useCallback(async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    return updateTodo(id, { status: newStatus });
  }, [updateTodo]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
  };
}; 