import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import TodoItem from './TodoItem';
import { type Todo } from '../../types';
import { useState, useEffect } from 'react';

interface SortableTodoItemProps {
  todo: Todo;
  onToggleStatus: (id: string, currentStatus: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => Promise<void>;
}

export const SortableTodoItem = (props: SortableTodoItemProps) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.todo._id, disabled: props.todo.status === 'completed' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className="relative"
      // Apply listeners to entire card on desktop, but not on mobile (we use the handle instead)
      {...(isDesktop && props.todo.status !== 'completed' ? listeners : {})}
    >
      <TodoItem {...props} />
      
      {/* Drag Handle - Bottom right inside the card, only on mobile */}
      {props.todo.status !== 'completed' && (
        <div 
          {...listeners}
          className="absolute bottom-3 right-3 p-2 rounded-lg cursor-grab active:cursor-grabbing touch-none md:hidden transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: 'rgba(39, 141, 141, 0.1)',
            border: '1px solid rgba(39, 141, 141, 0.3)'
          }}
        >
          <GripVertical className="w-3 h-3" style={{ color: '#278D8D' }} />
        </div>
      )}
    </div>
  );
}; 