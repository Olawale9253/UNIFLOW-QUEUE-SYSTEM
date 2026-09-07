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

        const image = new Image();
        const reader = new FileReader();
        reader.onload = () => {
            image.onload = () => {
                const maxDimension = 800;
                const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(image.width * scale));
                canvas.height = Math.max(1, Math.round(image.height * scale));
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
                onChange(canvas.toDataURL('image/jpeg', 0.8));
            };
            image.src = reader.result;
        };
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