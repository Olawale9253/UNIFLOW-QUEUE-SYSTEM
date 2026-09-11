import React from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';

function GreetingHeader({ onToggleSidebar, sidebarLabel, workspace, subtitle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getFirstName = () => user?.fullName?.split(' ')[0] || 'there';
    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8 lg:rounded-bl-3xl">
            <div className="flex min-h-14 items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="shrink-0 rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                        aria-label={sidebarLabel}
                        title="Toggle navigation"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="min-w-0">
                        <p className="greeting-text truncate text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-xs dark:text-indigo-300">{workspace}</p>
                        <h1 className="greeting-text truncate text-lg font-bold text-slate-950 dark:text-white sm:text-xl">{getGreeting()}, {getFirstName()}</h1>
                        <p className="hidden truncate text-sm text-slate-600 dark:text-slate-300 sm:block">{subtitle}</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <NotificationBell />
                    <button
                        type="button"
                        onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/profile' : user?.role === 'STAFF' ? '/staff/profile' : '/profile')}
                        className="rounded-full transition hover:ring-2 hover:ring-blue-500/40"
                        aria-label="Open my profile"
                        title="My profile"
                    >
                        <UserAvatar user={user} size="sm" />
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        aria-label="Log out"
                        title="Log out"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3m8 8h7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default GreetingHeader;