import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordStrength from '../components/common/PasswordStrength';
import toast from 'react-hot-toast';
import { useBranding } from '../context/BrandingContext';
import SchoolLogoPlaceholder from '../components/common/SchoolLogoPlaceholder';

function Register() {
  const [formData, setFormData] = useState({
    matriculationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Matriculation Number validation
    if (!formData.matriculationNumber) {
      newErrors.matriculationNumber = 'Matriculation number is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain both uppercase and lowercase letters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation (optional)
    if (formData.phone && !/^[0-9+\-\s()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration submitted. An administrator must approve your account before you can log in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);

      // Handle specific error messages
      if (message.toLowerCase().includes('email')) {
        setErrors({ ...errors, email: 'This email is already registered' });
      } else if (message.toLowerCase().includes('matriculation')) {
        setErrors({ ...errors, matriculationNumber: 'This matriculation number is already registered' });
      } else {
        setErrors({ ...errors, general: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary px-4 py-8 transition-colors duration-300">
        <div className="card w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link to="/">
              {branding.logo ? <img src={branding.logo} alt="School logo" className="mx-auto h-12 w-12 object-contain" /> : <SchoolLogoPlaceholder className="mx-auto h-12 w-12" />}
              <h1 className="gradient-text text-3xl font-black">{branding.schoolName}</h1>
            </Link>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Create your account</p>
          </div>

          {errors.general && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-center text-sm text-red-600 dark:text-red-400">{errors.general}</p>
              </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
              <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`input py-3 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
              />
              {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Matriculation Number *</label>
              <input
                  type="text"
                  name="matriculationNumber"
                  value={formData.matriculationNumber}
                  onChange={handleChange}
                  className={`input py-3 ${
                      errors.matriculationNumber ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your matriculation number"
              />
              {errors.matriculationNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.matriculationNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address *</label>
              <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input py-3 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your email address"
              />
              {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input py-3 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter your phone number"
              />
              {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password *</label>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input py-3 pr-12 ${
                        errors.password ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                  ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
              <PasswordStrength password={formData.password} />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password *</label>
              <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input py-3 pr-12 ${
                        errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 no-underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
  );
}

export default Register;