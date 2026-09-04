import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';

const WebSocketContext = createContext();

export function WebSocketProvider({ children }) {
    const [connected, setConnected] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications();
        }, 10000);

        fetchNotifications();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const fetchNotifications = async () => {
        if (!localStorage.getItem('token')) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        try {
            const response = await api.get('/notifications');
            const data = response.data || [];
            setNotifications(data.map(notification => ({
                ...notification,
                timestamp: notification.createdAt
            })));
            setUnreadCount(data.filter(notification => !notification.read).length);
        } catch (error) {
            console.error('Notification polling error:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const markNotificationAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
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