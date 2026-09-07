import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminProvider } from './context/AdminContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { BrandingProvider } from './context/BrandingContext';
import AdminBranding from './components/admin/AdminBranding';

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
import History from './pages/History';
import Offices from './pages/OfficesPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserLayout from './components/common/UserLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRegistrationRequests from './pages/admin/AdminRegistrationRequests';
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
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffDocuments from './pages/staff/StaffDocuments';
import StaffProfile from './pages/staff/StaffProfile';
import StaffSettings from './pages/staff/StaffSettings';
import StaffActivityLog from './pages/staff/StaffActivityLog';

function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <AdminProvider>
                        <WebSocketProvider>
                            <BrandingProvider>
                                <div className="min-h-screen transition-colors duration-300">
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
                                                                                <Route path="/admin/branding" element={
                                                                                        <AdminRoute>
                                                                                                <AdminBranding />
                                                                                        </AdminRoute>
                                                                                } />
                                        <Route path="/admin/users" element={
                                            <AdminRoute>
                                                <AdminUsers />
                                            </AdminRoute>
                                        } />
                                        <Route path="/admin/registration-requests" element={
                                            <AdminRoute>
                                                <AdminRegistrationRequests />
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
                                        <Route path="/staff/appointments" element={
                                            <StaffRoute>
                                                <StaffAppointments />
                                            </StaffRoute>
                                        } />
                                        <Route path="/staff/documents" element={
                                            <StaffRoute>
                                                <StaffDocuments />
                                            </StaffRoute>
                                        } />
                                        <Route path="/staff/activity" element={<StaffRoute><StaffActivityLog /></StaffRoute>} />
                                        <Route path="/staff/profile" element={<StaffRoute><StaffProfile /></StaffRoute>} />
                                        <Route path="/staff/settings" element={<StaffRoute><StaffSettings /></StaffRoute>} />

                                        {/* User Routes */}
                                        <Route path="/dashboard" element={
                                            <ProtectedRoute>
                                                <UserLayout><Dashboard /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/queue" element={
                                            <ProtectedRoute>
                                                <UserLayout><Queue /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/appointments" element={
                                            <ProtectedRoute>
                                                <UserLayout><Appointments /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/documents" element={
                                            <ProtectedRoute>
                                                <UserLayout><Documents /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/history" element={
                                            <ProtectedRoute>
                                                <UserLayout><History /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/offices" element={
                                            <ProtectedRoute>
                                                <UserLayout><Offices /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/profile" element={
                                            <ProtectedRoute>
                                                <UserLayout><Profile /></UserLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/settings" element={
                                            <ProtectedRoute>
                                                <UserLayout><Settings /></UserLayout>
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
                            </BrandingProvider>
                        </WebSocketProvider>
                    </AdminProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;