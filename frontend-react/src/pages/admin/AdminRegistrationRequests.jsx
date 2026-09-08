import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import ErrorState from '../../components/common/ErrorState';

function AdminRegistrationRequests() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setError('');
        try {
            const response = await api.get('/users');
            setUsers((response.data || []).filter(user => !user.approved));
        } catch (error) {
            console.error('Error fetching new user requests:', error);
            setError(error.response?.data?.message || 'We could not load new user requests right now.');
            toast.error('Failed to load new user requests');
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (userId, decision) => {
        try {
            await api.put(`/users/${userId}/${decision}`);
            toast.success(decision === 'approve' ? 'Registration approved' : 'Registration declined');
            fetchRequests();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update registration request');
        }
    };

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filteredUsers = users.filter(user => [
        user.email,
        user.fullName,
        user.matriculationNumber
    ].some(value => value?.toLowerCase().includes(normalizedSearch)));

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading new user requests...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="sticky top-0 z-20 -mx-4 bg-gradient-primary px-4 pb-4 sm:-mx-6 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New User Request</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Review and decide which new accounts can access UniFlow.</p>
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <input
                        type="search"
                        placeholder="Search by email, name, or matric number..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {error && <ErrorState title="New user requests are unavailable" message={error} onRetry={fetchRequests} />}

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="max-h-[calc(100vh-290px)] overflow-auto">
                    <table className="w-full min-w-[720px]">
                        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {['Name', 'Email', 'Matric Number', 'Role', 'Actions'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.matriculationNumber || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.role || 'STUDENT'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleDecision(user.id, 'approve')} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 transition hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300">Accept</button>
                                            <button onClick={() => handleDecision(user.id, 'reject')} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300">Decline</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && <p className="p-8 text-center text-gray-500 dark:text-gray-400">No pending new user requests found.</p>}
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminRegistrationRequests;