import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import UserAvatar from '../../components/common/UserAvatar';
import ProfileImagePicker from '../../components/common/ProfileImagePicker';

function AdminProfile() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [profile, setProfile] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        profileImageUrl: user?.profileImageUrl || '',
        role: user?.role || 'ADMIN'
    });

    useEffect(() => {
        fetchProfile();
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
                profileImageUrl: data.profileImageUrl || '',
                role: data.role || 'ADMIN'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await api.put('/users/profile', {
                fullName: profile.fullName,
                phone: profile.phone,
                profileImageUrl: profile.profileImageUrl
            });
            toast.success('Profile updated successfully');
            setEditMode(false);

            updateUser(profile);

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
        return 'A';
    };

    const getRoleBadge = () => {
        const colors = {
            'ADMIN': 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300',
            'STAFF': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
            'STUDENT': 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
        };
        return colors[profile.role] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                    <h1 className="user-page-title mb-0">Admin Profile</h1>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="card overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-primary border-b border-slate-200 px-8 py-8 dark:border-slate-800">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <UserAvatar user={{ ...user, ...profile }} size="xl" />
                            <div className="min-w-0 text-left">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.fullName || 'Admin'}</h2>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge()}`}>
                                        {profile.role}
                                    </span>
                                    <span className="badge badge-success">
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
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="min-w-0 text-left">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profile.fullName}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            className="input"
                                            placeholder="08012345678"
                                        />
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            className="input cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div className="min-w-0 text-left">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={profile.role}
                                            className="input cursor-not-allowed bg-slate-100 text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400"
                                            disabled
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Role cannot be changed</p>
                                    </div>
                                    <div className="min-w-0 text-left md:col-span-2">
                                        <ProfileImagePicker
                                            value={profile.profileImageUrl}
                                            onChange={(profileImageUrl) => setProfile(prev => ({ ...prev, profileImageUrl }))}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-4">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50 font-medium"
                                    >
                                        {updating ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            fetchProfile();
                                        }}
                                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                        <p className="break-words text-lg font-medium text-slate-900 dark:text-white">{profile.fullName || 'Not set'}</p>
                                    </div>
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="break-words text-lg font-medium text-slate-900 dark:text-white">{profile.email}</p>
                                    </div>
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                                        <p className="break-words text-lg font-medium text-slate-900 dark:text-white">{profile.phone || 'Not set'}</p>
                                    </div>
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge()}`}>
                        {profile.role}
                      </span>
                                        </p>
                                    </div>
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                        Active
                      </span>
                                        </p>
                                    </div>
                                    <div className="min-w-0 border-b border-slate-200 pb-4 text-left dark:border-slate-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        Administrator
                      </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Admin Stats */}
                                <div className="mt-8 pt-6 border-t dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Administrator Access</h3>
                                    <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Full</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Access Level</p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">All</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Modules</p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">System</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Management</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Actions */}
                <div className="card mt-6 p-6 text-left">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Account Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                toast.success('Logged out successfully');
                                window.location.href = '/login';
                            }}
                            className="bg-red-600 dark:bg-red-500 text-white px-6 py-2.5 rounded-xl hover:bg-red-700 dark:hover:bg-red-600 transition font-medium"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => {
                                toast.info('Change password feature coming soon!');
                            }}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                        >
                            Change Password
                        </button>
                        <button
                            onClick={() => {
                                window.location.reload();
                            }}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-6 py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition font-medium"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminProfile;