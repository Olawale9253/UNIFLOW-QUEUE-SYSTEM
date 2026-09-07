import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

function StaffSettings() {
    const { darkMode, toggleDarkMode } = useTheme();
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

    const changePassword = async (event) => {
        event.preventDefault();
        try {
            await api.put('/users/change-password', passwords);
            setPasswords({ currentPassword: '', newPassword: '' });
            toast.success('Password changed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to change password');
        }
    };

    return (
        <StaffLayout>
            <div className="user-page max-w-4xl">
                <h1 className="user-page-title mb-6">Settings</h1>
                <div className="space-y-6">
                    <section className="card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Theme</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-700 dark:text-slate-200">Dark mode</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Use a darker workspace theme.</p>
                            </div>
                            <button type="button" onClick={toggleDarkMode} aria-label="Toggle dark mode" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </section>
                    <form onSubmit={changePassword} className="card p-6">
                        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Change password</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <input type="password" placeholder="Current password" value={passwords.currentPassword} onChange={event => setPasswords({ ...passwords, currentPassword: event.target.value })} className="rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" required />
                            <input type="password" placeholder="New password" value={passwords.newPassword} onChange={event => setPasswords({ ...passwords, newPassword: event.target.value })} className="rounded-lg border p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white" minLength={6} required />
                        </div>
                        <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Update password</button>
                    </form>
                </div>
            </div>
        </StaffLayout>
    );
}

export default StaffSettings;