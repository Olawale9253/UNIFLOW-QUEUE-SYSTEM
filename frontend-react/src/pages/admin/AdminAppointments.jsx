import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import ErrorState from '../../components/common/ErrorState';

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        officeId: '',
        status: '',
        dateFrom: '',
        dateTo: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        const refreshOnFocus = () => fetchData();
        window.addEventListener('focus', refreshOnFocus);
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', refreshOnFocus);
        };
    }, []);

    const fetchData = async () => {
        setError('');
        try {
            const [appointmentsRes, officesRes] = await Promise.all([
                api.get('/appointments/all'),
                api.get('/offices')
            ]);
            setAppointments(appointmentsRes.data);
            setOffices(officesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.message || 'We could not load appointments right now.');
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = app.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.officeName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOffice = !filters.officeId || app.officeId === parseInt(filters.officeId);
        const matchesStatus = !filters.status || app.status === filters.status;
        const appointmentDate = app.appointmentTime ? new Date(app.appointmentTime) : null;
        const matchesDateFrom = !filters.dateFrom || (appointmentDate && appointmentDate >= new Date(`${filters.dateFrom}T00:00:00`));
        const matchesDateTo = !filters.dateTo || (appointmentDate && appointmentDate <= new Date(`${filters.dateTo}T23:59:59`));
        return matchesSearch && matchesOffice && matchesStatus && matchesDateFrom && matchesDateTo;
    });

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

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportToCSV = () => {
        const headers = ['Reference', 'Student', 'Office', 'Service', 'Date', 'Status'];
        const rows = filteredAppointments.map(app => [
            app.referenceNumber || 'N/A',
            app.studentName || 'N/A',
            app.officeName || 'N/A',
            app.serviceName || 'N/A',
            formatDateTime(app.appointmentTime),
            app.status || 'N/A'
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Exported successfully!');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading appointments...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {error && <ErrorState title="Appointments are unavailable" message={error} onRetry={fetchData} />}
            <div className="sticky top-0 z-20 -mx-4 bg-gradient-primary px-4 pb-4 sm:-mx-6 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all appointments in the system.</p>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Search by reference, student, office..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <select
                        name="officeId"
                        value={filters.officeId}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                        <option value="">All Offices</option>
                        {offices.map(office => (
                            <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                    </select>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="RESCHEDULED">Rescheduled</option>
                    </select>
                    <input
                        type="date"
                        name="dateFrom"
                        value={filters.dateFrom}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <input
                        type="date"
                        name="dateTo"
                        value={filters.dateTo}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredAppointments.length} appointments found
                    </p>
                    <button
                        onClick={exportToCSV}
                        className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                        📊 Export CSV
                    </button>
                </div>
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="max-h-[calc(100vh-330px)] overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reference</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Office</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAppointments.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {app.referenceNumber || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                    {app.studentName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                    {app.officeName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                    {app.serviceName || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                    {formatDateTime(app.appointmentTime)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(app.status)}`}>
                      {app.status || 'N/A'}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {filteredAppointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No appointments found
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminAppointments;