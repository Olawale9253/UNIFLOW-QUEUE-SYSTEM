import React, { useState } from 'react';

function UserAvatar({ user, size = 'md', fallback = 'U', className = '' }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = user?.profileImageUrl || user?.profileImage || user?.avatarUrl || user?.imageUrl;
    const sizes = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-sm',
        lg: 'h-20 w-20 text-3xl',
        xl: 'h-24 w-24 text-4xl'
    };
    const initials = user?.fullName?.trim()
        ? user.fullName.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase()
        : fallback;

    return (
        <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 font-semibold text-white shadow-md ${sizes[size] || sizes.md} ${className}`}>
            {imageUrl && !imageFailed ? (
                <img
                    src={imageUrl}
                    alt={`${user?.fullName || 'User'} profile`}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                initials
            )}
        </div>
    );
}

export default UserAvatar;
