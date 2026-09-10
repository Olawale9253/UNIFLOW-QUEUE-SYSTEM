import React from 'react';
import { useBranding } from '../../context/BrandingContext';
import SchoolLogoPlaceholder from './SchoolLogoPlaceholder';

function SchoolBranding({ className = '', showLogo = true, showName = true, layout = 'row' }) {
  const { branding } = useBranding();
  const isStacked = layout === 'stacked';

  return (
    <div className={`${isStacked ? 'flex flex-col items-center gap-4 text-center' : 'flex items-center space-x-3'} ${className}`}>
      {showLogo && (
        <div className="flex-shrink-0">
          {branding.logo ? (
            <img
              src={branding.logo}
              alt={branding.schoolName || 'School logo'}
              loading="eager"
              decoding="async"
              className={`${isStacked ? 'h-28 w-28' : 'h-10 w-10'} object-contain rounded-lg`}
            />
          ) : (
            <SchoolLogoPlaceholder className={isStacked ? 'h-28 w-28' : 'h-10 w-10'} />
          )}
        </div>
      )}
      {showName && (
        <div className={`flex flex-col ${isStacked ? 'items-center' : ''}`}>
          <span className={`${isStacked ? 'text-base' : 'text-sm'} font-bold leading-tight text-gray-900 dark:text-white`}>
            {branding.schoolName || 'School name not configured'}
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