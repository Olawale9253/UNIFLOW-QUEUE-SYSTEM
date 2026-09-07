import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { confirmAction } from '../utils/notifications';

function Appointments() {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [offices, setOffices] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingSlots, setFetchingSlots] = useState(false);
    const [queueBlocked, setQueueBlocked] = useState(false);
    const [appointmentSort, setAppointmentSort] = useState('DEFAULT');

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, officesRes, queuesRes] = await Promise.all([
                api.get('/appointments/my-appointments'),
                api.get('/offices/active'),
                api.get('/queues/my-tickets')
            ]);
            setAppointments((appointmentsRes.data || []).filter(appointment =>
                !['COMPLETED', 'CANCELLED'].includes(appointment.status)
            ));
            setQueueBlocked((queuesRes.data || []).some(ticket =>
                ticket.status === 'CALLED' || (ticket.status === 'WAITING' && ticket.position <= 2)
            ));

            const uniqueOffices = Array.from(
                new Map(officesRes.data.map(office => [office.id, office])).values()
            );
            setOffices(uniqueOffices);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleOfficeChange = async (e) => {
        const officeId = e.target.value;
        setSelectedOffice(officeId);
        setSelectedService('');
        setAvailableSlots([]);
        setSelectedTime('');

        if (officeId) {
            try {
                const response = await api.get(`/offices/${officeId}/services`);
                const uniqueServices = Array.from(
                    new Map(response.data.map(service => [service.id, service])).values()
                );
                setServices(uniqueServices);
                if (selectedDate) {
                    await fetchAvailableSlots(officeId, selectedDate);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                toast.error('Failed to load services');
            }
        } else {
            setServices([]);
        }
    };

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setSelectedTime('');
        setAvailableSlots([]);

        if (selectedOffice && date) {
            await fetchAvailableSlots(selectedOffice, date);
        }
    };

    const fetchAvailableSlots = async (officeId, date) => {
        setFetchingSlots(true);
        try {
            const formattedDate = date.split('T')[0];
            const response = await api.get(`/appointments/available-slots/${officeId}`, {
                params: { date: formattedDate }
            });
            setAvailableSlots(response.data);
        } catch (error) {
            console.error('Error fetching slots:', error);
            toast.error('Failed to load available slots');
            setAvailableSlots([]);
        } finally {
            setFetchingSlots(false);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();

        if (!selectedOffice || !selectedService || !selectedTime) {
            toast.error('Please fill all fields');
            return;
        }

        if (queueBlocked) {
            toast.error('Your queue turn is near. Please complete it before booking an appointment.');
            return;
        }

        const selectedOfficeName = offices.find(office => String(office.id) === selectedOffice)?.name;
        const selectedServiceName = services.find(service => String(service.id) === selectedService)?.name;
        const hasActiveAppointment = appointments.some(appointment =>
            appointment.officeName === selectedOfficeName
            && appointment.serviceName === selectedServiceName
            && !['COMPLETED', 'CANCELLED'].includes(appointment.status)
        );
        if (hasActiveAppointment) {
            toast.error('You already have an active appointment for this office and service.');
            return;
        }

        try {
            const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;

            await api.post('/appointments/book', {
                officeId: parseInt(selectedOffice),
                serviceId: parseInt(selectedService),
                appointmentTime: appointmentDateTime
            });

            toast.success('Appointment booked successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!(await confirmAction('Are you sure you want to cancel this appointment?'))) return;

        try {
            await api.delete(`/appointments/${appointmentId}/cancel`);
            toast.success('Appointment cancelled');
            await fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PENDING': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
            'CONFIRMED': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
            'CANCELLED': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
            'COMPLETED': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'RESCHEDULED': 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
        };
        return badges[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    const statusOrder = {
        PENDING: 1,
        CONFIRMED: 2,
        RESCHEDULED: 3,
        COMPLETED: 4,
        CANCELLED: 5
    };
    const sortedAppointments = [...appointments].sort((appointmentA, appointmentB) => {
        if (appointmentSort === 'DEFAULT') return 0;
        if (appointmentSort === 'STATUS_ASC') {
            return (statusOrder[appointmentA.status] || 99) - (statusOrder[appointmentB.status] || 99);
        }
        return (statusOrder[appointmentB.status] || 99) - (statusOrder[appointmentA.status] || 99);
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-page">
            <h1 className="user-page-title">Appointments</h1>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Book Appointment Form */}
                <div className="user-card self-start lg:sticky lg:top-24 lg:col-span-1">
                    <h2 className="user-card-title">Book Appointment</h2>
                    <form onSubmit={handleBookAppointment}>
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
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="input"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="input"
                                required
                                disabled={availableSlots.length === 0 || fetchingSlots}
                            >
                                <option value="">Select Time</option>
                                {availableSlots.map((slot) => (
                                    <option key={slot} value={new Date(slot).toTimeString().slice(0, 5)}>
                                        {formatTime(slot)}
                                    </option>
                                ))}
                            </select>
                            {fetchingSlots && (
                                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Loading available slots...</p>
                            )}
                            {!fetchingSlots && availableSlots.length === 0 && selectedOffice && selectedDate && (
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">No available slots for this date</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={queueBlocked || !selectedOffice || !selectedService || !selectedTime}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {queueBlocked ? 'Queue turn is near' : 'Book Appointment'}
                        </button>
                    </form>
                        {queueBlocked && (
                            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                Complete your current queue turn before booking another request.
                            </p>
                        )}
                </div>
                <div className="user-card lg:col-span-2">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="user-card-title mb-0">My Appointments</h2>
                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Sort by status</span>
                            <select
                                value={appointmentSort}
                                onChange={(event) => setAppointmentSort(event.target.value)}
                                className="input w-auto py-2"
                            >
                                <option value="DEFAULT">Soonest</option>
                                <option value="STATUS_ASC">Pending first</option>
                                <option value="STATUS_DESC">Rescheduled first</option>
                            </select>
                        </label>
                    </div>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No appointments booked</p>
                    ) : (
                        <div className="space-y-3">
                            {sortedAppointments.map((appointment) => (
                                <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{appointment.officeName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.serviceName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {formatDateTime(appointment.appointmentTime)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Reference: {appointment.referenceNumber}</p>
                                        </div>
                                        <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-2">
                                            <span className={`inline-flex min-h-7 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold tracking-wide ${getStatusBadge(appointment.status)}`}>
                                                {appointment.status.replaceAll('_', ' ')}
                                            </span>
                                            {appointment.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    className="min-h-7 rounded-md px-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
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

export default Appointments;