import React, { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [adminSidebarOpen, setAdminSidebarOpen] = useState(true);

    const toggleAdminSidebar = () => {
        setAdminSidebarOpen(!adminSidebarOpen);
    };

    return (
        <AdminContext.Provider value={{ adminSidebarOpen, toggleAdminSidebar }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}