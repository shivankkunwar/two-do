import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTodoItem } from './SortableTodoItem';
import { type Todo } from "../../types";
import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";
import { CheckCircle, Sparkles, Plus } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
  pageSize?: number;
}

const TodoList = ({ todos, loading, onToggleStatus, onEdit, onDelete, pageSize = 6 }: TodoListProps) => {
  const [page, setPage] = useState(0);
  const [localOrder, setLocalOrder] = useState<Todo[]>([]);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const pending = todos.filter(t => t.status === "pending");
    const completed = todos.filter(t => t.status === "completed");
    setLocalOrder([...pending, ...completed]);
  }, [todos]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 8 pixels before activating
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      // Only require movement to start drag, no delay
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const paginated = localOrder.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(localOrder.length / pageSize);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const todo = localOrder.find(t => t._id === active.id);
    setActiveTodo(todo || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);

    if (over && active.id !== over.id) {
      const oldIndex = localOrder.findIndex(t => t._id === active.id);
      const newIndex = localOrder.findIndex(t => t._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        let newSortedOrder = arrayMove(localOrder, oldIndex, newIndex);
        
        // Keep completed at the bottom
        newSortedOrder.sort((a, b) => {
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          return 0;
        });

        setLocalOrder(newSortedOrder);
      }
    }
  };

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
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={paginated.map(t => t._id)} 
          strategy={isMobile ? verticalListSortingStrategy : rectSortingStrategy}
        >
          <div className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            {paginated.map(todo => (
              <SortableTodoItem key={todo._id} todo={todo} onToggleStatus={onToggleStatus} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeTodo ? <TodoItem todo={activeTodo} onToggleStatus={async () => {}} onEdit={() => {}} onDelete={async () => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Prev
          </button>
          <span className="self-center text-sm">
            Page {page + 1} / {totalPages}
          </span>
          <button
            disabled={page + 1 === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default TodoList; 