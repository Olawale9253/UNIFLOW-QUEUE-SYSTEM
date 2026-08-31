import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [liveQueues, setLiveQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveQueues();
  }, []);

  const fetchLiveQueues = async () => {
    try {
      const response = await api.get('/queues/live/all');
      setLiveQueues(response.data);
    } catch (error) {
      console.error('Error fetching live queues:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.fullName || 'Student'}!</h1>
          <p className="text-gray-600">Here's what's happening with your queues and appointments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveQueues.map((queue) => (
              <div key={queue.officeId} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">{queue.officeName}</h3>
                <p className="text-sm text-gray-600">Now Serving: <span className="font-bold text-blue-600">{queue.currentServing}</span></p>
                <p className="text-sm text-gray-600">Waiting: <span className="font-bold">{queue.waitingCount}</span></p>
                <p className="text-sm text-gray-600">Avg Wait: <span className="font-bold">{queue.averageWaitTime} min</span></p>
              </div>
          ))}
        </div>

        {liveQueues.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">No active queues at the moment.</p>
            </div>
        )}
      </div>
  );
}

export default Dashboard;