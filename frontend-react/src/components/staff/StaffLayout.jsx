import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SchoolBranding from '../common/SchoolBranding';
import GreetingHeader from '../common/GreetingHeader';

function StaffLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const toggleSidebar = () => setIsSidebarOpen((open) => !open);
        window.addEventListener('toggle-app-sidebar', toggleSidebar);
        return () => window.removeEventListener('toggle-app-sidebar', toggleSidebar);
    }, []);

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
        { path: '/staff', icon: 'dashboard', label: 'Dashboard' },
        { path: '/staff/queue', icon: 'queue', label: 'Queue Management' },
        { path: '/staff/appointments', icon: 'calendar', label: 'Appointments' },
        { path: '/staff/documents', icon: 'document', label: 'Documents' },
        { path: '/staff/profile', icon: 'profile', label: 'My Profile' },
    ];

    const renderMenuIcon = (icon) => {
        const paths = {
            dashboard: <><path d="M4 13h6V4H4v9Z" /><path d="M14 20h6v-7h-6v7Z" /><path d="M14 10h6V4h-6v6Z" /><path d="M4 20h6v-3H4v3Z" /></>,
            queue: <><path d="M4 6h16M4 12h16M4 18h10" /><path d="M18 16v4m-2-2h4" /></>,
            calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
            document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
            profile: <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
        };

        return (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                {paths[icon]}
            </svg>
        );
    };

    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-primary px-4 py-8">
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex min-h-screen">
                <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : ''}`}>
                    <div className="flex min-h-0 flex-1 flex-col p-4">
                        <div className="mb-4 flex justify-end lg:hidden">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                aria-label="Hide staff navigation"
                                title="Hide navigation"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
                                </svg>
                            </button>
                        </div>
                        <div className="mb-6 border-b border-gray-200 pb-6 dark:border-slate-800">
                            <SchoolBranding showName={true} showLogo={true} layout="stacked" />
                        </div>
                        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${isActive(item.path)}`}
                                >
                                    {renderMenuIcon(item.icon)}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-6 shrink-0 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'Staff'}</p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                            >
                                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3m8 8h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-7" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </aside>

                <div className={`min-w-0 flex-1 transition-[margin] duration-300 ease-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                    <GreetingHeader
                        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        sidebarLabel="Toggle staff navigation"
                        workspace="Staff workspace"
                        subtitle="A live view of today's office operations"
                    />
                    <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default StaffLayout;