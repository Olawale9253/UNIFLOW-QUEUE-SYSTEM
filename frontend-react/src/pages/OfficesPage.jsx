import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Offices = () => {
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
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
            const response = await api.get(`/offices/${officeId}/services`);
            const staffResponse = await api.get(`/users/office/${officeId}/staff`);
            setServices(response.data);
            setStaff(staffResponse.data);
            const office = offices.find(o => o.id === officeId);
            setSelectedOffice(office);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="user-page">
            <h1 className="user-page-title">Offices</h1>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Office List */}
                <div className="lg:col-span-1">
                    <div className="user-card overflow-visible">
                        <h2 className="user-card-title">All Offices</h2>
                        <div className="space-y-2">
                            {offices.map((office) => (
                                <button
                                    key={office.id}
                                    onClick={() => fetchServices(office.id)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition ${
                                        selectedOffice?.id === office.id
                                            ? 'bg-blue-50 border-blue-500 border text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                                                : 'border border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
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
                        <div className="user-card animate-enter-up">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedOffice.name}</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedOffice.description || 'No description'}</p>

                            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Working Hours</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedOffice.workingHoursStart} - {selectedOffice.workingHoursEnd}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Slot Duration</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{selectedOffice.slotDurationMinutes} minutes</p>
                                </div>
                            </div>

                            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Services</h3>
                            {services.length === 0 ? (
                                <p className="text-gray-500">No services available</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {services.map((service) => (
                                        <div key={service.id} className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900">
                                            <p className="font-medium text-gray-900 dark:text-white">{service.name}</p>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{service.description || 'No description'}</p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Duration: {service.durationMinutes} min</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white">Assigned officer</h3>
                            {staff.length === 0 ? (
                                <p className="text-gray-500">No officer assigned yet</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {staff.map((member) => (
                                        <div key={member.id} className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900">
                                            <p className="font-medium text-gray-900 dark:text-white">{member.fullName}</p>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="user-card p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">Select an office to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Offices;