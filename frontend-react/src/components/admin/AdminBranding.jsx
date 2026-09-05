import React, { useState, useRef } from 'react';
import { useBranding } from '../../context/BrandingContext';
import AdminLayout from '../../components/admin/AdminLayout';
import SchoolBranding from '../common/SchoolBranding';
import toast from 'react-hot-toast';

function AdminBranding() {
  const { branding, updateSchoolName, uploadLogo, removeLogo, resetBranding } = useBranding();
  const [schoolName, setSchoolName] = useState(branding.schoolName || '');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveName = () => {
    const nextName = schoolName.trim();
    if (!nextName) {
      toast.error('School name cannot be empty');
      return;
    }
    updateSchoolName(nextName);
    setIsEditing(false);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    uploadLogo(file);
    event.target.value = '';
  };

  const handleRemoveLogo = () => {
    if (window.confirm('Are you sure you want to remove the logo?')) removeLogo();
  };

  const handleReset = () => {
    if (!window.confirm('Are you sure you want to reset all branding to default?')) return;
    resetBranding();
    setSchoolName('LADOKE AKINTOLA UNIVERSITY OF TECHNOLOGY, OGBOMOSO');
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="sticky top-0 z-20 -mx-4 mb-6 bg-white/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 dark:bg-slate-900/95">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">School Branding</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Customize your university&apos;s branding and appearance.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">School Name</h2>
          {isEditing ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={schoolName}
                onChange={(event) => setSchoolName(event.target.value)}
                className="input flex-1"
                placeholder="Enter school name"
                autoFocus
              />
              <div className="flex gap-2">
                <button type="button" onClick={handleSaveName} className="btn-primary">Save</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSchoolName(branding.schoolName || '');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current School Name</p>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{branding.schoolName || 'Not set'}</p>
              </div>
              <button type="button" onClick={() => setIsEditing(true)} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">School Logo</h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
              <SchoolBranding showName={false} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Upload a logo for your university</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Recommended: PNG or JPG, Max 2MB</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary text-sm">Upload Logo</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                {branding.logoUrl && (
                  <button type="button" onClick={handleRemoveLogo} className="btn-danger text-sm">Remove Logo</button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Reset to Default</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Reset all branding to default settings</p>
            </div>
            <button type="button" onClick={handleReset} className="btn-danger">Reset Branding</button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default AdminBranding;
