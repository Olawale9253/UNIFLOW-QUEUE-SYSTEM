import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
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
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        </div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/dashboard" element={
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
            </ThemeProvider>
        </Router>
    );
}

export default App;