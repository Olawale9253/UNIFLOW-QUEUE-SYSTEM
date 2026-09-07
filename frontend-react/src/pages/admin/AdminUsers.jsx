import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import UserAvatar from '../../components/common/UserAvatar';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user role');
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        try {
            if (currentStatus) {
                await api.put(`/users/${userId}/deactivate`);
                toast.success('User deactivated');
            } else {
                await api.put(`/users/${userId}/activate`);
                toast.success('User activated');
            }
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleApproval = async (userId, approve) => {
        try {
            await api.put(`/users/${userId}/${approve ? 'approve' : 'reject'}`);
            toast.success(approve ? 'Account approved' : 'Account rejected');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update account approval');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.matriculationNumber?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !selectedRole || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        const colors = {
            'ADMIN': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
            'STAFF': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'STUDENT': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
        };
        return colors[role] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading students...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="sticky top-0 z-20 -mx-4 bg-gradient-primary px-4 pb-4 sm:-mx-6 sm:px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage students, staff, and administrators in the system.</p>
                <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or matric number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    />
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="STAFF">Staff</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="max-h-[calc(100vh-300px)] overflow-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <UserAvatar user={user} size="sm" />
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName || 'N/A'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.matriculationNumber || 'N/A'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        user.active ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                            'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
                    }`}>
                      {!user.approved ? 'Pending approval' : user.active ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => !user.approved ? handleApproval(user.id, true) : handleToggleActive(user.id, user.active)}
                                        className={`px-3 py-1 rounded text-xs transition ${
                                            !user.approved ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200' : user.active ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200' :
                                                'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 hover:bg-green-200'
                                        }`}
                                    >
                                        {!user.approved ? 'Approve' : user.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    {!user.approved && <button onClick={() => handleApproval(user.id, false)} className="ml-2 rounded bg-red-100 px-3 py-1 text-xs text-red-600 hover:bg-red-200">Reject</button>}
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="ml-2 px-2 py-1 border rounded text-xs bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="STAFF">Staff</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No students found
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export default AdminUsers;