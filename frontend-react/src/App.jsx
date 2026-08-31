import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
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
                    </main>
                    <Toaster position="top-right" />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;