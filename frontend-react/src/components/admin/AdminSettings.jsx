import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

function AdminSettings() {
    const { darkMode, toggleDarkMode } = useTheme();
    const [settings, setSettings] = useState({
        siteName: 'UniFlow',
        enableRegistration: true,
        enableAppointments: true,
        enableQueue: true,
        enableDocuments: true,
        maintenanceMode: false,
        maxAppointmentsPerDay: 50,
        defaultSlotDuration: 30,
        workingHoursStart: '09:00',
        workingHoursEnd: '17:00'
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Settings saved successfully!');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            setSettings({
                siteName: 'UniFlow',
                enableRegistration: true,
                enableAppointments: true,
                enableQueue: true,
                enableDocuments: true,
                maintenanceMode: false,
                maxAppointmentsPerDay: 50,
                defaultSlotDuration: 30,
                workingHoursStart: '09:00',
                workingHoursEnd: '17:00'
            });
            toast.success('Settings reset to default');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Configure system-wide settings and preferences.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    {/* General Settings */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Settings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Name</label>
                                <input
                                    type="text"
                                    name="siteName"
                                    value={settings.siteName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Slot Duration (minutes)</label>
                                <input
                                    type="number"
                                    name="defaultSlotDuration"
                                    value={settings.defaultSlotDuration}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                    min="15"
                                    max="120"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Working Hours</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Time</label>
                                <input
                                    type="time"
                                    name="workingHoursStart"
                                    value={settings.workingHoursStart}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Time</label>
                                <input
                                    type="time"
                                    name="workingHoursEnd"
                                    value={settings.workingHoursEnd}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature Toggles */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Settings</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Registration</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow new user registration</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, enableRegistration: !settings.enableRegistration })}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                        settings.enableRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          settings.enableRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Appointments</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable appointment booking</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, enableAppointments: !settings.enableAppointments })}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                        settings.enableAppointments ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          settings.enableAppointments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Queue System</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable virtual queue system</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, enableQueue: !settings.enableQueue })}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                        settings.enableQueue ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          settings.enableQueue ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700 dark:text-gray-300">Documents</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable document requests</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, enableDocuments: !settings.enableDocuments })}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                        settings.enableDocuments ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          settings.enableDocuments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div>
                                    <p className="font-medium text-red-600 dark:text-red-400">Maintenance Mode</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Put the system in maintenance mode</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                                        settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark/light theme</p>
                            </div>
                            <button
                                type="button"
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

                    {/* Actions */}
                    <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                            Save Settings
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                        >
                            Reset to Default
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

export default AdminSettings;