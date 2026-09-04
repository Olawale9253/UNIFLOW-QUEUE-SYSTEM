import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Queue() {
    const navigate = useNavigate();
    const [offices, setOffices] = useState([]);
    const [myTickets, setMyTickets] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [officesRes, ticketsRes] = await Promise.all([
                api.get('/offices/active'),
                api.get('/queues/my-tickets')
            ]);

            const uniqueOffices = Array.from(
                new Map(officesRes.data.map(office => [office.id, office])).values()
            );
            setOffices(uniqueOffices);
            setMyTickets(ticketsRes.data);
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
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to join queue');
        }
    };

    const handleReschedule = async (ticketId) => {
        if (!window.confirm('Move this ticket to the end of the queue?')) return;
        try {
            await api.put(`/queues/${ticketId}/reschedule`);
            toast.success('Ticket moved to the end of the queue');
            await fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reschedule ticket');
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
        <div className="user-page">
            <h1 className="user-page-title">Queue Management</h1>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Join Queue Form */}
                <div className="user-card self-start lg:sticky lg:top-24 lg:col-span-1">
                    <h2 className="user-card-title">Join Queue</h2>
                    <form onSubmit={handleJoinQueue}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office</label>
                            <select
                                value={selectedOffice}
                                onChange={handleOfficeChange}
                                className="input"
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
                                className="input"
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
                            className="btn-primary w-full"
                        >
                            Join Queue
                        </button>
                    </form>
                </div>

                {/* My Tickets */}
                <div className="user-card lg:col-span-2">
                    <h2 className="user-card-title">My Queue Tickets</h2>
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
                                        {ticket.status === 'WAITING' && (
                                            <button
                                                type="button"
                                                onClick={() => handleReschedule(ticket.id)}
                                                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                Reschedule turn
                                            </button>
                                        )}
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
        </div>
    );
}

export default Queue;