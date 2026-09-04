import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';

function StaffDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        todayAppointments: 0,
        pendingQueues: 0,
        pendingDocuments: 0,
        completedToday: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [appointmentsRes, ticketsRes, documentsRes] = await Promise.all([
                api.get('/appointments/my-appointments'),
                api.get('/queues/my-tickets'),
                api.get('/documents/my-requests')
            ]);

            const appointments = appointmentsRes.data || [];
            const tickets = ticketsRes.data || [];
            const documents = documentsRes.data || [];

            const today = new Date().toDateString();
            const todayAppointments = appointments.filter(a =>
                new Date(a.appointmentTime).toDateString() === today
            );

            setStats({
                todayAppointments: todayAppointments.length,
                pendingQueues: tickets.filter(t => t.status === 'WAITING').length,
                pendingDocuments: documents.filter(d => d.status === 'SUBMITTED' || d.status === 'UNDER_REVIEW').length,
                completedToday: tickets.filter(t => t.status === 'COMPLETED').length +
                    appointments.filter(a => a.status === 'COMPLETED').length
            });

            setRecentTickets(tickets.slice(0, 5));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Welcome back, {user?.fullName || 'Staff'}!
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Today's Appointments</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.todayAppointments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Queues</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingQueues}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending Documents</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.pendingDocuments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completed Today</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedToday}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link
                    to="/staff/queue"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
                >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-xl">
                        🎫
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Manage Queues</span>
                </Link>

                <Link
                    to="/staff/appointments"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
                >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center text-xl">
                        📅
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">View Appointments</span>
                </Link>

                <Link
                    to="/staff/documents"
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
                >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center text-xl">
                        📄
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Process Documents</span>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Queue Tickets</h2>
                {recentTickets.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent tickets</p>
                ) : (
                    <div className="space-y-3">
                        {recentTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{ticket.officeName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Ticket: {ticket.ticketNumber}</p>
                                </div>
                                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'WAITING' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                          ticket.status === 'CALLED' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                              ticket.status === 'COMPLETED' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {ticket.status}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}

export default StaffDashboard;