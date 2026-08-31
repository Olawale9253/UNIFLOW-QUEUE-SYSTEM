import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                        Welcome to{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UniFlow
            </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Your Digital Queue, Appointment & Student Service Platform
                    </p>
                    <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
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
                            className="px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Digital Appointments</h3>
                        <p className="mt-2 text-gray-600">
                            Book, reschedule, or cancel appointments with any administrative office. No more long queues!
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Virtual Queue</h3>
                        <p className="mt-2 text-gray-600">
                            Join virtual queues from anywhere. See your position and estimated waiting time in real-time.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Document Tracking</h3>
                        <p className="mt-2 text-gray-600">
                            Request transcripts, attestations, and other documents. Track their status with unique tracking numbers.
                        </p>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">1</div>
                            <h4 className="mt-3 font-semibold text-gray-900">Register</h4>
                            <p className="text-sm text-gray-600">Create your account with your matriculation number</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">2</div>
                            <h4 className="mt-3 font-semibold text-gray-900">Book or Queue</h4>
                            <p className="text-sm text-gray-600">Book an appointment or join a virtual queue</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">3</div>
                            <h4 className="mt-3 font-semibold text-gray-900">Get Notified</h4>
                            <p className="text-sm text-gray-600">Receive reminders before your turn or appointment</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">4</div>
                            <h4 className="mt-3 font-semibold text-gray-900">Track Progress</h4>
                            <p className="text-sm text-gray-600">Monitor your requests and document status</p>
                        </div>
                    </div>
                </div>

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
                    <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
                    <p className="mt-2 text-gray-600">Join thousands of students using UniFlow to manage their administrative tasks.</p>
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
            <footer className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500">© 2026 UniFlow. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;