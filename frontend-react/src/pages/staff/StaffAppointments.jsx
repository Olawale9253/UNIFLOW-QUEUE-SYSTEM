import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ErrorState from '../../components/common/ErrorState';

function StaffAppointments() {
    const { user } = useAuth();
    const [offices, setOffices] = useState([]);
    const [officeId, setOfficeId] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadAppointments = async (id = officeId) => {
        if (!id) return;
        setError('');
        try {
            const response = await api.get(`/appointments/office/${id}`);
            setAppointments(response.data || []);
        } catch (error) {
            setError(error.response?.data?.message || 'We could not load appointments for this office.');
            toast.error('Failed to load appointments');
        }
    };

    useEffect(() => {
        api.get('/users/profile').then((response) => {
            const assignedOffice = response.data.officeId ? [{ id: response.data.officeId, name: response.data.officeName }] : [];
            setOffices(assignedOffice);
            if (assignedOffice[0]) setOfficeId(assignedOffice[0].id);
        }).catch(() => toast.error('Failed to load offices')).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadAppointments();
        if (!officeId) return undefined;

        const interval = setInterval(loadAppointments, 10000);
        return () => clearInterval(interval);
    }, [officeId]);

    const updateAppointment = async (id, action, method = 'put') => {
        try {
            await api[method](`/appointments/${id}/${action}`);
            toast.success(`Appointment ${action === 'staff-cancel' ? 'cancelled' : action + 'd'}`);
            loadAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update appointment');
        }
    };

    const today = new Date().toDateString();
    const visibleAppointments = appointments.filter((appointment) => new Date(appointment.appointmentTime).toDateString() === today);

    return <StaffLayout>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Today&apos;s Appointments</h1><p className="mt-1 text-gray-600 dark:text-gray-400">Confirm and close appointments for your office.</p></div>
            <div className="flex items-center gap-3"><span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200"><span className="h-2 w-2 rounded-full bg-blue-500" />{offices[0]?.name || user?.officeName || 'Not assigned'}</span><button onClick={() => loadAppointments()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Refresh</button></div>
        </div>
        {error && <ErrorState title="Office appointments are unavailable" message={error} onRetry={() => loadAppointments()} />}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {loading ? <p className="p-8 text-center text-gray-500">Loading appointments...</p> : visibleAppointments.length === 0 ? <p className="p-8 text-center text-gray-500">No appointments scheduled today.</p> : <div className="divide-y dark:divide-gray-700">{visibleAppointments.map((appointment) => <div key={appointment.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><p className="font-semibold text-gray-900 dark:text-white">{new Date(appointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {appointment.serviceName}</p><p className="text-sm text-gray-500 dark:text-gray-400">{appointment.referenceNumber} · {appointment.status}</p></div><div className="flex gap-2">{appointment.status === 'PENDING' && <button onClick={() => updateAppointment(appointment.id, 'confirm')} className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white">Confirm</button>}{!['COMPLETED', 'CANCELLED'].includes(appointment.status) && <button onClick={() => updateAppointment(appointment.id, 'complete')} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Complete</button>}{!['COMPLETED', 'CANCELLED'].includes(appointment.status) && <button onClick={() => updateAppointment(appointment.id, 'staff-cancel', 'delete')} className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white">Cancel</button>}</div></div>)}</div>}
        </div>
    </StaffLayout>;
}

export default StaffAppointments;