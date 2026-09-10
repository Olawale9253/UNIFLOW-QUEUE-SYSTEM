import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SchoolBranding from './SchoolBranding';
import GreetingHeader from './GreetingHeader';

function UserLayout({ children, showSidebar = true }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { path: '/dashboard', label: 'Home' },
        { path: '/queue', label: 'My Queue Tickets' },
        { path: '/appointments', label: 'My Appointments' },
        { path: '/documents', label: 'My Documents' },
        { path: '/history', label: 'History' },
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

    const closeSidebarOnMobile = () => {
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const renderMenuIcon = (path) => {
        const icons = {
            '/dashboard': <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />,
            '/queue': <><path d="M4 6h16M4 12h16M4 18h10" /><path d="M18 16v4m-2-2h4" /></>,
            '/appointments': <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
            '/documents': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
            '/history': <><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5M12 7v5l3 2" /></>,
            '/offices': <><path d="M3 21h18M5 21V5l7-3 7 3v16M9 21v-5h6v5M9 8h.01M15 8h.01M9 11h.01M15 11h.01" /></>,
            '/profile': <><circle cx="12" cy="8" r="3" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
            '/settings': <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.42 1.42-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.08a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.42-1.42.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.42-1.42.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.39 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.54 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.42 1.42-.06.06A1.7 1.7 0 0 0 19.4 11c.23.62.82 1.03 1.48 1.03H21v2h-.12A1.7 1.7 0 0 0 19.4 15Z" /></>,
        };

        return (
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                {icons[path]}
            </svg>
        );
    };

    if (!showSidebar) {
        return children;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {isSidebarOpen && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close student navigation" />}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : ''}`}>
                <div className="flex min-h-0 flex-1 flex-col p-4">
                    <div className="mb-4 flex justify-end lg:hidden">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 lg:hidden"
                            aria-label="Hide student navigation"
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

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeSidebarOnMobile}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${isActive(item.path)}`}
                                >
                                    {renderMenuIcon(item.path)}
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                        <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                        <Link
                            to="/profile"
                            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${isActive('/profile')}`}
                        >
                            {renderMenuIcon('/profile')}
                            My Profile
                        </Link>
                        <Link
                            to="/settings"
                            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${isActive('/settings')}`}
                        >
                            {renderMenuIcon('/settings')}
                            Settings
                        </Link>
                        <div className="my-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'Student'}</p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email || 'No email available'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-600 transition hover:bg-white dark:text-red-400 dark:hover:bg-gray-700"
                            aria-label="Log out"
                        >
                            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3m8 8h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-7" />
                            </svg>
                            Logout
                        </button>
                    </div>

                </div>
            </aside>

            <div className={`min-w-0 transition-[margin] duration-300 ease-out ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                <GreetingHeader
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    sidebarLabel="Toggle student navigation"
                    workspace="Student workspace"
                    subtitle="Everything you need for today"
                />
                <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default UserLayout;
