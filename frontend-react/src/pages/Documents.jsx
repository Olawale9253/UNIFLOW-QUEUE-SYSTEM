import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Documents() {
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [comments, setComments] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackedDocument, setTrackedDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [queueBlocked, setQueueBlocked] = useState(false);

    const documentTypes = [
        'TRANSCRIPT',
        'ATTESTATION',
        'VERIFICATION_LETTER',
        'ID_CARD',
        'CERTIFICATE',
        'HANDOUT',
        'OTHER'
    ];

    const getStatusColor = (status) => {
        const colors = {
            SUBMITTED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
            UNDER_REVIEW: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200',
            PROCESSING: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
            READY_FOR_COLLECTION: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
            COMPLETED: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
            REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
        };
        return colors[status] || colors.COMPLETED;
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [documentsRes, officesRes, queuesRes] = await Promise.all([
                api.get('/documents/my-requests'),
                api.get('/offices/active'),
                api.get('/queues/my-tickets')
            ]);
            setDocuments((documentsRes.data || []).filter(document =>
                ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(document.status)
            ));
            setQueueBlocked((queuesRes.data || []).some(ticket =>
                ticket.status === 'CALLED' || (ticket.status === 'WAITING' && ticket.position <= 2)
            ));
            const uniqueOffices = Array.from(
                new Map(officesRes.data.map(office => [office.id, office])).values()
            );
            setOffices(uniqueOffices);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOffice || !documentType) {
            toast.error('Please select an office and document type');
            return;
        }

        if (queueBlocked) {
            toast.error('Your queue turn is near. Please complete it before making another request.');
            return;
        }

        const hasActiveDocument = documents.some(document =>
            document.officeName === offices.find(office => String(office.id) === selectedOffice)?.name
            && document.documentType === documentType
            && !['COMPLETED', 'REJECTED'].includes(document.status)
        );
        if (hasActiveDocument) {
            toast.error('You already have an active request for this office and document type.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/documents/request', {
                officeId: parseInt(selectedOffice),
                documentType: documentType,
                comments: comments
            });
            toast.success(`Document requested! Tracking: ${response.data.trackingNumber}`);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to request document');
        } finally {
            setSubmitting(false);
        }
    };

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackingNumber) {
            toast.error('Please enter a tracking number');
            return;
        }

        try {
            const response = await api.get(`/documents/track/${trackingNumber}`);
            setTrackedDocument(response.data);
            toast.success('Document found!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Document not found');
            setTrackedDocument(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-page">
            <h1 className="user-page-title">Document Requests</h1>

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                {/* Request Document Form */}
                <div className="user-card self-start lg:sticky lg:top-24 lg:col-span-1">
                    <h2 className="user-card-title">Request Document</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office *</label>
                            <select
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                                className="input"
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Type *</label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="input"
                                required
                            >
                                <option value="">Select Type</option>
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comments</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="input"
                                rows="3"
                                placeholder="Additional comments..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || queueBlocked}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {queueBlocked ? 'Queue turn is near' : submitting ? 'Requesting...' : 'Request Document'}
                        </button>
                        {queueBlocked && (
                            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                Complete your current queue turn before making another request.
                            </p>
                        )}
                    </form>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Track Document */}
                    <div className="user-card self-start lg:sticky lg:top-24">
                        <h2 className="user-card-title">Track Document</h2>
                        <form onSubmit={handleTrack} className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="input"
                            />
                            <button
                                type="submit"
                                className="btn-success px-6 sm:shrink-0"
                            >
                                Track
                            </button>
                        </form>

                        {trackedDocument && (
                            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {trackedDocument.documentType}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Office: {trackedDocument.officeName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tracking: {trackedDocument.trackingNumber}</p>
                                        {trackedDocument.comments && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Comments: {trackedDocument.comments}</p>
                                        )}
                                    </div>
                                                                        <div className="shrink-0">
                                                                                <span className={`inline-flex min-h-7 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold tracking-wide ${getStatusColor(trackedDocument.status)}`}>
                                                                                        {trackedDocument.status.replaceAll('_', ' ')}
                                                                                </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* My Requests */}
                    <div className="user-card">
                        <h2 className="user-card-title">My Requests</h2>
                        {documents.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">No document requests</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Request a document to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="rounded-xl border border-slate-200/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft dark:border-slate-800 dark:hover:border-blue-900">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {doc.documentType}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Office: {doc.officeName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Tracking: {doc.trackingNumber}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Requested: {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                                {doc.comments && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments: {doc.comments}</p>
                                                )}
                                            </div>
                                                                                        <div className="shrink-0">
                                                                                                <span className={`inline-flex min-h-7 items-center justify-center rounded-full px-3 py-1 text-center text-xs font-semibold tracking-wide ${getStatusColor(doc.status)}`}>
                                                                                                        {doc.status.replaceAll('_', ' ')}
                                                                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Documents;