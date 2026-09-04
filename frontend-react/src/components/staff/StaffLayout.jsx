import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import UserAvatar from '../common/UserAvatar';

function StaffLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    };

    const menuItems = [
        { path: '/staff', icon: '📊', label: 'Dashboard' },
        { path: '/staff/queue', icon: '🎫', label: 'Queue Management' },
        { path: '/staff/appointments', icon: '📅', label: 'Appointments' },
        { path: '/staff/documents', icon: '📄', label: 'Documents' },
    ];

    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">You don't have permission to access this page.</p>
                    <Link to="/dashboard" className="mt-4 inline-block text-blue-600 dark:text-blue-400 no-underline">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
                <div className="w-64 bg-white dark:bg-gray-800 shadow-md min-h-screen sticky top-0">
                    <div className="p-4">
                        <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                S
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Staff Panel</span>
                        </div>
                        <div className="space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive(item.path)}`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-3 px-4 py-3">
                                <UserAvatar user={user} size="sm" className="bg-green-500" fallback="S" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.fullName || 'Staff'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                <span className="mr-2">🚪</span> Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default StaffLayout;