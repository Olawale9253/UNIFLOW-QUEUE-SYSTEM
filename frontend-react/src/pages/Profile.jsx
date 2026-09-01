import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [stats, setStats] = useState({
        appointments: 0,
        queueTickets: 0,
        documents: 0,
        completed: 0
    });
    const [profile, setProfile] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        matriculationNumber: user?.matriculationNumber || 'Not set',
        role: user?.role || 'STUDENT'
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/profile');
            const data = response.data;
            setProfile({
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || '',
                matriculationNumber: data.matriculationNumber || 'Not set',
                role: data.role || 'STUDENT'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const appointmentsRes = await api.get('/appointments/my-appointments');
            const appointments = appointmentsRes.data || [];

            const ticketsRes = await api.get('/queues/my-tickets');
            const tickets = ticketsRes.data || [];

            const documentsRes = await api.get('/documents/my-requests');
            const documents = documentsRes.data || [];

            const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
            const completedTickets = tickets.filter(t => t.status === 'COMPLETED').length;

            setStats({
                appointments: appointments.length,
                queueTickets: tickets.length,
                documents: documents.length,
                completed: completedAppointments + completedTickets
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const response = await api.put('/users/profile', null, {
                params: {
                    fullName: profile.fullName,
                    phone: profile.phone
                }
            });
            toast.success('Profile updated successfully');
            setEditMode(false);

            const updatedUser = { ...user, fullName: profile.fullName, phone: profile.phone };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            await fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const getInitials = () => {
        if (profile.fullName) {
            const names = profile.fullName.split(' ');
            if (names.length >= 2) {
                return (names[0][0] + names[1][0]).toUpperCase();
            }
            return profile.fullName.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const getRoleBadge = () => {
        const colors = {
            'ADMIN': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
            'STAFF': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'STUDENT': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
        };
        return colors[profile.role] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 px-6 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-700">
                            {getInitials()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{profile.fullName || 'Student'}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge()}`}>
                  {profile.role}
                </span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-xs font-medium">
                  Active
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {editMode ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                        placeholder="08012345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matriculation Number</label>
                                    <input
                                        type="text"
                                        value={profile.matriculationNumber}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-gray-500 dark:text-gray-400"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Matriculation number cannot be changed</p>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        fetchProfile();
                                    }}
                                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.fullName || 'Not set'}</p>
                                </div>
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.email}</p>
                                </div>
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.phone || 'Not set'}</p>
                                </div>
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Matriculation Number</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.matriculationNumber}</p>
                                </div>
                            </div>

                            {/* Quick Stats with Real Data */}
                            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Activities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.appointments}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Appointments</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total booked</p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.queueTickets}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Queue Tickets</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Active tickets</p>
                                    </div>
                                    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.documents}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Requested</p>
                                    </div>
                                    <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.completed}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Appointments + Tickets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            toast.success('Logged out successfully');
                            window.location.href = '/login';
                        }}
                        className="bg-red-600 dark:bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                    <button
                        onClick={() => {
                            toast.info('Change password feature coming soon!');
                        }}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;