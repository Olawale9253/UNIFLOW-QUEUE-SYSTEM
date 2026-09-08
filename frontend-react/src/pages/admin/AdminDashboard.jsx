import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useBranding } from '../../context/BrandingContext';
import ErrorState from '../../components/common/ErrorState';

function AdminDashboard() {
    const { user } = useAuth();
    const { branding } = useBranding();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAppointments: 0,
        totalQueueTickets: 0,
        totalDocuments: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        totalOffices: 0,
        totalStaff: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPolling, setIsPolling] = useState(false);
    const [error, setError] = useState('');
    const prevActivitiesRef = useRef([]);

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins} mins ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays < 7) return `${diffDays} days ago`;
            return date.toLocaleDateString();
        } catch (e) {
            return 'Just now';
        }
    };

    const getActivityIcon = (type) => {
        switch(type) {
            case 'appointment': return '📅';
            case 'queue': return '🎫';
            case 'document': return '📄';
            case 'user': return '👤';
            case 'admin': return '⚙️';
            default: return '📌';
        }
    };

    const getActivityColor = (type) => {
        switch(type) {
            case 'appointment': return 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400';
            case 'queue': return 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400';
            case 'document': return 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400';
            case 'user': return 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400';
            case 'admin': return 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
        }
    };

    const fetchDashboardData = useCallback(async (isInitial = false) => {
        setError('');
        try {
            // Only show loading on initial load
            if (isInitial) {
                setLoading(true);
            }

            // Set polling flag
            if (!isInitial) {
                setIsPolling(true);
            }

            console.log('🔄 Fetching dashboard data...');

            const [statsRes, activitiesRes] = await Promise.all([
                api.get('/admin/dashboard/stats'),
                api.get('/activities/recent')
            ]);

            console.log('📊 Activities response:', activitiesRes.data);
            const newStats = {
                totalStudents: statsRes.data.totalStudents || 0,
                totalAppointments: statsRes.data.totalAppointments || 0,
                totalQueueTickets: statsRes.data.totalQueueTickets || 0,
                totalDocuments: statsRes.data.totalDocumentRequests || 0,
                todayAppointments: statsRes.data.todayAppointments || 0,
                pendingAppointments: statsRes.data.pendingAppointments || 0,
                completedAppointments: statsRes.data.completedAppointments || 0,
                totalOffices: statsRes.data.totalOffices || 0,
                totalStaff: statsRes.data.totalStaff || 0
            };

            // Only update stats if they changed (to prevent re-renders)
            setStats(prevStats => {
                const hasChanged = JSON.stringify(prevStats) !== JSON.stringify(newStats);
                return hasChanged ? newStats : prevStats;
            });

            // Process activities - only update if new activities arrived
            const activities = activitiesRes.data || [];
            console.log('📋 Activities count:', activities.length);

            if (activities && activities.length > 0) {
                const formattedActivities = activities.map(activity => ({
                    id: activity.id || Math.random(),
                    user: activity.username || 'Unknown User',
                    action: activity.action || 'Performed an action',
                    time: formatTime(activity.timestamp),
                    type: activity.type || 'general',
                    timestamp: activity.timestamp
                }));

                // Check if new activities arrived (compare with previous)
                const prevIds = prevActivitiesRef.current.map(a => a.id);
                const newIds = formattedActivities.map(a => a.id);
                const hasNewActivities = newIds.some(id => !prevIds.includes(id));

                if (hasNewActivities || prevActivitiesRef.current.length === 0) {
                    setRecentActivities(formattedActivities);
                    prevActivitiesRef.current = formattedActivities;
                    console.log('✅ New activities detected, updating UI');

                    // Show toast for new activities
                    const newCount = newIds.filter(id => !prevIds.includes(id)).length;
                    if (newCount > 0 && !isInitial) {
                        toast.success(`📢 ${newCount} new ${newCount === 1 ? 'activity' : 'activities'}!`);
                    }
                } else {
                    console.log('ℹ️ No new activities');
                }
            } else {
                setRecentActivities([]);
                prevActivitiesRef.current = [];
            }

        } catch (error) {
            console.error('❌ Error fetching dashboard data:', error);
            setError(error.response?.data?.message || 'We could not load the dashboard right now.');
            if (isInitial) {
                toast.error('Failed to load dashboard data');
            }
        } finally {
            if (isInitial) {
                setLoading(false);
            }
            setIsPolling(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchDashboardData(true);
    }, []);

    // Poll for updates every 5 seconds (without flickering)
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPolling) {
                fetchDashboardData(false);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [fetchDashboardData, isPolling]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {error && <ErrorState title="Dashboard data is unavailable" message={error} onRetry={() => fetchDashboardData(true)} />}
            {/* Stats Cards - No flickering */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card card-hover p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card card-hover p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Appointments</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalAppointments}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card card-hover p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Queue Tickets</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalQueueTickets}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="card card-hover p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Offices</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalOffices}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Admin actions</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Keep today&apos;s requests and appointments moving.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link to="/admin/registration-requests" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Review new user requests</Link>
                    <Link to="/admin/appointments" className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-blue-900/40">Manage appointments</Link>
                </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="card card-hover p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Today's Appointments</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.todayAppointments}</p>
                </div>
                <div className="card card-hover p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Appointments</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingAppointments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Appointments</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedAppointments}</p>
                </div>
            </div>

            {/* Recent Activity - No flickering */}
            <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1.5">
                            <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">|</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">{recentActivities.length} activities</span>
                        <Link to="/admin/activities" className="text-sm text-blue-600 dark:text-blue-400 no-underline">
                            View All →
                        </Link>
                    </div>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentActivities && recentActivities.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No recent activities</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Activities will appear here when users perform actions</p>
                        </div>
                    ) : (
                        recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 px-2 rounded-lg transition">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActivityColor(activity.type)}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;