import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function Offices() {
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const response = await api.get('/offices');
            setOffices(response.data);
        } catch (error) {
            console.error('Error fetching offices:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async (officeId) => {
        try {
            const [servicesRes, officeRes] = await Promise.all([
                api.get(`/offices/${officeId}/services`),
                api.get(`/offices/${officeId}`)
            ]);
            setServices(servicesRes.data);
            setSelectedOffice(officeRes.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Offices</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Office List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="text-xl font-semibold mb-4">All Offices</h2>
                        <div className="space-y-2">
                            {offices.map((office) => (
                                <button
                                    key={office.id}
                                    onClick={() => fetchServices(office.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        selectedOffice?.id === office.id
                                            ? 'bg-blue-100 border-blue-500 border'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <p className="font-medium">{office.name}</p>
                                    {office.active === false && (
                                        <span className="text-xs text-red-600">(Inactive)</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Office Details */}
                <div className="lg:col-span-2">
                    {selectedOffice ? (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-2">{selectedOffice.name}</h2>
                            <p className="text-gray-600 mb-4">{selectedOffice.description || 'No description'}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-600">Working Hours</p>
                                    <p className="font-medium">{selectedOffice.workingHoursStart} - {selectedOffice.workingHoursEnd}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Slot Duration</p>
                                    <p className="font-medium">{selectedOffice.slotDurationMinutes} minutes</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-semibold mb-3">Services</h3>
                            {services.length === 0 ? (
                                <p className="text-gray-500">No services available</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {services.map((service) => (
                                        <div key={service.id} className="border rounded-lg p-3">
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-sm text-gray-600">{service.description || 'No description'}</p>
                                            <p className="text-sm text-gray-600">Duration: {service.durationMinutes} min</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500">Select an office to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Offices;