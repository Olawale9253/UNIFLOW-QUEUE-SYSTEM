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

            // Remove duplicate offices
            const uniqueOffices = Array.from(
                new Map(officesRes.data.map(office => [office.id, office])).values()
            );
            setOffices(uniqueOffices);
            setMyTickets(ticketsRes.data);
            setLiveQueues(liveQueuesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                // Remove duplicate services
                const uniqueServices = Array.from(
                    new Map(response.data.map(service => [service.id, service])).values()
                );
                setServices(uniqueServices);
            } catch (error) {
                console.error('Error fetching services:', error);
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
            'WAITING': 'bg-yellow-100 text-yellow-800',
            'CALLED': 'bg-green-100 text-green-800',
            'COMPLETED': 'bg-blue-100 text-blue-800',
            'SKIPPED': 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Queue Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Join Queue</h2>
                    <form onSubmit={handleJoinQueue}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Office</label>
                            <select
                                value={selectedOffice}
                                onChange={handleOfficeChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
                            <select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Join Queue
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">My Queue Tickets</h2>
                    {myTickets.length === 0 ? (
                        <p className="text-gray-500">No active queue tickets</p>
                    ) : (
                        <div className="space-y-3">
                            {myTickets.map((ticket) => (
                                <div key={ticket.id} className="border rounded-lg p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{ticket.officeName}</p>
                                        <p className="text-sm text-gray-600">Ticket: {ticket.ticketNumber}</p>
                                        <p className="text-sm text-gray-600">Position: {ticket.position}</p>
                                        <p className="text-sm text-gray-600">Est. Wait: {ticket.estimatedWaitTime} min</p>
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

            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Live Queues</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {liveQueues.map((queue) => (
                        <div key={queue.officeId} className="border rounded-lg p-4">
                            <h3 className="font-semibold">{queue.officeName}</h3>
                            <p className="text-sm">Now Serving: <span className="font-bold text-green-600">{queue.currentServing}</span></p>
                            <p className="text-sm">Waiting: {queue.waitingCount}</p>
                            <p className="text-sm">Avg Wait: {queue.averageWaitTime} min</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Queue;