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
            setOffices(officesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            'SUBMITTED': 'bg-yellow-100 text-yellow-800',
            'UNDER_REVIEW': 'bg-blue-100 text-blue-800',
            'PROCESSING': 'bg-purple-100 text-purple-800',
            'READY_FOR_COLLECTION': 'bg-green-100 text-green-800',
            'COMPLETED': 'bg-gray-100 text-gray-800',
            'REJECTED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Document Requests</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request Document */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Request Document</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Office</label>
                            <select
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Office</option>
                                {offices.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Document Type</label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Type</option>
                                {documentTypes.map((type) => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Comments</label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Additional comments..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Request Document
                        </button>
                    </form>
                </div>

                {/* My Documents */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Track Document</h2>
                        <form onSubmit={handleTrack} className="flex gap-4">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                Track
                            </button>
                        </form>
                        {trackedDocument && (
                            <div className="mt-4 border rounded-lg p-4">
                                <p className="font-semibold">Document: {trackedDocument.documentType}</p>
                                <p className="text-sm text-gray-600">Office: {trackedDocument.officeName}</p>
                                <p className="text-sm text-gray-600">Tracking: {trackedDocument.trackingNumber}</p>
                                <p className="text-sm">
                                    Status: <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(trackedDocument.status)}`}>
                    {trackedDocument.status}
                  </span>
                                </p>
                                {trackedDocument.comments && (
                                    <p className="text-sm text-gray-600 mt-2">Comments: {trackedDocument.comments}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">My Requests</h2>
                        {documents.length === 0 ? (
                            <p className="text-gray-500">No document requests</p>
                        ) : (
                            <div className="space-y-3">
                                {documents.map((doc) => (
                                    <div key={doc.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold">{doc.documentType}</p>
                                                <p className="text-sm text-gray-600">Office: {doc.officeName}</p>
                                                <p className="text-sm text-gray-600">Tracking: {doc.trackingNumber}</p>
                                                <p className="text-sm text-gray-600">
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
                                            <p className="text-sm text-gray-600 mt-2">Comments: {doc.comments}</p>
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