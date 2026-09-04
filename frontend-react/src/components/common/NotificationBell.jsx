import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../../context/WebSocketContext';

// ... rest of the file remains the same
function NotificationBell() {
    const { notifications, unreadCount, markAllAsRead, markNotificationAsRead, clearNotifications } = useWebSocket();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch(type) {
            case 'appointment': return '📅';
            case 'queue': return '🎫';
            case 'document': return '📄';
            case 'system': return '⚙️';
            case 'success': return '✅';
            case 'error': return '❌';
            default: return '📨';
        }
    };

    const getNotificationColor = (type) => {
        switch(type) {
            case 'appointment': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'queue': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'document': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
            case 'system': return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700';
            case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default: return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700';
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1.5 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <div className="flex space-x-2">
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 dark:text-blue-400 no-underline"
                                >
                                    Mark all read
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearNotifications}
                                    className="text-xs text-red-600 dark:text-red-400 no-underline"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-80">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="text-4xl block mb-2">🔔</span>
                                <p className="text-gray-500 dark:text-gray-400">No notifications</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className={`p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${getNotificationColor(notification.type)}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {notification.message}
                                            </p>
                                            {notification.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.description}</p>
                                            )}
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {formatTime(notification.timestamp)}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;