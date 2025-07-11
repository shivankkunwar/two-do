import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#278D8D' }}>
      <div className="w-full max-w-md animate-slide-in">
        {/* iOS-style card */}
        <div className="rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-white/10" style={{ backgroundColor: '#B2F3DF' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#278D8D' }}>
              <span className="text-3xl text-white font-bold">✓</span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#090C16' }}>Welcome Back!</h1>
            <p className="opacity-70" style={{ color: '#090C16' }}>Sign in to manage your todos</p>
          </div>

          {/* Success message from registration */}
          {message && (
            <div className="mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(39, 141, 141, 0.2)' }}>
              <p className="text-sm font-medium text-center" style={{ color: '#090C16' }}>{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#090C16' }}>
                Email
              </label>
              <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
                className="w-full px-4 py-3 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'rgba(9, 12, 22, 0.1)',
                  color: '#090C16'
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#090C16' }}>
                Password
              </label>
              <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
                className="w-full px-4 py-3 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderColor: 'rgba(9, 12, 22, 0.1)',
                  color: '#090C16'
                }}
            />
            </div>

            {error && (
              <div className="p-4 text-sm rounded-2xl border" style={{ 
                color: '#8B0000',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderColor: 'rgba(255, 0, 0, 0.2)'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#278D8D',
                color: 'white'
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm opacity-70" style={{ color: '#090C16' }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: '#278D8D' }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
