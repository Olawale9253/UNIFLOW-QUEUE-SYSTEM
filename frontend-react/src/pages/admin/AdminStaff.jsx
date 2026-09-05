import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { confirmAction } from '../../utils/notifications';
import UserAvatar from '../../components/common/UserAvatar';

function AdminStaff() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        matriculationNumber: '',
        password: '',
        role: 'STAFF'
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await api.get('/users');
            const staffUsers = response.data.filter(u => u.role === 'STAFF');
            setStaff(staffUsers);
        } catch (error) {
            console.error('Error fetching staff:', error);
            toast.error('Failed to load staff data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            if (editingStaff) {
                // Update existing staff
                await api.put(`/users/${editingStaff.id}`, {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email
                });
                toast.success('Staff updated successfully');
            } else {
                // Create new staff via registration
                const staffData = {
                    matriculationNumber: formData.matriculationNumber || `STAFF/${Date.now()}`,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    role: 'STAFF'
                };

                // Register the user as STAFF
                await api.post('/auth/register', staffData);

                // Update role to STAFF (in case registration defaults to STUDENT)
                const usersRes = await api.get('/users');
                const newUser = usersRes.data.find(u => u.email === formData.email);
                if (newUser) {
                    await api.put(`/users/${newUser.id}/role`, { role: 'STAFF' });
                }

                toast.success('Staff member created successfully');
            }

            setShowModal(false);
            setEditingStaff(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                matriculationNumber: '',
                password: '',
                role: 'STAFF'
            });
            fetchStaff();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save staff member');
        }
    };

    const handleDelete = async (id) => {
        if (!(await confirmAction('Are you sure you want to remove this staff member?'))) return;

        try {
            // Deactivate instead of delete
            await api.put(`/users/${id}/deactivate`);
            toast.success('Staff member deactivated');
            fetchStaff();
        } catch (error) {
            toast.error('Failed to remove staff member');
        }
    };

    const handleEdit = (staffMember) => {
        setEditingStaff(staffMember);
        setFormData({
            fullName: staffMember.fullName || '',
            email: staffMember.email || '',
            phone: staffMember.phone || '',
            matriculationNumber: staffMember.matriculationNumber || '',
            password: '', // Password not shown for editing
            role: 'STAFF'
        });
        setShowModal(true);
    };

    const getInitials = (name) => {
        if (name) {
            const names = name.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return name.charAt(0).toUpperCase();
        }
        return 'S';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading staff...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="sticky top-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-4 bg-gradient-primary px-4 pb-4 sm:-mx-6 sm:px-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Staff</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage staff members.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingStaff(null);
                        setFormData({
                            fullName: '',
                            email: '',
                            phone: '',
                            matriculationNumber: '',
                            password: '',
                            role: 'STAFF'
                        });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                    + Add Staff
                </button>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((member) => (
                    <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <UserAvatar user={member} size="lg" className="h-12 w-12 rounded-full bg-blue-500 text-lg" fallback="S" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.fullName}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {member.matriculationNumber || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Phone: {member.phone || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Status: <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {staff.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No staff members yet. Click "Add Staff" to get started.</p>
                </div>
            )}

            {/* Add/Edit Staff Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    placeholder="staff@uniflow.com"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    placeholder="08012345678"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Staff ID</label>
                                <input
                                    type="text"
                                    value={formData.matriculationNumber}
                                    onChange={(e) => setFormData({ ...formData, matriculationNumber: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    placeholder="STAFF/001"
                                />
                            </div>
                            {!editingStaff && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        placeholder="Minimum 6 characters"
                                        required={!editingStaff}
                                        minLength="6"
                                    />
                                </div>
                            )}
                            {editingStaff && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Leave password blank to keep current password
                                    </p>
                                </div>
                            )}
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                                >
                                    {editingStaff ? 'Update' : 'Create Staff'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingStaff(null);
                                    }}
                                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default AdminStaff;