import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UniFlow
            </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Your Digital Queue, Appointment & Student Service Platform
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Book appointments, join virtual queues, track documents, and receive notifications - all in one place.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-lg border-2 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Digital Appointments</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Book, reschedule, or cancel appointments with any administrative office. No more long queues!
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Virtual Queue</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Join virtual queues from anywhere. See your position and estimated waiting time in real-time.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Document Tracking</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Request transcripts, attestations, and other documents. Track their status with unique tracking numbers.
                        </p>
                    </div>
                </div>

                {/* Rest of the component with dark mode classes... */}
                {/* Stats Section */}
                <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <p className="text-4xl font-bold">500+</p>
                            <p className="mt-1 text-blue-100">Students Served</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">1,200+</p>
                            <p className="mt-1 text-blue-100">Appointments Booked</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">300+</p>
                            <p className="mt-1 text-blue-100">Documents Processed</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold">98%</p>
                            <p className="mt-1 text-blue-100">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Get Started?</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Join thousands of students using UniFlow to manage their administrative tasks.</p>
                    <div className="mt-6">
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-16 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 UniFlow. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;