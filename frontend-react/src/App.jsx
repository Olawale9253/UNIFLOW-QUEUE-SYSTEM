import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminStaff from './pages/admin/AdminStaff';

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

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOffices from './pages/admin/AdminOffices';

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <AdminProvider>
                        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                            <Navbar />
                            <main>
                                <Routes>
                                    {/* Public Routes */}
                                    <Route path="/" element={<LandingPage />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/forgot-password" element={<ForgotPassword />} />
                                    <Route path="/reset-password" element={<ResetPassword />} />

                                    {/* Admin Routes - These have their own layout */}
                                    <Route path="/admin" element={
                                        <AdminRoute>
                                            <AdminDashboard />
                                        </AdminRoute>
                                    } />

                                    <Route path="/admin/staff" element={
                                        <AdminRoute>
                                            <AdminStaff />
                                        </AdminRoute>
                                    } />
                                    <Route path="/admin/users" element={
                                        <AdminRoute>
                                            <AdminUsers />
                                        </AdminRoute>
                                    } />
                                    <Route path="/admin/offices" element={
                                        <AdminRoute>
                                            <AdminOffices />
                                        </AdminRoute>
                                    } />

                                    {/* User Routes */}
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

                                    {/* Catch all */}
                                    <Route path="*" element={<Navigate to="/" replace />} />
                                </Routes>
                            </main>
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: '#363636',
                                        color: '#fff',
                                    },
                                }}
                            />
                        </div>
                    </AdminProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;