import React from 'react';

function PasswordStrength({ password }) {
    const getStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (pass.length >= 10) score++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
        if (/\d/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;
        return score;
    };

    const getStrengthLabel = (score) => {
        if (score <= 1) return { label: 'Weak', color: 'text-red-500' };
        if (score <= 2) return { label: 'Fair', color: 'text-orange-500' };
        if (score <= 3) return { label: 'Good', color: 'text-yellow-500' };
        if (score <= 4) return { label: 'Strong', color: 'text-blue-500' };
        return { label: 'Very Strong', color: 'text-green-500' };
    };

    const getStrengthColor = (score) => {
        if (score <= 1) return 'bg-red-500';
        if (score <= 2) return 'bg-orange-500';
        if (score <= 3) return 'bg-yellow-500';
        if (score <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    if (!password) return null;

    const score = getStrength(password);
    const strength = getStrengthLabel(score);
    const width = (score / 5) * 100;

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Password Strength:</span>
                <span className={`text-sm font-medium ${strength.color}`}>{strength.label}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${getStrengthColor(score)}`}
                    style={{ width: `${width}%` }}
                />
            </div>
            <ul className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <li className={password.length >= 6 ? 'text-green-500' : ''}>
                    {password.length >= 6 ? '✓' : '○'} At least 6 characters
                </li>
                <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-500' : ''}>
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'} Uppercase & lowercase letters
                </li>
                <li className={/\d/.test(password) ? 'text-green-500' : ''}>
                    {/\d/.test(password) ? '✓' : '○'} At least one number
                </li>
                <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-500' : ''}>
                    {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} At least one special character
                </li>
            </ul>
        </div>
    );
}

export default PasswordStrength;