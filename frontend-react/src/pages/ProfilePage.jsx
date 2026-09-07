import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/users/profile', { fullName, phone });
            toast.success('Profile updated successfully');
            // Update user in localStorage
            const updatedUser = { ...user, fullName, phone };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                </div>
                <div className="mb-6">
                    <p className="text-sm text-gray-600">Matriculation Number</p>
                    <p className="font-medium">{user?.matriculationNumber || 'Not set'}</p>
                </div>
                <div className="mb-6">
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium">{user?.role || 'STUDENT'}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;