import toast from 'react-hot-toast';

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
    const responseData = error?.response?.data;
    return responseData?.message || responseData?.error || (typeof responseData === 'string' ? responseData : fallback);
};

export const confirmAction = (message) => new Promise((resolve) => {
    const toastId = toast.custom((t) => (
        <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirmation required"
            className={`pointer-events-auto w-[min(100%,24rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${t.visible ? 'animate-enter' : 'opacity-0'}`}
        >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{message}</p>
            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => {
                        toast.dismiss(toastId);
                        resolve(false);
                    }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    onClick={() => {
                        toast.dismiss(toastId);
                        resolve(true);
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    ), { duration: Infinity, position: 'top-center' });
});
