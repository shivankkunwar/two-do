import { CheckCircle, Sparkles, Plus } from "lucide-react";
import { type Todo } from "../../types";
import TodoItem from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
}

const TodoList = ({ todos, loading, onToggleStatus, onEdit, onDelete }: TodoListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
                <div className="w-20 h-6 bg-gray-200 dark:bg-gray-600 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-600 rounded-xl" />
                <div className="w-20 h-8 bg-gray-200 dark:bg-gray-600 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <div className="max-w-sm mx-auto space-y-4">
          {/* Friendly illustration */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900 dark:to-secondary-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary-500 dark:text-primary-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-secondary-500 dark:text-secondary-400 animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Ready to get organized? 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              You don't have any todos yet. Create your first task and start being productive!
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium">
            <Plus className="w-4 h-4" />
            <span>Click "Add Todo" to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {todos.map((todo) => (
        <div key={todo._id} className="min-h-[200px]"> {/* For squarish feel */}
          <TodoItem 
            todo={todo} 
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList; 