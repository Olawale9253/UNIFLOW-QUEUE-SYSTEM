import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function UserLayout({ children, showSidebar = true }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/queue', label: 'Queue' },
        { path: '/appointments', label: 'Appointments' },
        { path: '/documents', label: 'Documents' },
        { path: '/offices', label: 'Offices' },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path
        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

    if (!showSidebar) {
        return children;
    }

    return (
        <div className="min-h-screen pt-16">
            <aside className="relative lg:fixed lg:inset-y-0 lg:top-16 lg:bottom-0 z-30 w-full lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md lg:shadow-none overflow-y-auto">
                <div className="p-4">
                    <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            U
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Student Panel</span>
                    </div>

                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`block px-4 py-2.5 rounded-lg transition ${isActive(item.path)}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            to="/profile"
                            className={`block px-4 py-2.5 rounded-lg transition ${isActive('/profile')}`}
                        >
                            My Profile
                        </Link>
                        <Link
                            to="/settings"
                            className={`block px-4 py-2.5 rounded-lg transition ${isActive('/settings')}`}
                        >
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 mt-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || 'Student'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || ''}</p>
                    </div>
                </div>
            </aside>

            <div className="min-w-0 lg:ml-64 px-4 py-6 sm:px-6 lg:px-10">
                {children}
            </div>
        </div>
    );
}

export default UserLayout;
