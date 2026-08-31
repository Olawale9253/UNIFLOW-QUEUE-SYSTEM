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
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-green-600 text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                <p className="text-gray-600 mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                    Please check your email and follow the instructions to reset your password.
                </p>
                <Link to="/login" className="text-blue-600 hover:underline">
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
            <p className="text-gray-600 text-center mb-6">
                Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your registered email"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
                Remember your password? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
        </div>
    );
}

export default ForgotPassword;