import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const userData = await authService.login(credentials);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (updates) => {
        setUser(previous => {
            const nextUser = { ...previous, ...updates };
            localStorage.setItem('user', JSON.stringify(nextUser));
            return nextUser;
        });
    };

    const register = async (userData) => {
        const response = await authService.register(userData);
        return response;
    };

    return (
            <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}