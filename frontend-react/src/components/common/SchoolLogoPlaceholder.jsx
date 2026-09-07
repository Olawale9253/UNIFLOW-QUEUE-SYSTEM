import React from 'react';

function SchoolLogoPlaceholder({ className = '' }) {
  return (
    <div className={`flex items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 ${className}`} aria-label="School image placeholder">
      <svg className="h-1/2 w-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01" />
      </svg>
    </div>
  );
}

export default SchoolLogoPlaceholder;
