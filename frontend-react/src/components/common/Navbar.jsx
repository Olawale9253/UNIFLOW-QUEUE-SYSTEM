import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  if (hideNavbar) {
    return null;
  }

  return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UniFlow
            </Link>

            {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/queue" className="text-gray-700 hover:text-blue-600">Queue</Link>
                  <Link to="/appointments" className="text-gray-700 hover:text-blue-600">Appointments</Link>
                  <Link to="/documents" className="text-gray-700 hover:text-blue-600">Documents</Link>
                  <Link to="/offices" className="text-gray-700 hover:text-blue-600">Offices</Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600">
                    {user.fullName || 'Profile'}
                  </Link>
                  <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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