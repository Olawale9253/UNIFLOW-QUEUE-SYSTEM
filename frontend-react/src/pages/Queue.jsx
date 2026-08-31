import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Queue() {
    const [offices, setOffices] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [liveQueues, setLiveQueues] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [officesRes, ticketsRes, liveQueuesRes] = await Promise.all([
                api.get('/offices/active'),
                api.get('/queues/my-tickets'),
                api.get('/queues/live/all')
            ]);

            const uniqueOffices = Array.from(
                new Map(officesRes.data.map(office => [office.id, office])).values()
            );
            setOffices(uniqueOffices);
            setMyTickets(ticketsRes.data);
            setLiveQueues(liveQueuesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load queue data');
        } finally {
            setLoading(false);
        }
    };

    const handleOfficeChange = async (e) => {
        const officeId = e.target.value;
        setSelectedOffice(officeId);
        setSelectedService('');
        if (officeId) {
            try {
                const response = await api.get(`/offices/${officeId}/services`);
                const uniqueServices = Array.from(
                    new Map(response.data.map(service => [service.id, service])).values()
                );
                setServices(uniqueServices);
            } catch (error) {
                console.error('Error fetching services:', error);
                toast.error('Failed to load services');
            }
        } else {
            setServices([]);
        }
    };

    const handleJoinQueue = async (e) => {
        e.preventDefault();
        if (!selectedOffice || !selectedService) {
            toast.error('Please select an office and service');
            return;
        }

        try {
            const response = await api.post('/queues/join', {
                officeId: parseInt(selectedOffice),
                serviceId: parseInt(selectedService)
            });
            toast.success(`Joined queue! Ticket: ${response.data.ticketNumber}`);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join queue');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'WAITING': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
            'CALLED': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
            'COMPLETED': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'SKIPPED': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
        };
        return badges[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading queue data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Queue Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Join Queue Form */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Join Queue</h2>
                    <form onSubmit={handleJoinQueue}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office</label>
                            <select
                                value={selectedOffice}
                                onChange={handleOfficeChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                required
                                disabled={!selectedOffice}
                            >
                                <option value="">Select Service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                            Join Queue
                        </button>
                    </form>
                </div>

                {/* My Tickets */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Queue Tickets</h2>
                    {myTickets.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No active queue tickets</p>
                    ) : (
                        <div className="space-y-3">
                            {myTickets.map((ticket) => (
                                <div key={ticket.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{ticket.officeName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Ticket: {ticket.ticketNumber}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Position: {ticket.position}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Est. Wait: {ticket.estimatedWaitTime} min</p>
                                    </div>
                                    <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Live Queues */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Live Queues</h2>
                {liveQueues.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">No active queues</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveQueues.map((queue) => (
                            <div key={queue.officeId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{queue.officeName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Now Serving: <span className="font-bold text-blue-600 dark:text-blue-400">{queue.currentServing || 'None'}</span></p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Waiting: {queue.waitingCount}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Wait: {queue.averageWaitTime || 0} min</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Queue;