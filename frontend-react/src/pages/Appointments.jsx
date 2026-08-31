import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Appointments() {
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

    useEffect(() => {
        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        setSelectedDate(dateStr);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [appointmentsRes, officesRes] = await Promise.all([
                api.get('/appointments/my-appointments'),
                api.get('/offices/active')
            ]);
            setAppointments(appointmentsRes.data);
            setOffices(officesRes.data);
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
                setServices(response.data);
                // Fetch available slots for the selected date
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
            // Ensure date is in correct format YYYY-MM-DD
            const formattedDate = date.split('T')[0];
            console.log('Fetching slots for office:', officeId, 'date:', formattedDate);

            // Use the endpoint with query parameter
            const response = await api.get(`/appointments/available-slots/${officeId}`, {
                params: { date: formattedDate }
            });

            console.log('Available slots response:', response.data);
            setAvailableSlots(response.data);

            if (response.data.length === 0) {
                toast.info('No available slots for this date');
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            console.error('Error response:', error.response);
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

        try {
            // Format: YYYY-MM-DDTHH:mm:ss
            const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;
            console.log('Booking appointment at:', appointmentDateTime);

            const response = await api.post('/appointments/book', {
                officeId: parseInt(selectedOffice),
                serviceId: parseInt(selectedService),
                appointmentTime: appointmentDateTime
            });

            toast.success('Appointment booked successfully!');
            await fetchData();
            setSelectedTime('');
            setAvailableSlots([]);
        } catch (error) {
            console.error('Booking error:', error);
            console.error('Error response:', error.response);
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

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

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Appointments</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Book Appointment Form */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>
                    <form onSubmit={handleBookAppointment}>
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
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <p className="text-sm text-blue-600 mt-1">Loading available slots...</p>
                            )}
                            {!fetchingSlots && availableSlots.length === 0 && selectedOffice && selectedDate && (
                                <p className="text-sm text-yellow-600 mt-1">No available slots for this date</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={!selectedOffice || !selectedService || !selectedTime}
                        >
                            Book Appointment
                        </button>
                    </form>
                </div>

                {/* My Appointments */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                    {appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments booked</p>
                    ) : (
                        <div className="space-y-3">
                            {appointments.map((appointment) => (
                                <div key={appointment.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{appointment.officeName}</p>
                                            <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatDateTime(appointment.appointmentTime)}
                                            </p>
                                            <p className="text-sm text-gray-600">Reference: {appointment.referenceNumber}</p>
                                        </div>
                                        <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                          appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                      appointment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                                            {appointment.status !== 'CANCELLED' && appointment.status !== 'COMPLETED' && (
                                                <button
                                                    onClick={() => handleCancelAppointment(appointment.id)}
                                                    className="block mt-2 text-sm text-red-600 hover:text-red-800"
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