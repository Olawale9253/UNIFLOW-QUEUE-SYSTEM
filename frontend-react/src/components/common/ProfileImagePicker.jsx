import React from 'react';
import toast from 'react-hot-toast';

function ProfileImagePicker({ value, onChange }) {
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please choose an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Profile image must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => onChange(reader.result);
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="input" />
            {value && <p className="mt-1 text-xs text-green-600 dark:text-green-400">Image selected. Save changes to apply it.</p>}
        </div>
    );
}

export default ProfileImagePicker;