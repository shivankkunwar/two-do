import { useState, useEffect } from "react";
import { type CreateTodoData, type Todo } from "../../types";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface TodoFormProps {
  todo?: Todo;
  onSubmit: (data: CreateTodoData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const TodoForm = ({ todo, onSubmit, onCancel, loading = false }: TodoFormProps) => {
  const [formData, setFormData] = useState<CreateTodoData>({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || "",
        status: todo.status,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : "",
      });
    }
  }, [todo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter todo title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description (optional)"
          rows={3}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Input
        label="Due Date"
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="flex-1"
        >
          {loading ? "Saving..." : todo ? "Update Todo" : "Create Todo"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TodoForm; 