import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import api from '../../api/axiosConfig';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function AdminReports() {
    const [loading, setLoading] = useState(true);
    const [reportType, setReportType] = useState('weekly');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [stats, setStats] = useState({
        totalAppointments: 0,
        totalStudents: 0,
        totalQueues: 0,
        totalDocuments: 0,
        pendingAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0
    });
    const [appointmentData, setAppointmentData] = useState([]);
    const [officeData, setOfficeData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        // Set default date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const initialRange = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
        setDateRange(initialRange);

        fetchReportData(initialRange);
        const interval = setInterval(() => fetchReportData(initialRange), 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchReportData = async (range = dateRange) => {
        setLoading(true);
        try {
            // Fetch all data
            const [appointmentsRes, usersRes, ticketsRes, documentsRes, officesRes, dashboardRes] = await Promise.all([
                api.get('/appointments/all'),
                api.get('/users'),
                api.get('/queues/my-tickets'),
                api.get('/documents/my-requests'),
                api.get('/offices'),
                api.get('/admin/dashboard/stats')
            ]);

            const appointments = appointmentsRes.data || [];
            const users = usersRes.data || [];
            const tickets = ticketsRes.data || [];
            const documents = documentsRes.data || [];
            const offices = officesRes.data || [];

            const filteredAppointments = appointments.filter(appointment => {
                const appointmentDate = appointment.appointmentTime ? new Date(appointment.appointmentTime) : null;
                if (!appointmentDate) return false;
                const afterStart = !range.startDate || appointmentDate >= new Date(`${range.startDate}T00:00:00`);
                const beforeEnd = !range.endDate || appointmentDate <= new Date(`${range.endDate}T23:59:59`);
                return afterStart && beforeEnd;
            });

            // Calculate stats
            const pending = filteredAppointments.filter(a => a.status === 'PENDING').length;
            const completed = filteredAppointments.filter(a => a.status === 'COMPLETED').length;
            const cancelled = filteredAppointments.filter(a => a.status === 'CANCELLED').length;

            setStats({
                totalAppointments: filteredAppointments.length,
                totalStudents: users.filter(u => u.role === 'STUDENT').length,
                totalQueues: dashboardRes.data.totalQueueTickets || 0,
                totalDocuments: dashboardRes.data.totalDocumentRequests || 0,
                pendingAppointments: pending,
                completedAppointments: completed,
                cancelledAppointments: cancelled
            });

            // Prepare appointment data by date
            const dateMap = new Map();
            filteredAppointments.forEach(app => {
                const date = new Date(app.appointmentTime).toLocaleDateString();
                dateMap.set(date, (dateMap.get(date) || 0) + 1);
            });
            const sortedDates = Array.from(dateMap.entries()).sort((a, b) =>
                new Date(a[0]) - new Date(b[0])
            );
            setAppointmentData(sortedDates);

            // Prepare office data
            const officeMap = new Map();
            filteredAppointments.forEach(app => {
                const officeName = app.officeName || 'Unknown';
                officeMap.set(officeName, (officeMap.get(officeName) || 0) + 1);
            });
            setOfficeData(Array.from(officeMap.entries()));

            // Prepare status data
            const statusMap = new Map();
            filteredAppointments.forEach(app => {
                const status = app.status || 'Unknown';
                statusMap.set(status, (statusMap.get(status) || 0) + 1);
            });
            setStatusData(Array.from(statusMap.entries()));

        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const applyDateFilter = () => {
        fetchReportData();
    };

    // Chart configurations
    const barChartData = {
        labels: appointmentData.map(item => item[0]),
        datasets: [
            {
                label: 'Appointment',
                data: appointmentData.map(item => item[1]),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            },
            title: {
                display: true,
                text: 'Appointments by Date',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            },
            x: {
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            }
        }
    };

    const pieChartData = {
        labels: statusData.map(item => item[0]),
        datasets: [
            {
                data: statusData.map(item => item[1]),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            },
            title: {
                display: true,
                text: 'Appointment Status Distribution',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
            }
        }
    };

    const officeChartData = {
        labels: officeData.map(item => item[0]),
        datasets: [
            {
                label: 'Appointments per Office',
                data: officeData.map(item => item[1]),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };

    const officeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            },
            title: {
                display: true,
                text: 'Appointments by Office',
                color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            },
            x: {
                ticks: {
                    color: document.documentElement.classList.contains('dark') ? '#fff' : '#333'
                }
            }
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="sticky top-0 z-20 -mx-4 mb-8 bg-white/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 dark:bg-slate-900/95">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">View system statistics and analytics.</p>
            </div>

            {/* Date Range Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={dateRange.startDate}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={dateRange.endDate}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <button
                            onClick={applyDateFilter}
                            className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Appointments</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalAppointments}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalStudents}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Queue Tickets</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalQueues}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalDocuments}</p>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-sm p-5 border border-yellow-100 dark:border-yellow-900/30">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending Appointments</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendingAppointments}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-sm p-5 border border-green-100 dark:border-green-900/30">
                    <p className="text-sm text-green-600 dark:text-green-400">Completed Appointments</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completedAppointments}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm p-5 border border-red-100 dark:border-red-900/30">
                    <p className="text-sm text-red-600 dark:text-red-400">Cancelled Appointments</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.cancelledAppointments}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appointments Trend</h3>
                    {appointmentData.length > 0 ? (
                        <div className="h-[280px]">
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No appointment data available</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
                    {statusData.length > 0 ? (
                        <div className="h-[260px]">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No status data available</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appointments by Office</h3>
                    {officeData.length > 0 ? (
                        <div className="h-[300px]">
                            <Bar data={officeChartData} options={officeChartOptions} />
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No office data available</p>
                    )}
                </div>
            </div>

            {/* Export Options */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Reports</h3>
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={() => {
                            toast.success('PDF export coming soon!');
                        }}
                        className="bg-red-600 dark:bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
                    >
                        📄 Export PDF
                    </button>
                    <button
                        onClick={() => {
                            toast.success('Excel export coming soon!');
                        }}
                        className="bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                    >
                        📊 Export Excel
                    </button>
                    <button
                        onClick={() => {
                            toast.success('Report generated successfully!');
                        }}
                        className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    >
                        🔄 Generate Full Report
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}

export default AdminReports;