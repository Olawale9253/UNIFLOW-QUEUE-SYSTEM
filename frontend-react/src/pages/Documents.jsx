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

    const documentTypes = [
        'TRANSCRIPT',
        'ATTESTATION',
        'VERIFICATION_LETTER',
        'ID_CARD',
        'CERTIFICATE',
        'HANDOUT',
        'OTHER'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [documentsRes, officesRes] = await Promise.all([
                api.get('/documents/my-requests'),
                api.get('/offices/active')
            ]);
            setDocuments(documentsRes.data);
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

    const getStatusColor = (status) => {
        const colors = {
            'SUBMITTED': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
            'UNDER_REVIEW': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'PROCESSING': 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
            'READY_FOR_COLLECTION': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
            'COMPLETED': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
            'REJECTED': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
        };
        return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'SUBMITTED': '📤',
            'UNDER_REVIEW': '🔍',
            'PROCESSING': '⚙️',
            'READY_FOR_COLLECTION': '📋',
            'COMPLETED': '✅',
            'REJECTED': '❌'
        };
        return icons[status] || '📄';
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
                            disabled={submitting}
                            className="btn-primary w-full disabled:opacity-50"
                        >
                            {submitting ? 'Requesting...' : 'Request Document'}
                        </button>
                    </form>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Track Document */}
                    <div className="user-card">
                        <h2 className="user-card-title">Track Document</h2>
                        <form onSubmit={handleTrack} className="flex gap-4">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="input"
                            />
                            <button
                                type="submit"
                                className="btn-success px-6"
                            >
                                Track
                            </button>
                        </form>

                        {trackedDocument && (
                            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {getStatusIcon(trackedDocument.status)} {trackedDocument.documentType}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Office: {trackedDocument.officeName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tracking: {trackedDocument.trackingNumber}</p>
                                        {trackedDocument.comments && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Comments: {trackedDocument.comments}</p>
                                        )}
                                    </div>
                                    <div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(trackedDocument.status)}`}>
                      {trackedDocument.status}
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
                                    <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {getStatusIcon(doc.status)} {doc.documentType}
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
                                            <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                          {doc.status}
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