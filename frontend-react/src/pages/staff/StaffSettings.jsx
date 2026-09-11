import React, { useState } from 'react';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import api from '../../api/axiosConfig';

function StaffSettings() {
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