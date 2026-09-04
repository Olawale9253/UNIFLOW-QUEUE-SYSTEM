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
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, you would save to backend here
            // await api.put('/admin/settings', settings);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
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

    const ToggleSwitch = ({ enabled, onChange, label, description }) => (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
            </button>
        </div>
    );

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
                                    placeholder="Enter site name"
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
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Appointments Per Day</label>
                            <input
                                type="number"
                                name="maxAppointmentsPerDay"
                                value={settings.maxAppointmentsPerDay}
                                onChange={handleChange}
                                className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                min="1"
                                max="500"
                            />
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
                        <div className="space-y-4">
                            <ToggleSwitch
                                enabled={settings.enableRegistration}
                                onChange={() => setSettings({ ...settings, enableRegistration: !settings.enableRegistration })}
                                label="Registration"
                                description="Allow new student registration"
                            />

                            <ToggleSwitch
                                enabled={settings.enableAppointments}
                                onChange={() => setSettings({ ...settings, enableAppointments: !settings.enableAppointments })}
                                label="Appointments"
                                description="Enable appointment booking"
                            />

                            <ToggleSwitch
                                enabled={settings.enableQueue}
                                onChange={() => setSettings({ ...settings, enableQueue: !settings.enableQueue })}
                                label="Queue System"
                                description="Enable virtual queue system"
                            />

                            <ToggleSwitch
                                enabled={settings.enableDocuments}
                                onChange={() => setSettings({ ...settings, enableDocuments: !settings.enableDocuments })}
                                label="Documents"
                                description="Enable document requests"
                            />

                            <ToggleSwitch
                                enabled={settings.maintenanceMode}
                                onChange={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                label="Maintenance Mode"
                                description="Put the system in maintenance mode"
                            />
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                        <ToggleSwitch
                            enabled={darkMode}
                            onChange={toggleDarkMode}
                            label="Dark Mode"
                            description="Toggle dark/light theme"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                        >
                            Reset to Default
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                toast.info('Export settings feature coming soon!');
                            }}
                            className="bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                        >
                            Export Settings
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

export default AdminSettings;