import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth.tsx";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", formData);
      // Store token and user data
      localStorage.setItem("token", data.token);
      setUser(data.user);
      // Registration successful - redirect to dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#278D8D' }}>
      <div className="w-full max-w-md animate-slide-in">
        {/* iOS-style card */}
        <div className="rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-white/10" style={{ backgroundColor: '#EEC7AD' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#278D8D' }}>
              <span className="text-3xl text-white font-bold">✓</span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#090C16' }}>Create Account</h1>
            <p className="opacity-70" style={{ color: '#090C16' }}>Join us to start organizing</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium" style={{ color: '#090C16' }}>
                Username
              </label>
              <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Choose a username"
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
                Email
              </label>
              <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
                placeholder="Create a password (min 6 chars)"
              required
              minLength={6}
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm opacity-70" style={{ color: '#090C16' }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: '#278D8D' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
