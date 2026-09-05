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
        const interval = setInterval(fetchDashboardData, 10000);

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const officesRes = await api.get('/offices/active');
            const offices = officesRes.data || [];
            const officeData = await Promise.all(offices.map(async (office) => {
                const [appointmentsRes, queueRes, documentsRes, ticketsRes] = await Promise.all([
                    api.get(`/appointments/office/${office.id}`),
                    api.get(`/queues/live/${office.id}`),
                    api.get(`/documents/office/${office.id}`),
                    api.get(`/queues/office/${office.id}/tickets`)
                ]);
                return {
                    appointments: appointmentsRes.data || [],
                    queue: queueRes.data || {},
                    documents: documentsRes.data || [],
                    tickets: ticketsRes.data || []
                };
            }));

            const appointments = officeData.flatMap(data => data.appointments);
            const documents = officeData.flatMap(data => data.documents);
            const tickets = officeData.flatMap(data => data.tickets);

            const today = new Date().toDateString();
            const todayAppointments = appointments.filter(a =>
                new Date(a.appointmentTime).toDateString() === today
            );

            setStats({
                todayAppointments: todayAppointments.length,
                pendingQueues: officeData.reduce((total, data) => total + (data.queue.waitingCount || 0), 0),
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
            <div className="user-page">
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="card card-hover p-5">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today&apos;s Appointments</p>
                        <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.todayAppointments}</p>
                    </div>
                    <div className="card card-hover p-5">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Queues</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingQueues}</p>
                    </div>
                    <div className="card card-hover p-5">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Documents</p>
                        <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.pendingDocuments}</p>
                    </div>
                    <div className="card card-hover p-5">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed Today</p>
                        <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedToday}</p>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Link
                    to="/staff/queue"
                    className="card card-hover flex items-center space-x-3 p-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10M18 16v4m-2-2h4" />
                        </svg>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Manage Queues</span>
                </Link>

                <Link
                    to="/staff/appointments"
                    className="card card-hover flex items-center space-x-3 p-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="17" rx="2" />
                            <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">View Appointments</span>
                </Link>

                <Link
                    to="/staff/documents"
                    className="card card-hover flex items-center space-x-3 p-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6M8 13h8M8 17h6" />
                        </svg>
                    </div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Process Documents</span>
                </Link>
                </div>

                <div className="card p-6">
                <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Recent Queue Tickets</h2>
                {recentTickets.length === 0 ? (
                    <p className="py-8 text-center text-slate-500 dark:text-slate-400">No recent tickets</p>
                ) : (
                    <div className="space-y-3">
                        {recentTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 dark:border-slate-700">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{ticket.officeName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ticket: {ticket.ticketNumber}</p>
                                </div>
                                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'WAITING' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                          ticket.status === 'CALLED' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                              ticket.status === 'COMPLETED' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                                  'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
                  }`}>
                    {ticket.status}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </StaffLayout>
    );
}

export default StaffDashboard;