import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { dateTimestamp, formatDateTime } from '../utils/date';

const completedStatuses = {
    queue: ['COMPLETED', 'SKIPPED'],
    appointment: ['COMPLETED', 'CANCELLED'],
    document: ['COMPLETED', 'REJECTED']
};

function History() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const [queues, appointments, documents] = await Promise.all([
                    api.get('/queues/my-tickets'),
                    api.get('/appointments/my-appointments'),
                    api.get('/documents/my-requests')
                ]);
                const history = [
                    ...(queues.data || []).filter(item => completedStatuses.queue.includes(item.status)).map(item => ({ ...item, kind: 'Queue', label: item.ticketNumber, detail: item.officeName })),
                    ...(appointments.data || []).filter(item => completedStatuses.appointment.includes(item.status)).map(item => ({ ...item, kind: 'Appointment', label: item.referenceNumber, detail: `${item.officeName} · ${item.serviceName}` })),
                    ...(documents.data || []).filter(item => !['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(item.status)).map(item => ({ ...item, kind: 'Document', label: item.trackingNumber, detail: `${item.officeName} · ${item.documentType.replaceAll('_', ' ')}` }))
                ].sort((left, right) => dateTimestamp(right.updatedAt || right.createdAt) - dateTimestamp(left.updatedAt || left.createdAt));
                setItems(history);
            } catch (error) {
                toast.error('Failed to load request history');
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) return <div className="py-12 text-center text-gray-500">Loading history...</div>;

    return (
        <div className="user-page">
            <h1 className="user-page-title">Request History</h1>
            <div className="user-card">
                {items.length === 0 ? <p className="py-8 text-center text-gray-500 dark:text-gray-400">No completed requests yet.</p> : (
                    <div className="space-y-3">
                        {items.map(item => (
                            <div key={`${item.kind}-${item.id}`} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 py-4 last:border-0 dark:border-gray-700">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{item.kind} · {item.label}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.detail}</p>
                                    <p className="text-xs text-gray-500">Updated {formatDateTime(item.updatedAt || item.createdAt)}</p>
                                </div>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-200">{item.status.replaceAll('_', ' ')}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;
