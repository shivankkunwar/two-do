import { useState, useEffect } from "react";
import { Filter, Sparkles, Target, CheckCircle2 } from "lucide-react";
import { useTodos } from "../hooks/useTodos";
import { type Todo, type CreateTodoData } from "../types";
import Header from "../components/layout/Header";
import TodoList from "../components/todo/TodoList";
import TodoForm from "../components/todo/TodoForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [formLoading, setFormLoading] = useState(false);

  const {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
  } = useTodos();

  useEffect(() => {
    const statusFilter = filter === "all" ? undefined : filter;
    fetchTodos(statusFilter);
  }, [fetchTodos, filter]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateTodoData) => {
    setFormLoading(true);
    try {
      if (editingTodo) {
        await updateTodo(editingTodo._id, data);
      } else {
        await createTodo(data);
      }
      setIsModalOpen(false);
      setEditingTodo(null);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const filteredTodos = todos;
  const pendingCount = todos.filter(todo => todo.status === "pending").length;
  const completedCount = todos.filter(todo => todo.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header onAddTodo={handleAddTodo} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Dashboard</h2>
            <Sparkles className="w-6 h-6 text-secondary-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300">Let's get things done today! 🚀</p>
        </div>

        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center animate-bounce-in">
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{todos.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center animate-bounce-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900 dark:to-warning-800 rounded-xl flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">{pendingCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900 dark:to-secondary-800 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{completedCount}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Done</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter tasks:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "completed"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                    filter === status 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {status === "all" ? "All Tasks" : status === "pending" ? "To Do" : "Completed"}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 animate-slide-in">
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400 text-2xl">⚠️</span>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="animate-slide-in">
          <TodoList
            todos={filteredTodos}
            loading={loading}
            onToggleStatus={toggleTodoStatus}
            onEdit={handleEditTodo}
            onDelete={deleteTodo}
          />
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingTodo ? "Edit Todo" : "Create New Todo"}
        >
          <TodoForm
            todo={editingTodo || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            loading={formLoading}
          />
        </Modal>
      </main>
    </div>
  );
};

export default Dashboard;
