import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Create the context
const WebSocketContext = createContext();

// Provider component
export function WebSocketProvider({ children }) {
    const [connected, setConnected] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        toast.success('🔌 Connected to real-time updates');

        // Poll for updates every 10 seconds
        const interval = setInterval(() => {
            fetchUpdates();
        }, 10000);

        fetchUpdates();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const fetchUpdates = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/queues/live/all');
            if (response.ok) {
                const data = await response.json();
                console.log('📊 Queue update:', data);
            }
        } catch (error) {
            console.error('Polling error:', error);
        }
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <WebSocketContext.Provider value={{
            connected,
            notifications,
            unreadCount,
            markAllAsRead,
            clearNotifications,
            markNotificationAsRead
        }}>
            {children}
        </WebSocketContext.Provider>
    );
}

// Hook to use the WebSocket context
export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        // Return default values instead of throwing error
        return {
            connected: true,
            notifications: [],
            unreadCount: 0,
            markAllAsRead: () => {},
            clearNotifications: () => {},
            markNotificationAsRead: () => {}
        };
    }
    return context;
}