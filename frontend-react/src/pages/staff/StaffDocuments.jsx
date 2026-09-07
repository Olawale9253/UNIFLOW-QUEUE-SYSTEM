import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const statuses = ['UNDER_REVIEW', 'PROCESSING', 'READY_FOR_COLLECTION', 'COMPLETED', 'REJECTED'];

function StaffDocuments() {
    const { user } = useAuth();
    const [offices, setOffices] = useState([]); const [officeId, setOfficeId] = useState(''); const [documents, setDocuments] = useState([]); const [comments, setComments] = useState({}); const [loading, setLoading] = useState(true);
    const loadDocuments = async (id = officeId) => { if (!id) return; try { const response = await api.get(`/documents/office/${id}`); setDocuments((response.data || []).filter(document => ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING'].includes(document.status))); } catch (error) { toast.error('Failed to load document requests'); } };
    useEffect(() => { api.get('/users/profile').then((response) => { const assigned = response.data.officeId ? [{ id: response.data.officeId, name: response.data.officeName }] : []; setOffices(assigned); if (assigned[0]) setOfficeId(assigned[0].id); }).catch(() => toast.error('Failed to load assigned office')).finally(() => setLoading(false)); }, []);
    useEffect(() => {
        loadDocuments();
        if (!officeId) return undefined;

        const interval = setInterval(loadDocuments, 10000);
        return () => clearInterval(interval);
    }, [officeId]);
    const updateStatus = async (document, status) => { try { await api.put(`/documents/${document.id}/status`, null, { params: { status, comments: comments[document.id] || document.comments || '' } }); toast.success('Document status updated'); loadDocuments(); } catch (error) { toast.error(error.response?.data?.message || 'Unable to update document'); } };
    return <StaffLayout><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Processing</h1><div className="mt-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200"><span className="h-2 w-2 rounded-full bg-blue-500" />{offices[0]?.name || user?.officeName || 'Not assigned'}</div></div><button onClick={() => loadDocuments()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Refresh</button></div><div className="space-y-4">{loading ? <p className="p-8 text-center text-gray-500">Loading requests...</p> : documents.length === 0 ? <p className="rounded-xl bg-white p-8 text-center text-gray-500 dark:bg-gray-800">No document requests for this office.</p> : documents.map((document) => <div key={document.id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold text-gray-900 dark:text-white">{document.documentType.replaceAll('_', ' ')}</h2><p className="text-sm text-gray-500">{document.trackingNumber} · {document.status}</p></div><select value={document.status} onChange={(event) => updateStatus(document, event.target.value)} className="rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">{statuses.map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></div><textarea value={comments[document.id] ?? document.comments ?? ''} onChange={(event) => setComments({ ...comments, [document.id]: event.target.value })} placeholder="Add a comment for the student" className="mt-4 min-h-20 w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /><button onClick={() => updateStatus(document, document.status)} className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white dark:bg-slate-600">Save comment</button></div>)}</div></StaffLayout>;
}

export default StaffDocuments;