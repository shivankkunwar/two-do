import { useState } from "react";
import { Check, Edit2, Trash2, Calendar, Clock, CheckCircle, Flame, AlertTriangle, Star } from "lucide-react";
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

  // Add priority color mapping
  const priorityColors = {
    low: { bg: 'rgba(39, 141, 141, 0.1)', text: '#278D8D' },
    medium: { bg: 'rgba(255, 210, 137, 0.2)', text: '#CC8500' },
    high: { bg: 'rgba(255, 0, 0, 0.1)', text: '#cc0000' }
  };

  return (
    <div className="rounded-3xl shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] relative overflow-hidden p-1 hover:border-gradient-to-r from-primary-300 to-secondary-300 dark:from-primary-700 dark:to-secondary-700 ${isOverdue ? 'animate-pulse-slow' : 'animate-fade-in'}" 
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
          className="absolute top-3 right-3 w-8 h-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
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
      <div className="p-3 space-y-1" style={{ paddingRight: todo.status === "pending" ? '3rem' : '0.75rem' }}>
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
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            {todo.priority && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full"
                    style={{
                      backgroundColor: priorityColors[todo.priority]?.bg || 'rgba(128, 128, 128, 0.1)',
                      color: priorityColors[todo.priority]?.text || 'gray',
                    }}>
                  {todo.priority === 'high' ? <Flame className="w-3 h-3" /> :
                   todo.priority === 'medium' ? <AlertTriangle className="w-3 h-3" /> :
                   <Star className="w-3 h-3" />}
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
            )}
            <h3 className={`text-base font-semibold transition-all duration-200 ${
              todo.status === "completed" 
                ? "line-through opacity-60 decoration-wavy decoration-secondary-500" 
                : ""
            }`} style={{ color: 'var(--text)' }}>
              {todo.title}
            </h3>
          </div>
          
          {todo.description && (
            <p className={`text-xs leading-relaxed line-clamp-3 ${
              todo.status === "completed" 
                ? "line-through opacity-60" 
                : "opacity-80"
            }`} style={{ color: 'var(--text)' }}>
              {todo.description}
            </p>
          )}
        </div>

        {/* Footer Row - combined due date left, actions right */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          {todo.dueDate && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 hover:bg-opacity-80`}
                 style={{
                   backgroundColor: badgeBg,
                   color: badgeText,
                 }}>
              <Calendar className="w-3 h-3" />
              <span>Due: {formatDate(todo.dueDate)}</span>
              {isOverdue && <span className="font-bold">⚠️</span>}
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(todo)}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-opacity-90 border border-transparent hover:border-primary-200 dark:hover:border-primary-700"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(39, 141, 141, 0.1)',
                color: isDarkMode ? '#FFD289' : '#278D8D',
              }}
            >
              <Edit2 className="w-3 h-3" style={{ color: 'var(--text)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>Edit</span>
            </button>
            
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:scale-105 hover:bg-opacity-90 border border-transparent hover:border-red-200 dark:hover:border-red-700"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                color: isDarkMode ? '#ff6b6b' : '#cc0000',
              }}
            >
              <Trash2 className="w-3 h-3" />
              <span className="text-xs font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 