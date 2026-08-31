import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

function AdminDashboard() {
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

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all users (students)
            const usersRes = await api.get('/users');
            const students = usersRes.data.filter(u => u.role === 'STUDENT');

            // Fetch appointments
            const appointmentsRes = await api.get('/appointments/my-appointments');
            const appointments = appointmentsRes.data || [];

            // Fetch offices
            const officesRes = await api.get('/offices');
            const offices = officesRes.data || [];

            // Fetch queue tickets
            const ticketsRes = await api.get('/queues/my-tickets');
            const tickets = ticketsRes.data || [];

            // Fetch documents
            const documentsRes = await api.get('/documents/my-requests');
            const documents = documentsRes.data || [];

            // Calculate stats
            const today = new Date().toDateString();
            const todayAppointments = appointments.filter(a =>
                new Date(a.appointmentTime).toDateString() === today
            );

            const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
            const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');

            setStats({
                totalStudents: students.length,
                totalAppointments: appointments.length,
                totalQueueTickets: tickets.length,
                totalDocuments: documents.length,
                todayAppointments: todayAppointments.length,
                pendingAppointments: pendingAppointments.length,
                completedAppointments: completedAppointments.length,
                totalOffices: offices.length,
                totalStaff: usersRes.data.filter(u => u.role === 'STAFF').length
            });

            // Recent activities
            setRecentActivities([
                { id: 1, user: 'John Doe', action: 'Booked an appointment', time: '5 mins ago', type: 'appointment' },
                { id: 2, user: 'Jane Smith', action: 'Joined a queue', time: '10 mins ago', type: 'queue' },
                { id: 3, user: 'Admin', action: 'Updated office hours', time: '30 mins ago', type: 'admin' },
                { id: 4, user: 'Mike Johnson', action: 'Requested transcript', time: '1 hour ago', type: 'document' },
                { id: 5, user: 'Sarah Williams', action: 'Cancelled appointment', time: '2 hours ago', type: 'appointment' },
            ]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to the admin panel. Here's an overview of your system.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-2xl">
                            👨‍🎓
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Appointments</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalAppointments}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-2xl">
                            📅
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Queue Tickets</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalQueueTickets}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-2xl">
                            🎫
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Offices</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalOffices}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-2xl">
                            🏢
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Today's Appointments</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.todayAppointments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Appointments</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingAppointments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Appointments</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedAppointments}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                    <Link to="/admin/reports" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                    activity.type === 'appointment' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                                        activity.type === 'queue' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                                            activity.type === 'document' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
                                                'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}>
                                    {activity.type === 'appointment' ? '📅' :
                                        activity.type === 'queue' ? '🎫' :
                                            activity.type === 'document' ? '📄' : '⚙️'}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminDashboard;