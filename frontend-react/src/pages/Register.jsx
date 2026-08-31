import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Register() {
  const [formData, setFormData] = useState({
    matriculationNumber: '',
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
            <p className="text-gray-600 dark:text-gray-400 mt-2">Create your account</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              All new accounts are created as Students. Admins can assign admin/staff roles.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Matriculation Number</label>
              <input
                  type="text"
                  name="matriculationNumber"
                  value={formData.matriculationNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="e.g., UNI/2026/001"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Full Name</label>
              <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="John Doe"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="john@example.com"
                  required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Phone</label>
              <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="08012345678"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Password</label>
              <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                  placeholder="Minimum 6 characters"
                  required
              />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
          </p>
        </div>
      </div>
  );
}

export default Register;