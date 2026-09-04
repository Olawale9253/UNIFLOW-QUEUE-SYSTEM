import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { WebSocketProvider } from './context/WebSocketContext';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import StaffRoute from './components/common/StaffRoute';

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
import Settings from './pages/Settings';
import Navbar from './components/common/Navbar';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOffices from './pages/admin/AdminOffices';
import AdminStaff from './pages/admin/AdminStaff';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminActivityLog from './pages/admin/AdminActivityLog';
import AdminProfile from './pages/admin/AdminProfile';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffQueue from './pages/staff/StaffQueue';

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <AdminProvider>
                        <WebSocketProvider>
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

                                        {/* Admin Routes */}
                                        <Route path="/admin" element={
                                            <AdminRoute>
                                                <AdminDashboard />
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
                                        <Route path="/admin/staff" element={
                                            <AdminRoute>
                                                <AdminStaff />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/appointments" element={
                                            <AdminRoute>
                                                <AdminAppointments />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/activities" element={
                                            <AdminRoute>
                                                <AdminActivityLog />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/reports" element={
                                            <AdminRoute>
                                                <AdminReports />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/settings" element={
                                            <AdminRoute>
                                                <AdminSettings />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/profile" element={
                                            <AdminRoute>
                                                <AdminProfile />
                                            </AdminRoute>
                                        } />

                                        {/* Staff Routes */}
                                        <Route path="/staff" element={
                                            <StaffRoute>
                                                <StaffDashboard />
                                            </StaffRoute>
                                        } />
                                        <Route path="/staff/queue" element={
                                            <StaffRoute>
                                                <StaffQueue />
                                            </StaffRoute>
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
                                        <Route path="/settings" element={
                                            <ProtectedRoute>
                                                <Settings />
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
                                        className: '!rounded-xl !shadow-medium',
                                        style: {
                                            background: '#363636',
                                            color: '#fff',
                                            padding: '16px',
                                        },
                                        success: {
                                            duration: 3000,
                                            iconTheme: {
                                                primary: '#22c55e',
                                                secondary: '#fff',
                                            },
                                        },
                                        error: {
                                            duration: 4000,
                                            iconTheme: {
                                                primary: '#ef4444',
                                                secondary: '#fff',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </WebSocketProvider>
                    </AdminProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;