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
    setLoading(true);
    try {
      const userData = await login({ email, password });

      // Check role and redirect accordingly
      if (userData.role === 'ADMIN') {
        toast.success('Welcome Admin!');
        navigate('/admin');
      } else {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">UniFlow</h1>
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
                  className={`p-4 rounded-lg border-2 transition-all ${
                      userType === 'user'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
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
                  className={`p-4 rounded-lg border-2 transition-all ${
                      userType === 'admin'
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/30 dark:border-red-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500'
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
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
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
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="Enter your password"
                  required
              />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded-lg transition disabled:opacity-50 ${
                    userType === 'admin'
                        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                }`}
            >
              {loading ? 'Logging in...' : userType === 'admin' ? 'Login as Admin' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
  );
}

export default Login;