import { Plus, LogOut, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useDarkMode } from "../../hooks/useDarkMode.tsx";
import Button from "../ui/Button";

interface HeaderProps {
  onAddTodo: () => void;
}

const Header = ({ onAddTodo }: HeaderProps) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TwoDo</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stay organized!</p>
            </div>
          </div>

          {/* Mobile User Info */}
          {user && (
            <div className="sm:hidden flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-6 h-6 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="max-w-20 truncate">{user.userName}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop User Info */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mr-2">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <span>Hi, {user.userName}!</span>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Add Todo Button */}
            <Button
              onClick={onAddTodo}
              size="sm"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Add Todo</span>
              <span className="sm:hidden">Add</span>
            </Button>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 