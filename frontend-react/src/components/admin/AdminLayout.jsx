import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SchoolBranding from '../common/SchoolBranding';
import GreetingHeader from '../common/GreetingHeader';

function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


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
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/users', label: 'Students', icon: 'students' },
        { path: '/admin/offices', label: 'Offices', icon: 'offices' },
        { path: '/admin/staff', label: 'Staff', icon: 'staff' },
        { path: '/admin/appointments', label: 'Appointments', icon: 'appointments' },
        { path: '/admin/activities', label: 'Activity Log', icon: 'activity' },
        { path: '/admin/reports', label: 'Reports', icon: 'reports' },
        { path: '/admin/branding', label: 'Branding', icon: 'branding' },
        { path: '/admin/settings', label: 'Settings', icon: 'settings' },
    ];

    const renderMenuIcon = (icon) => {
        const icons = {
            dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
            students: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M16 14a5 5 0 0 1 5 5" /></>,
            offices: <><path d="M3 21h18M5 21V5l7-3 7 3v16M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h6" /></>,
            staff: <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0M19 5l1 1 2-2" /></>,
            appointments: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
            activity: <><path d="M4 12h3l2-7 4 14 2-7h5" /></>,
            reports: <><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6" /></>,
            branding: <><path d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z" /><path d="m9 12 2 2 4-4" /></>,
            settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.39 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 11c.23.62.82 1.03 1.48 1.03H21v2h-.12A1.7 1.7 0 0 0 19.4 15Z" /></>,
        };
        return <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">{icons[icon]}</svg>;
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex min-h-screen">
                <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : ''}`}>
                    <div className="flex min-h-0 flex-1 flex-col p-4">
                        <div className="mb-4 flex justify-end lg:hidden">
                            <button onClick={() => setIsSidebarOpen(false)} className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" aria-label="Hide admin navigation" title="Hide navigation">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" /></svg>
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
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-6 shrink-0 border-t border-gray-200 pt-4 dark:border-gray-700">
                            <div className="mb-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-700/50">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'Admin'}</p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email || ''}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
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
                        sidebarLabel="Toggle admin navigation"
                        workspace="Admin workspace"
                        subtitle="A live view of your university workspace"
                    />
                    <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;