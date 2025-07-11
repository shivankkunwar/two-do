import { useState } from "react";
import { Check, Edit2, Trash2, Calendar, Clock } from "lucide-react";
import { type Todo } from "../../types";
import Button from "../ui/Button";

interface TodoItemProps {
  todo: Todo;
  onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
}

const TodoItem = ({ todo, onToggleStatus, onEdit, onDelete }: TodoItemProps) => {
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await onToggleStatus(todo._id, todo.status);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      setLoading(true);
      try {
        await onDelete(todo._id);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status === "pending";

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-in ${
      todo.status === "completed" 
        ? "border-secondary-200 dark:border-secondary-800 bg-gradient-to-br from-secondary-50 to-green-50 dark:from-secondary-900/20 dark:to-green-900/20" 
        : isOverdue 
        ? "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20" 
        : "border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700"
    }`}>
      
      {/* Mobile-First Layout */}
      <div className="p-4 space-y-3">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          {/* Status Toggle */}
          <button
            onClick={handleToggleStatus}
            disabled={loading}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              todo.status === "completed"
                ? "bg-gradient-to-br from-secondary-400 to-secondary-600 border-secondary-500 text-white shadow-lg"
                : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 bg-white dark:bg-gray-700"
            }`}
          >
            {todo.status === "completed" && <Check className="w-4 h-4" />}
            {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          </button>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
              todo.status === "completed"
                ? "bg-secondary-100 dark:bg-secondary-900 text-secondary-800 dark:text-secondary-200"
                : "bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-200"
            }`}>
              {todo.status === "completed" ? (
                <>
                  <span className="text-sm">✅</span>
                  Done
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  To Do
                </>
              )}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`text-lg font-semibold transition-all duration-200 ${
            todo.status === "completed" 
              ? "line-through text-gray-500 dark:text-gray-400" 
              : "text-gray-900 dark:text-white"
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`text-sm leading-relaxed ${
              todo.status === "completed" 
                ? "line-through text-gray-400 dark:text-gray-500" 
                : "text-gray-600 dark:text-gray-300"
            }`}>
              {todo.description}
            </p>
          )}

          {/* Due Date */}
          {todo.dueDate && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              isOverdue 
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" 
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
            }`}>
              <Calendar className="w-3 h-3" />
              <span>Due: {formatDate(todo.dueDate)}</span>
              {isOverdue && <span className="font-bold">⚠️ Overdue</span>}
            </div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-xs font-medium">Edit</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-medium">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 