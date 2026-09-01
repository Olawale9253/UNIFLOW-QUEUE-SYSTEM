import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function RoleRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }


    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user's role is not in the allowed roles list
    if (!allowedRoles.includes(user.role)) {
        // Redirect admin to admin dashboard, others to user dashboard
        if (user.role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // If user has the required role, render the children
    return children;
}

export default RoleRoute;