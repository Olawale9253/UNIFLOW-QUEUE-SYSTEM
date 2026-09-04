import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Settings() {
    const { user } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        appointmentReminders: true,
        queueUpdates: true,
        documentUpdates: true,
        promotionalEmails: false
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationChange = (key) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const saveNotificationSettings = async () => {
        try {
            // Save to backend (you'll need to add this endpoint)
            await api.put('/users/notification-settings', notificationSettings);
            toast.success('Notification settings saved!');
        } catch (error) {
            toast.error('Failed to save notification settings');
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
            if (window.confirm('Really? All your data will be permanently deleted.')) {
                toast.error('Account deletion is not available yet. Please contact support.');
            }
        }
    };

    return (
        <div className="user-page max-w-4xl pt-20 sm:pt-24">
            <h1 className="user-page-title sticky top-16 z-20 bg-slate-50/95 py-4 backdrop-blur-sm dark:bg-slate-950/95">Settings</h1>

            <div className="space-y-6">
                {/* Appearance Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="sticky top-[8.5rem] z-10 -mx-6 mb-4 bg-white px-6 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">Appearance</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
              <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="sticky top-[8.5rem] z-10 -mx-6 mb-4 bg-white px-6 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">Change Password</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notification Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="sticky top-[8.5rem] z-10 -mx-6 mb-4 bg-white px-6 py-2 text-xl font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">Notification Preferences</h2>
                    <div className="space-y-3">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                            { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminders before your appointments' },
                            { key: 'queueUpdates', label: 'Queue Updates', desc: 'Get updates when your queue position changes' },
                            { key: 'documentUpdates', label: 'Document Updates', desc: 'Get updates when document status changes' },
                            { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Receive promotional offers and updates' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                                </div>
                                <button
                                    onClick={() => handleNotificationChange(key)}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none flex-shrink-0 ${
                                        notificationSettings[key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          notificationSettings[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={saveNotificationSettings}
                        className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                        Save Notification Settings
                    </button>
                </div>

                {/* Account Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="sticky top-[8.5rem] z-10 -mx-6 mb-4 bg-white px-6 py-2 text-xl font-semibold text-red-600 dark:bg-gray-800 dark:text-red-400">Account Management</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Export Data</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Download all your personal data</p>
                            </div>
                            <button
                                onClick={() => toast.success('Data export feature coming soon!')}
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                            >
                                Export
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;