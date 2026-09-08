import React from 'react';

function ErrorState({ title = 'Something went wrong', message = 'We could not load this section. Please try again.', onRetry }) {
    return (
        <div role="alert" className="my-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300">Unable to continue</p>
                    <h2 className="mt-1 text-lg font-bold">{title}</h2>
                    <p className="mt-1 text-sm text-rose-700/90 dark:text-rose-200/90">{message}</p>
                </div>
                {onRetry && (
                    <button type="button" onClick={onRetry} className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:bg-rose-600 dark:hover:bg-rose-500">
                        Try again
                    </button>
                )}
            </div>
        </div>
    );
}

export default ErrorState;
