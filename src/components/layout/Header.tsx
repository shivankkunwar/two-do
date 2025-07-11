import { Plus, LogOut, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.tsx";
import { useDarkMode } from "../../hooks/useDarkMode.tsx";

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
    <header className="shadow-sm sticky top-0 z-50" 
            style={{ backgroundColor: isDarkMode ? '#090C16' : '#3D9999' }}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-lg"
                 style={{ backgroundColor: isDarkMode ? '#FFD289' : '#B2F3DF' }}>
              <span className="text-xl font-bold" style={{ color: '#090C16' }}>✓</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold" style={{ color: isDarkMode ? 'white' : 'white' }}>TwoDo</h1>
              <p className="text-xs" style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)' }}>Stay organized!</p>
            </div>
          </div>

          {/* Mobile User Info */}
          {user && (
            <div className="sm:hidden flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: isDarkMode ? '#FFD289' : '#B2F3DF' }}>
                <User className="w-3 h-3" style={{ color: '#090C16' }} />
              </div>
              <span className="max-w-20 truncate" style={{ color: isDarkMode ? 'white' : 'white' }}>{user.userName}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop User Info */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm mr-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ backgroundColor: isDarkMode ? '#FFD289' : '#B2F3DF' }}>
                  <User className="w-4 h-4" style={{ color: '#090C16' }} />
                </div>
                <span style={{ color: isDarkMode ? 'white' : 'white' }}>Hi, {user.userName}!</span>
              </div>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:scale-110 transition-all duration-200"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: isDarkMode ? '#FFD289' : 'white'
              }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Add Todo Button - More prominent */}
            <button
              onClick={onAddTodo}
              className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 font-semibold"
              style={{ 
                backgroundColor: '#FFD289',
                color: '#090C16'
              }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Todo</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:scale-110 transition-all duration-200"
              style={{ 
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                color: isDarkMode ? '#ff6b6b' : '#ff4444'
              }}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 