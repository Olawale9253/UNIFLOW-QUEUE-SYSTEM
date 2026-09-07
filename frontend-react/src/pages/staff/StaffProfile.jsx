import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import UserAvatar from '../../components/common/UserAvatar';
import ProfileImagePicker from '../../components/common/ProfileImagePicker';

function StaffProfile() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({ fullName: '', phone: '', officeName: '', role: '', profileImageUrl: '' });
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        api.get('/users/profile').then(response => {
            setProfile({ fullName: response.data.fullName || '', phone: response.data.phone || '', officeName: response.data.officeName || '', role: response.data.role || '', profileImageUrl: response.data.profileImageUrl || '' });
            updateUser(response.data);
        }).catch(() => toast.error('Unable to load profile'));
    }, []);

    const updateProfile = async (event) => { event.preventDefault(); setSaving(true); try { const response = await api.put('/users/profile', { fullName: profile.fullName, phone: profile.phone, profileImageUrl: profile.profileImageUrl }); updateUser(response.data); setProfile({ fullName: response.data.fullName || '', phone: response.data.phone || '', officeName: response.data.officeName || '', role: response.data.role || '', profileImageUrl: response.data.profileImageUrl || '' }); toast.success('Profile updated'); } catch (error) { toast.error(error.response?.data?.message || 'Unable to update profile'); } finally { setSaving(false); } };
    return <StaffLayout><div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1><p className="mt-1 text-gray-600 dark:text-gray-400">Keep your staff account details up to date.</p></div><div className="max-w-4xl"><form onSubmit={updateProfile} className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"><div className="mb-6 flex items-center gap-4"><UserAvatar user={{ ...user, ...profile }} size="lg" /><div><h2 className="text-lg font-semibold dark:text-white">Profile details</h2><p className="text-sm text-gray-500 dark:text-gray-400">Your photo appears in the top navigation.</p></div></div><label className="mb-4 block text-sm text-gray-600 dark:text-gray-300">Full name<input value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" required /></label><label className="mb-4 block text-sm text-gray-600 dark:text-gray-300">Phone<input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} className="mt-1 w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></label><div className="mb-5"><ProfileImagePicker value={profile.profileImageUrl} onChange={(profileImageUrl) => setProfile({ ...profile, profileImageUrl })} /></div><p className="mb-2 text-sm text-gray-500">Email: {user?.email}</p><p className="mb-2 text-sm text-gray-600 dark:text-gray-300">Role: {profile.role || user?.role || 'STAFF'}</p><div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-900/20"><p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Assigned office</p><p className="mt-1 font-medium text-gray-900 dark:text-white">{profile.officeName || 'Not assigned'}</p></div><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-white">{saving ? 'Saving...' : 'Update profile'}</button></form></div></StaffLayout>;
}

export default StaffProfile;