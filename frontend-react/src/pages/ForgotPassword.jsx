import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
                    <div className="text-green-500 dark:text-green-400 text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Check Your Email</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Please check your email and follow the instructions to reset your password.
                    </p>
                    <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Forgot Password</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                            placeholder="Enter your registered email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Remember your password? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;