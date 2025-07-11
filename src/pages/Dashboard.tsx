import { useState, useEffect } from "react";
import { Filter, Sparkles, Target, CheckCircle2, Plus, Clock } from "lucide-react";
import { useTodos } from "../hooks/useTodos";
import { type Todo, type CreateTodoData } from "../types";
import Header from "../components/layout/Header";
import TodoList from "../components/todo/TodoList";
import TodoForm from "../components/todo/TodoForm";
import Modal from "../components/ui/Modal";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");
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
    // Fetch all todos once; client-side filtering will be applied for views
    fetchTodos();
  }, [fetchTodos]);

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

  const filteredTodos = filter === "all" ? todos : todos.filter(t => t.status === filter);
  const pendingCount = todos.filter(todo => todo.status === "pending").length;
  const completedCount = todos.filter(todo => todo.status === "completed").length;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="min-h-screen">
        <Header onAddTodo={handleAddTodo} />

        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          {/* Welcome Section */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-6 h-6 text-white dark:text-card-3" />
              <h2 className="text-2xl font-bold text-white">Your Dashboard</h2>
              <Sparkles className="w-6 h-6 text-white dark:text-card-3" />
            </div>
            <p className="text-white/80">Let's get things done today! 🚀</p>
          </div>

          {/* Stats Cards - Compact Mobile Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {/* Total Tasks Card - Compact */}
            <div className="rounded-2xl shadow-sm animate-bounce-in p-3 bg-gradient-to-br from-[var(--card-total)] to-[rgba(var(--card-total-rgb),0.8)] relative overflow-hidden">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center bg-[rgba(39,141,141,0.2)] dark:bg-[rgba(255,255,255,0.1)]">
                  <Target className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="text-xl font-bold text-[var(--text)]">{todos.length}</div>
                <div className="text-xs text-[var(--text)] opacity-80">Total</div>
              </div>
              {/* Mini progress bar */}
              <div className="mt-2 h-1 bg-[rgba(0,0,0,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: todos.length > 0 ? `${(completedCount / todos.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
            
            {/* Pending Tasks Card - Compact */}
            <div className="rounded-2xl shadow-sm animate-bounce-in p-3 bg-gradient-to-br from-[var(--card-pending)] to-[rgba(var(--card-pending-rgb),0.8)] relative overflow-hidden" 
                 style={{ animationDelay: '0.1s' }}>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center bg-[rgba(255,210,137,0.3)] dark:bg-[rgba(255,255,255,0.1)]">
                  <Clock className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="text-xl font-bold text-[var(--text)]">{pendingCount}</div>
                <div className="text-xs text-[var(--text)] opacity-80">Pending</div>
              </div>
              {/* Mini urgency bar */}
              <div className="mt-2 h-1 bg-[rgba(0,0,0,0.1)] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    pendingCount > 3 ? 'bg-red-400' : pendingCount > 1 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                  style={{ width: `${Math.min((pendingCount / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            {/* Completed Tasks Card - Compact */}
            <div className="rounded-2xl shadow-sm animate-bounce-in p-3 bg-gradient-to-br from-[var(--card-done)] to-[rgba(var(--card-done-rgb),0.8)] relative overflow-hidden" 
                 style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-lg flex items-center justify-center bg-[rgba(238,199,173,0.3)] dark:bg-[rgba(255,255,255,0.1)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="text-xl font-bold text-[var(--text)]">{completedCount}</div>
                <div className="text-xs text-[var(--text)] opacity-80">Done</div>
              </div>
              {/* Mini achievement bar */}
              <div className="mt-2 h-1 bg-[rgba(0,0,0,0.1)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                  style={{ width: todos.length > 0 ? `${(completedCount / todos.length) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-3xl p-4 shadow-sm dark:border dark:border-white/10"
               style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white dark:text-card-3" />
                <span className="text-sm font-medium text-white dark:text-white">Filter tasks:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "completed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                      filter === status 
                        ? 'shadow-lg transform scale-105' 
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: filter === status ? '#FFD289' : 'rgba(255, 255, 255, 0.2)',
                      color: filter === status ? '#090C16' : 'white'
                    }}
                  >
                    {status === "all" ? "All Tasks" : status === "pending" ? "To Do" : "Completed"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-3xl p-4 animate-slide-in"
                 style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.2)' }}>
              <div className="flex items-center gap-2">
                <span className="text-red-200 text-2xl">⚠️</span>
                <p className="text-sm text-red-200 font-medium">{error}</p>
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

          {/* Floating Add Button for Mobile */}
          <button
            onClick={handleAddTodo}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all duration-200 sm:hidden"
            style={{ backgroundColor: '#FFD289' }}
          >
            <Plus className="w-8 h-8" style={{ color: '#090C16' }} />
          </button>

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
    </div>
  );
};

export default Dashboard;
