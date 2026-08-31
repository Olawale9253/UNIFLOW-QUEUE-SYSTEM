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
            // Get appointments count
            const appointmentsRes = await api.get('/appointments/my-appointments');
            const appointments = appointmentsRes.data || [];

            // Get queue tickets count
            const ticketsRes = await api.get('/queues/my-tickets');
            const tickets = ticketsRes.data || [];

            // Get documents count
            const documentsRes = await api.get('/documents/my-requests');
            const documents = documentsRes.data || [];

            // Count completed items
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

            // Update user in localStorage
            const updatedUser = { ...user, fullName: profile.fullName, phone: profile.phone };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Refresh profile
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

    // Get initials for avatar
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

    if (loading) {
        return <div className="text-center py-8">Loading profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Profile</h1>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                            {getInitials()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{profile.fullName || 'Student'}</h2>
                            <p className="text-blue-100">{profile.role}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {editMode ? (
                        // Edit Mode
                        <form onSubmit={handleUpdateProfile}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="08012345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Matriculation Number</label>
                                    <input
                                        type="text"
                                        value={profile.matriculationNumber}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Matriculation number cannot be changed</p>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        fetchProfile();
                                    }}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Mode
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="text-lg font-medium">{profile.fullName || 'Not set'}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg font-medium">{profile.email}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="text-lg font-medium">{profile.phone || 'Not set'}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Matriculation Number</p>
                                    <p className="text-lg font-medium">{profile.matriculationNumber}</p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-lg font-medium">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {profile.role}
                    </span>
                                    </p>
                                </div>
                                <div className="border-b pb-4">
                                    <p className="text-sm text-gray-500">Account Status</p>
                                    <p className="text-lg font-medium">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Active
                    </span>
                                    </p>
                                </div>
                            </div>

                            {/* Quick Stats with Real Data */}
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="text-lg font-semibold mb-4">My Activities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-blue-600">{stats.appointments}</p>
                                        <p className="text-sm text-gray-600">Appointments</p>
                                        <p className="text-xs text-gray-400 mt-1">Total booked</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-green-600">{stats.queueTickets}</p>
                                        <p className="text-sm text-gray-600">Queue Tickets</p>
                                        <p className="text-xs text-gray-400 mt-1">Active tickets</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-purple-600">{stats.documents}</p>
                                        <p className="text-sm text-gray-600">Documents</p>
                                        <p className="text-xs text-gray-400 mt-1">Requested</p>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4 text-center hover:shadow-md transition cursor-pointer">
                                        <p className="text-2xl font-bold text-yellow-600">{stats.completed}</p>
                                        <p className="text-sm text-gray-600">Completed</p>
                                        <p className="text-xs text-gray-400 mt-1">Appointments + Tickets</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-red-600 mb-4">Account Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            toast.success('Logged out successfully');
                            window.location.href = '/login';
                        }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                    <button
                        onClick={() => {
                            toast.info('Change password feature coming soon!');
                        }}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                        className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-100 transition"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;