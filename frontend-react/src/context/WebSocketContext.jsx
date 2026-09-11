import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocketService';

// Create the context
const WebSocketContext = createContext();

// Provider component
export function WebSocketProvider({ children }) {
    const { user } = useAuth();
    const [connected, setConnected] = useState(false);
    const [queueEvents, setQueueEvents] = useState([]);
    const [queueUpdateVersion, setQueueUpdateVersion] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            websocketService.disconnect();
            setConnected(false);
            setNotifications([]);
            setUnreadCount(0);
            setQueueEvents([]);
            return undefined;
        }

        websocketService.connect(localStorage.getItem('token'));
        const removeConnectListener = websocketService.on('connect', () => setConnected(true));
        const removeDisconnectListener = websocketService.on('disconnect', () => setConnected(false));
        const removeQueueListener = websocketService.on('queue-update', (event) => {
            setQueueEvents(previous => [event, ...previous].slice(0, 50));
            setQueueUpdateVersion(previous => previous + 1);
        });

        const interval = setInterval(() => {
            fetchUpdates();
        }, 3000);

        fetchUpdates();

        return () => {
            clearInterval(interval);
            removeConnectListener();
            removeDisconnectListener();
            removeQueueListener();
            websocketService.disconnect();
        };
    }, [user]);

    const fetchUpdates = async () => {
        try {
            const response = await api.get('/notifications');
            const nextNotifications = (response.data || []).map(notification => ({
                ...notification,
                timestamp: notification.createdAt
            }));
            setNotifications(nextNotifications);
            setUnreadCount(nextNotifications.filter(notification => !notification.read).length);
        } catch (error) {
            console.error('Notification polling error:', error);
        }
    };

    const markAllAsRead = () => {
        api.put('/notifications/read-all').catch(() => {});
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const markNotificationAsRead = (id) => {
        api.put(`/notifications/${id}/read`).catch(() => {});
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <WebSocketContext.Provider value={{
            connected,
            queueEvents,
            queueUpdateVersion,
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