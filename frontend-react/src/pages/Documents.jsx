import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [comments, setComments] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackedDocument, setTrackedDocument] = useState(null);
    const [loading, setLoading] = useState(true);

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
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const response = await api.post('/documents/request', {
                officeId: parseInt(selectedOffice),
                documentType: documentType,
                comments: comments
            });
            toast.success(`Document requested! Tracking: ${response.data.trackingNumber}`);
            fetchData();
            setSelectedOffice('');
            setDocumentType('');
            setComments('');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to request document');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Document Requests</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Document */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Request Document</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Office</label>
                            <select
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Type</label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
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
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                                rows="3"
                                placeholder="Additional comments..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                            Request Document
                        </button>
                    </form>
                </div>

                {/* My Documents */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Track Document</h2>
                        <form onSubmit={handleTrack} className="flex gap-4">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 dark:bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                            >
                                Track
                            </button>
                        </form>
                        {trackedDocument && (
                            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <p className="font-semibold text-gray-900 dark:text-white">Document: {trackedDocument.documentType}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Office: {trackedDocument.officeName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tracking: {trackedDocument.trackingNumber}</p>
                                <p className="text-sm">
                                    Status: <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(trackedDocument.status)}`}>
                    {trackedDocument.status}
                  </span>
                                </p>
                                {trackedDocument.comments && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Comments: {trackedDocument.comments}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">My Requests</h2>
                        {documents.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No document requests</p>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{doc.documentType}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Office: {doc.officeName}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Tracking: {doc.trackingNumber}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Requested: {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                                            </div>
                                        </div>
                                        {doc.comments && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Comments: {doc.comments}</p>
                                        )}
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