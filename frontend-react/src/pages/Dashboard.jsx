import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useWebSocket } from '../context/WebSocketContext';

function Dashboard() {
  const { user } = useAuth();
  const { queueUpdateVersion } = useWebSocket();
  const navigate = useNavigate();
  const [liveQueues, setLiveQueues] = useState([]);
  const [stats, setStats] = useState({
    appointments: 0,
    queueTickets: 0,
    documents: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  useEffect(() => {
    if (hasLoaded && queueUpdateVersion > 0) {
      refreshLiveQueues();
    }
  }, [queueUpdateVersion, hasLoaded]);

  const fetchDashboardData = async () => {
    try {
      if (!hasLoaded) setLoading(true);

      const [queuesRes, appointmentsRes, ticketsRes, documentsRes] = await Promise.all([
        api.get('/queues/live/all'),
        api.get('/appointments/my-appointments'),
        api.get('/queues/my-tickets'),
        api.get('/documents/my-requests')
      ]);

      setLiveQueues(queuesRes.data || []);

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
      setHasLoaded(true);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshLiveQueues = async () => {
    try {
      const response = await api.get('/queues/live/all');
      setLiveQueues(response.data || []);
    } catch (error) {
      console.error('Error refreshing live queues:', error);
    }
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
      <div className="user-page">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="card p-5 card-hover animate-enter-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">My Appointments</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.appointments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <Link to="/appointments" className="text-xs text-blue-600 dark:text-blue-400 no-underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="card p-5 card-hover animate-enter-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">My Queue Tickets</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.queueTickets}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <Link to="/queue" className="text-xs text-green-600 dark:text-green-400 no-underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="card p-5 card-hover animate-enter-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">My Documents</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.documents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <Link to="/documents" className="text-xs text-purple-600 dark:text-purple-400 no-underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="card p-5 card-hover animate-enter-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed Tasks</p>
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

        {/* Live Queues Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live Queues</h2>
            <Link to="/queue" className="text-sm text-blue-600 dark:text-blue-400 no-underline">
              View my queues →
            </Link>
          </div>

          {liveQueues.length === 0 ? (
              <div className="user-card p-8 text-center">
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
                        className="user-card card-hover animate-enter-up"
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
                              className="mt-3 block text-center text-sm text-blue-600 dark:text-blue-400 no-underline"
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