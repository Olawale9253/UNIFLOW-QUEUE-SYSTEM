import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/notifications';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';

function StaffQueue() {
    const { user } = useAuth();
    const { queueUpdateVersion } = useWebSocket();
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffices();
    }, []);

    useEffect(() => {
        if (selectedOffice) {
            fetchQueue();
            const interval = setInterval(fetchQueue, 10000);
            return () => clearInterval(interval);
        }
    }, [selectedOffice, queueUpdateVersion]);

    const fetchOffices = async () => {
        try {
            const response = await api.get('/users/profile');
            if (response.data.officeId) {
                setOffices([{ id: response.data.officeId, name: response.data.officeName }]);
                setSelectedOffice(response.data.officeId);
            }
        } catch (error) {
            toast.error('Failed to load offices');
        } finally {
            setLoading(false);
        }
    };

    const fetchQueue = async () => {
        try {
            const response = await api.get(`/queues/live/${selectedOffice}`);
            setQueues(response.data);
        } catch (error) {
            toast.error('Failed to load queue');
        }
    };

    const handleCallNext = async () => {
        try {
            await api.post(`/queues/call/${selectedOffice}`);
            toast.success('Next ticket called!');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to call next ticket');
        }
    };

    const handleComplete = async (ticketId) => {
        try {
            await api.put(`/queues/complete/${ticketId}`);
            toast.success('Ticket completed!');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to complete ticket');
        }
    };

    const handleSkip = async (ticketId) => {
        if (!(await confirmAction('Are you sure you want to skip this ticket?'))) return;
        try {
            await api.put(`/queues/skip/${ticketId}`);
            toast.success('Ticket skipped');
            fetchQueue();
        } catch (error) {
            toast.error('Failed to skip ticket');
        }
    };

    if (loading) {
        return (
            <StaffLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                </div>
            </StaffLayout>
        );
    }

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Queue Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage active queues for your office.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned office: {offices[0]?.name || user?.officeName || 'Not assigned'}</span>
                    <button
                        onClick={handleCallNext}
                        className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                        Call Next
                    </button>
                    <button
                        onClick={fetchQueue}
                        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Serving</h2>
                <div className="text-center py-4">
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {queues?.currentServing || 'None'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Waiting: {queues?.waitingCount || 0}</p>
                    {queues?.currentServingTicket && (
                        <div className="mt-4 flex justify-center gap-2">
                            <button
                                onClick={() => handleComplete(queues.currentServingTicket.id)}
                                className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-700 dark:hover:bg-green-600 transition"
                            >
                                Complete Service
                            </button>
                            <button
                                onClick={() => handleSkip(queues.currentServingTicket.id)}
                                className="bg-yellow-600 dark:bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 dark:hover:bg-yellow-600 transition"
                            >
                                Skip
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Waiting Tickets</h2>
                {queues?.waitingTickets?.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No waiting tickets</p>
                ) : (
                    <div className="space-y-3">
                        {queues?.waitingTickets?.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">#{ticket.ticketNumber}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Position: {ticket.position}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Est. Wait: {ticket.estimatedWaitTime} min</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleSkip(ticket.id)}
                                        className="bg-yellow-600 dark:bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 dark:hover:bg-yellow-600 transition"
                                    >
                                        Skip
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}

export default StaffQueue;