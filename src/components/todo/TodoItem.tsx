import { useState } from "react";
import { Check, Edit2, Trash2, Calendar, Clock, CheckCircle } from "lucide-react";
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
  const isDarkMode = document.documentElement.classList.contains('dark');

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

  // Calculate days until due date for nuanced color coding
  const daysUntilDue = todo.dueDate
    ? Math.ceil(
        (new Date(todo.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // Dynamic badge colors for better contrast in both themes
  const badgeBg = isOverdue
    ? isDarkMode
      ? "rgba(255, 0, 0, 0.25)"
      : "rgba(255, 0, 0, 0.1)"
    : daysUntilDue !== null && daysUntilDue <= 2
    ? isDarkMode
      ? "rgba(255, 210, 137, 0.25)" // amber in dark mode
      : "rgba(255, 210, 137, 0.3)"
    : isDarkMode
    ? "rgba(39, 141, 141, 0.3)"
    : "rgba(39, 141, 141, 0.1)";

  const badgeText = isOverdue
    ? isDarkMode
      ? "#ff6b6b"
      : "#cc0000"
    : daysUntilDue !== null && daysUntilDue <= 2
    ? isDarkMode
      ? "#FFD289"
      : "#CC8500"
    : isDarkMode
    ? "#B2F3DF"
    : "#278D8D";

  return (
    <div className="rounded-3xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] animate-slide-in relative overflow-hidden p-1"
         style={{ 
           backgroundColor: todo.status === "completed" 
             ? 'var(--card-done)' 
             : isOverdue 
             ? 'rgba(255, 100, 100, 0.2)' 
             : 'var(--card-total)',
           color: 'var(--text)'
         }}>
      
      {/* Quick Done Button - Floating on the right */}
      {todo.status === "pending" && (
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          className="absolute top-4 right-4 w-10 h-10 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
          style={{ 
            backgroundColor: '#278D8D',
            color: 'white'
          }}
          title="Mark as done"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
        </button>
      )}
      
      {/* Mobile-First Layout */}
      <div className="p-5 space-y-3" style={{ paddingRight: todo.status === "pending" ? '4rem' : '1.25rem' }}>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          {/* Status Badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
              todo.status === "completed"
                ? ''
                : ''
            }`}
            style={{
              backgroundColor: todo.status === "completed" 
                ? 'rgba(39, 141, 141, 0.2)' 
                : 'rgba(255, 210, 137, 0.5)',
              color: 'var(--text)'
            }}>
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
              ? "line-through opacity-60" 
              : ""
          }`} style={{ color: 'var(--text)' }}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`text-sm leading-relaxed ${
              todo.status === "completed" 
                ? "line-through opacity-60" 
                : "opacity-80"
            }`} style={{ color: 'var(--text)' }}>
              {todo.description}
            </p>
          )}

          {/* Due Date */}
          {todo.dueDate && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium`}
                 style={{
                   backgroundColor: badgeBg,
                   color: badgeText,
                 }}>
              <Calendar className="w-3 h-3" />
              <span>Due: {formatDate(todo.dueDate)}</span>
              {isOverdue && <span className="font-bold">⚠️ Overdue</span>}
            </div>
          )}
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-end gap-2 pt-2" 
             style={{ borderTop: '1px solid rgba(9, 12, 22, 0.1)' }}>
          <button
            onClick={() => onEdit(todo)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 border"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(39, 141, 141, 0.1)',
              color: isDarkMode ? '#FFD289' : '#278D8D',
              borderColor: 'var(--text)'
            }}
          >
            <Edit2 className="w-4 h-4" style={{ color: 'var(--text)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>Edit</span>
          </button>
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105 border"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)',
              color: isDarkMode ? '#ff6b6b' : '#cc0000',
              borderColor: isDarkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(204, 0, 0, 0.3)'
            }}
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-medium">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 