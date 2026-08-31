import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';

function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const { adminSidebarOpen, toggleAdminSidebar } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    };

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/users', icon: '👥', label: 'Users' },
        { path: '/admin/offices', icon: '🏢', label: 'Offices' },
        { path: '/admin/staff', icon: '👨‍💼', label: 'Staff' },
        { path: '/admin/appointments', icon: '📅', label: 'Appointments' },
        { path: '/admin/reports', icon: '📈', label: 'Reports' },
        { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
    ];

    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">You don't have permission to access this page.</p>
                    <Link to="/dashboard" className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Admin Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleAdminSidebar}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>
                            <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                View Site
                            </Link>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <button onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <div className={`${adminSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-md min-h-[calc(100vh-64px)] transition-all duration-300 overflow-hidden`}>
                    <div className="p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive(item.path)}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {adminSidebarOpen && <span>{item.label}</span>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;