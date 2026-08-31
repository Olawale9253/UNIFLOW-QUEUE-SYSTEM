import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveQueues, setLiveQueues] = useState([]);
  const [stats, setStats] = useState({
    appointments: 0,
    queueTickets: 0,
    documents: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const queuesRes = await api.get('/queues/live/all');
      setLiveQueues(queuesRes.data);

      const [appointmentsRes, ticketsRes, documentsRes] = await Promise.all([
        api.get('/appointments/my-appointments'),
        api.get('/queues/my-tickets'),
        api.get('/documents/my-requests')
      ]);

      const appointments = appointmentsRes.data || [];
      const tickets = ticketsRes.data || [];
      const documents = documentsRes.data || [];

      const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
      const completedTickets = tickets.filter(t => t.status === 'COMPLETED').length;

      setStats({
        appointments: appointments.length,
        queueTickets: tickets.length,
        documents: documents.length,
        completed: completedAppointments + completedTickets
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  // Get current time
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get user initials
  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {getInitials()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {getGreeting()}, {user?.fullName || 'Student'}
                </h1>
                <p className="text-blue-100 mt-1">
                  {getCurrentTime()} • Welcome back to UniFlow
                </p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link
                  to="/queue"
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition"
              >
                Join Queue
              </Link>
              <Link
                  to="/appointments"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Appointments</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.appointments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <Link to="/appointments" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Queue Tickets</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.queueTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <Link to="/queue" className="text-xs text-green-600 dark:text-green-400 hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Documents</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.documents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <Link to="/documents" className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 inline-block">Completed tasks</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
              to="/queue"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Join Queue</span>
          </Link>

          <Link
              to="/appointments"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Book Appointment</span>
          </Link>

          <Link
              to="/documents"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Request Document</span>
          </Link>

          <Link
              to="/offices"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-medium text-gray-700 dark:text-gray-300">View Offices</span>
          </Link>
        </div>

        {/* Live Queues Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Queues</h2>
            <Link to="/queue" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all queues →
            </Link>
          </div>

          {liveQueues.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">No active queues at the moment.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later or join a queue.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveQueues.map((queue) => (
                    <div
                        key={queue.officeId}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{queue.officeName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Waiting: {queue.waitingCount}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs rounded-full">
                    Live
                  </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Now Serving</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {queue.currentServing || 'None'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Avg Wait</p>
                          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
                            {queue.averageWaitTime || 0} min
                          </p>
                        </div>
                      </div>

                      {queue.waitingCount > 0 && (
                          <Link
                              to="/queue"
                              className="mt-3 block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Join this queue →
                          </Link>
                      )}
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}

export default Dashboard;