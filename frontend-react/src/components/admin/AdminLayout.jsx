import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useWebSocket } from '../../context/WebSocketContext';
import NotificationBell from '../common/NotificationBell';
import UserAvatar from '../common/UserAvatar';
import toast from 'react-hot-toast';

function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const { connected } = useWebSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
        setIsProfileDropdownOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    };

    const menuItems = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/users', label: 'Students' },
        { path: '/admin/offices', label: 'Office Management' },
        { path: '/admin/staff', label: 'Staff Management' },
        { path: '/admin/appointments', label: 'Appointment Management' },
        { path: '/admin/activities', label: 'Activity Log' },
        { path: '/admin/reports', label: 'Reports' },
        { path: '/admin/settings', label: 'Settings' },
    ];

    const getInitials = () => {
        if (user?.fullName) {
            const names = user.fullName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return user.fullName.charAt(0).toUpperCase();
        }
        return 'A';
    };

    // Get color for avatar based on role
    const getAvatarColor = () => {
        if (user?.role === 'ADMIN') return 'from-red-500 to-red-600';
        if (user?.role === 'STAFF') return 'from-blue-500 to-blue-600';
        return 'from-green-500 to-green-600';
    };

    if (!user || user.role !== 'ADMIN') {
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
        <div className="min-h-screen bg-gradient-primary">
            {/* Top Navbar */}
            <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
                <div className="px-4 sm:px-6 py-3">
                    <div className="flex justify-between items-center">
                        {/* Left side - Admin Panel Title */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                aria-label="Toggle admin navigation"
                            >
                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isSidebarOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-slate-900 dark:bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    A
                                </div>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
                            </div>
                        </div>

                        {/* Right side - Admin Profile */}
                        <div className="flex items-center space-x-4">
                            {/* Connection Status */}
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
                                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                <span className={`text-xs ${connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {connected ? 'Live' : 'Offline'}
                </span>
                            </div>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                aria-label="Toggle dark mode"
                                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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

                            {/* Notification Bell */}
                            <NotificationBell />

                            {/* Admin Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-3 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition"
                                    aria-label="Open profile menu"
                                >
                                    {/* Admin Avatar with Gradient */}
                                    <UserAvatar user={user} size="md" className={getAvatarColor()} />
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                        {/* Profile Header */}
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-3">
                                                <UserAvatar user={user} size="lg" className={getAvatarColor()} />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                                        {user?.role || 'ADMIN'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to="/admin/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/settings"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link>
                                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                        >
                                            <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative flex">
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block absolute lg:fixed lg:inset-y-0 lg:top-[73px] lg:bottom-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen lg:min-h-0 overflow-y-auto shadow-lg lg:shadow-none`}>
                    <div className="p-4">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`block px-4 py-2.5 rounded-lg transition ${isActive(item.path)}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                                <div className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;