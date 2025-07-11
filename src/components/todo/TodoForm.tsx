import { useState, useEffect } from "react";
import { Calendar, Save, X } from "lucide-react";
import { type Todo, type CreateTodoData } from "../../types";

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: CreateTodoData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const TodoForm = ({ todo, onSubmit, onCancel, loading }: TodoFormProps) => {
  const [formData, setFormData] = useState<CreateTodoData>({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : "",
        status: todo.status,
      });
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#090C16' }}>
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(9, 12, 22, 0.1)',
            color: '#090C16'
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#090C16' }}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Add more details..."
          className="w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderColor: 'rgba(9, 12, 22, 0.1)',
            color: '#090C16'
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#090C16' }}>
            <Calendar className="inline w-4 h-4 mr-1" />
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(9, 12, 22, 0.1)',
              color: '#090C16'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#090C16' }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderColor: 'rgba(9, 12, 22, 0.1)',
              color: '#090C16'
            }}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="flex-1 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: '#278D8D',
            color: 'white'
          }}
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : (todo ? "Update" : "Create")}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 rounded-2xl font-semibold border-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ 
            borderColor: '#278D8D',
            color: '#278D8D',
            backgroundColor: 'transparent'
          }}
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TodoForm; 