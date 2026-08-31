import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Hide navbar on landing page, login, register, and forgot password pages
  const hideNavbar = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);

  if (hideNavbar) {
    return null;
  }

  // Get initials for avatar
  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
      <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              UniFlow
            </Link>

            {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
                  <Link to="/queue" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Queue</Link>
                  <Link to="/appointments" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Appointments</Link>
                  <Link to="/documents" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Documents</Link>
                  <Link to="/offices" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Offices</Link>

                  {/* Dark Mode Toggle */}
                  <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                  </button>

                  <Link to="/profile" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials()}
                    </div>
                  </Link>
                  <button
                      onClick={handleLogout}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Logout
                  </button>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Register
                  </Link>
                </div>
            )}
          </div>
        </div>
      </nav>
  );
}

export default Navbar;