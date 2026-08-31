import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';
import Appointments from './pages/Appointments';
import Documents from './pages/Documents';
import Offices from './pages/Offices';
import Profile from './pages/Profile';
import Navbar from './components/common/Navbar';

// Protected route wrapper
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Layout wrapper that conditionally shows Navbar
function Layout({ children }) {
    const location = useLocation();
    const hideNavbar = ['/login', '/register', '/forgot-password'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50">
            {!hideNavbar && <Navbar />}
            <main className={hideNavbar ? "" : "container mx-auto px-4 py-8"}>
                {children}
            </main>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/queue" element={
                            <ProtectedRoute>
                                <Queue />
                            </ProtectedRoute>
                        } />
                        <Route path="/appointments" element={
                            <ProtectedRoute>
                                <Appointments />
                            </ProtectedRoute>
                        } />
                        <Route path="/documents" element={
                            <ProtectedRoute>
                                <Documents />
                            </ProtectedRoute>
                        } />
                        <Route path="/offices" element={
                            <ProtectedRoute>
                                <Offices />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Layout>
                <Toaster position="top-right" />
            </AuthProvider>
        </Router>
    );
}

export default App;