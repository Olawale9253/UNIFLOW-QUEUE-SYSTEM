import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

function AdminOffices() {
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffice, setEditingOffice] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00',
        slotDurationMinutes: 30
    });

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const response = await api.get('/offices');
            setOffices(response.data);
        } catch (error) {
            console.error('Error fetching offices:', error);
            toast.error('Failed to load offices');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOffice) {
                await api.put(`/offices/${editingOffice.id}`, formData);
                toast.success('Office updated successfully');
            } else {
                await api.post('/offices', formData);
                toast.success('Office created successfully');
            }
            setShowModal(false);
            setEditingOffice(null);
            setFormData({ name: '', description: '', workingHoursStart: '09:00', workingHoursEnd: '17:00', slotDurationMinutes: 30 });
            fetchOffices();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save office');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this office?')) return;
        try {
            await api.delete(`/offices/${id}`);
            toast.success('Office deleted successfully');
            fetchOffices();
        } catch (error) {
            toast.error('Failed to delete office');
        }
    };

    const handleEdit = (office) => {
        setEditingOffice(office);
        setFormData({
            name: office.name,
            description: office.description || '',
            workingHoursStart: office.workingHoursStart || '09:00',
            workingHoursEnd: office.workingHoursEnd || '17:00',
            slotDurationMinutes: office.slotDurationMinutes || 30
        });
        setShowModal(true);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading offices...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Office Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all offices and their services.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingOffice(null);
                        setFormData({ name: '', description: '', workingHoursStart: '09:00', workingHoursEnd: '17:00', slotDurationMinutes: 30 });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                >
                    + Add Office
                </button>
            </div>

            {/* Offices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offices.map((office) => (
                    <div key={office.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{office.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{office.description || 'No description'}</p>
                                <div className="mt-3 space-y-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Hours: {office.workingHoursStart} - {office.workingHoursEnd}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Slot: {office.slotDurationMinutes} min</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Services: {office.services?.length || 0}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(office)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDelete(office.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {offices.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No offices created yet. Click "Add Office" to get started.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            {editingOffice ? 'Edit Office' : 'Add New Office'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    rows="2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        value={formData.workingHoursStart}
                                        onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        value={formData.workingHoursEnd}
                                        onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slot Duration (minutes)</label>
                                <input
                                    type="number"
                                    value={formData.slotDurationMinutes}
                                    onChange={(e) => setFormData({ ...formData, slotDurationMinutes: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    min="15"
                                    max="120"
                                    required
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                                >
                                    {editingOffice ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingOffice(null);
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

export default AdminOffices;