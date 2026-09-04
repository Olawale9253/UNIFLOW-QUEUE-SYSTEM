import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import UserAvatar from '../components/common/UserAvatar';

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
        matriculationNumber: user?.matriculationNumber || '',
        profileImageUrl: user?.profileImageUrl || '',
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
                matriculationNumber: data.matriculationNumber || '',
                profileImageUrl: data.profileImageUrl || '',
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
                    phone: profile.phone,
                    matriculationNumber: profile.matriculationNumber,
                    profileImageUrl: profile.profileImageUrl
                }
            });
            toast.success('Profile updated successfully');
            setEditMode(false);

            const updatedUser = { ...user, ...profile };
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
        <div className="user-page">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="user-page-title mb-0">My Profile</h1>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="btn-primary"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="user-card mx-auto max-w-4xl overflow-hidden p-0">
                {/* Profile Header */}
                <div className="relative overflow-hidden bg-white px-6 py-8 shadow-medium dark:bg-white">
                    <div className="absolute inset-y-0 right-0 w-1/3 bg-blue-600/20 [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
                    <div className="flex items-center space-x-4">
                        <UserAvatar user={{ ...user, ...profile }} size="lg" className="rounded-xl bg-blue-500 ring-4 ring-blue-500/10" />
                        <div>
                            <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold">Student workspace</p>
                            <h2 className="text-2xl font-bold text-black">{profile.fullName || 'Student'}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge()}`}>
                  {profile.role}
                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-5 sm:p-6">
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
                                        className="input"
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
                                        className="input"
                                        placeholder="08012345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="input cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Matriculation Number</label>
                                    <input
                                        type="text"
                                        name="matriculationNumber"
                                        value={profile.matriculationNumber}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Enter matriculation number"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
                                    <input
                                        type="url"
                                        name="profileImageUrl"
                                        value={profile.profileImageUrl}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="https://example.com/profile-image.jpg"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-4">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="btn-primary disabled:opacity-50"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        fetchProfile();
                                    }}
                                    className="btn-secondary"
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
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.phone || 'Not provided'}</p>
                                </div>
                                <div className="border-b dark:border-gray-700 pb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Matriculation Number</p>
                                    <p className="text-lg font-medium text-gray-900 dark:text-white">{profile.matriculationNumber || 'Not provided'}</p>
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
            <div className="user-card mx-auto mt-6 max-w-4xl">
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