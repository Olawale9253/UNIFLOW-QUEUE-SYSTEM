import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            navigate('/login');
            return;
        }

        // Verify token is valid
        const verifyToken = async () => {
            try {
                await api.get(`/auth/verify-reset-token?token=${token}`);
                setValidToken(true);
            } catch (error) {
                toast.error('Invalid or expired reset link');
                navigate('/login');
            } finally {
                setChecking(false);
            }
        };

        verifyToken();
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: password
            });
            toast.success('Password reset successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Verifying reset link...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
            <p className="text-gray-600 text-center mb-6">
                Enter your new password below.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                        required
                        minLength="6"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                        required
                        minLength="6"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
            </p>
        </div>
    );
}

export default ResetPassword;