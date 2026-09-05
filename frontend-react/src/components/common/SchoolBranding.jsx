import React from 'react';
import { useBranding } from '../../context/BrandingContext';
import defaultLogo from '../../assets/images/school-logo.png';

function SchoolBranding({ className = '', showLogo = true, showName = true, layout = 'row' }) {
  const { branding } = useBranding();
  const isStacked = layout === 'stacked';

  return (
    <div className={`${isStacked ? 'flex flex-col items-center gap-4 text-center' : 'flex items-center space-x-3'} ${className}`}>
      {showLogo && (
        <div className="flex-shrink-0">
          <img
            src={branding.logo || defaultLogo}
            alt={branding.schoolName || 'School logo'}
            className={`${isStacked ? 'h-28 w-28' : 'h-10 w-10'} object-contain rounded-lg`}
          />
        </div>
      )}
      {showName && (
        <div className={`flex flex-col ${isStacked ? 'items-center' : ''}`}>
          <span className={`${isStacked ? 'text-base' : 'text-sm'} font-bold leading-tight text-gray-900 dark:text-white`}>
            {branding.schoolName || 'LADOKE AKINTOLA UNIVERSITY OF TECHNOLOGY, OGBOMOSO'}
          </span>
          {branding.schoolName && (
            <span className="text-[10px] leading-tight text-gray-500 dark:text-gray-400">
              Digital Queue System
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default SchoolBranding;