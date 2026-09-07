import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import StaffLayout from '../../components/staff/StaffLayout';
import toast from 'react-hot-toast';

function StaffActivityLog() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        api.get('/activities/mine')
            .then(response => setActivities(response.data || []))
            .catch(() => toast.error('Failed to load your activity log'));
    }, []);

    return (
        <StaffLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Activity</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">A record of the work completed by your account.</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {activities.length === 0 ? <p className="p-8 text-center text-gray-500">No activities recorded yet.</p> : (
                    <div className="divide-y dark:divide-gray-700">
                        {activities.map(activity => (
                            <div key={activity.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                                <div><p className="font-medium text-gray-900 dark:text-white">{activity.action}</p><p className="text-sm text-gray-500">{activity.type}</p></div>
                                <time className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</time>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}

export default StaffActivityLog;
