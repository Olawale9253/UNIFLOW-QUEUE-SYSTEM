import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const userData = await login({ email, password });

      if (userData.role === 'ADMIN') {
        toast.success('Welcome Admin!');
        navigate('/admin');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-colors duration-300 border border-white/20 dark:border-gray-700/50">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">UniFlow</h1>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
              I am logging in as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                      userType === 'user'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">👤</span>
                  <span className={`font-medium ${
                      userType === 'user'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                  }`}>
                  Student / User
                </span>
                </div>
              </button>
              <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                      userType === 'admin'
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-400 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 hover:shadow-md'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl mb-2">🔑</span>
                  <span className={`font-medium ${
                      userType === 'admin'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                  }`}>
                  Admin / Staff
                </span>
                </div>
              </button>
            </div>
            {userType === 'admin' && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                  ⚠️ Only users with admin/staff privileges can access the admin panel
                </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email Address</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white transition"
                  placeholder="Enter your email"
                  required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white transition"
                  placeholder="Enter your password"
                  required
              />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 text-lg ${
                    userType === 'admin'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200`}
            >
              {loading ? 'Logging in...' : userType === 'admin' ? 'Login as Admin' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Create one now
            </Link>
          </p>
        </div>
      </div>
  );
}

export default Login;