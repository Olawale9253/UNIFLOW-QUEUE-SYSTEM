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
    const [offices, setOffices] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        matriculationNumber: '',
        password: '',
        role: 'STAFF',
        officeId: ''
    });

    useEffect(() => {
        fetchStaff();
        api.get('/offices/active').then(response => setOffices(response.data)).catch(() => toast.error('Failed to load offices'));
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await api.get('/users');
            const staffUsers = response.data.filter(u => u.role === 'STAFF' && u.active !== false);
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
        if (!formData.fullName || !formData.email || (!editingStaff && !formData.password)) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            if (editingStaff) {
                // Update existing staff
                await api.put(`/users/${editingStaff.id}`, {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    officeId: formData.officeId,
                });
                toast.success('Staff updated successfully');
            } else {
                const staffData = {
                    matriculationNumber: `STAFF-${Date.now()}`,
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    officeId: formData.officeId,
                };

                await api.post('/users/staff', staffData);

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
                role: 'STAFF',
                officeId: ''
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
            role: 'STAFF',
            officeId: staffMember.officeId || ''
        });
        setShowModal(true);
    };

    const isOfficeAssigned = (officeId) => staff.some(member => member.officeId === Number(officeId) && member.id !== editingStaff?.id);

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
                            role: 'STAFF',
                            officeId: ''
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
                    <div key={member.id} className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-start justify-between">
                            <div className="flex min-w-0 items-center space-x-3">
                                <UserAvatar user={member} size="lg" className="h-12 w-12 rounded-full bg-blue-500 text-lg" fallback="S" />
                                <div className="min-w-0">
                                    <h3 className="truncate font-semibold text-gray-900 dark:text-white">{member.fullName}</h3>
                                    <p className="truncate text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">ID: {member.matriculationNumber || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex shrink-0 space-x-2">
                                <button
                                    onClick={() => handleEdit(member)}
                                    className="rounded p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                                    aria-label={`Edit ${member.fullName}`}
                                    title="Edit staff member"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m4 16 9.5-9.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /><path strokeLinecap="round" d="m14 6 4 4" /></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="rounded p-1 text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                    aria-label={`Deactivate ${member.fullName}`}
                                    title="Deactivate staff member"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Assigned office: {member.officeName || 'Not assigned'}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {member.phone || 'N/A'}</p>
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
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 dark:bg-gray-800">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
                            <button type="button" onClick={() => { setShowModal(false); setEditingStaff(null); }} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white" aria-label="Close staff form" title="Close">
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
                            </button>
                        </div>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned office *</label>
                                <select value={formData.officeId} onChange={(e) => setFormData({ ...formData, officeId: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                                    <option value="">Select an office</option>
                                    {offices.map(office => <option key={office.id} value={office.id} disabled={isOfficeAssigned(office.id)}>{office.name}{isOfficeAssigned(office.id) ? ' (assigned)' : ''}</option>)}
                                </select>
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