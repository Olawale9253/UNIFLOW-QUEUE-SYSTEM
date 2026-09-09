import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosConfig';
import defaultSchoolLogo from '../assets/images/school-logo-fallback.svg';

const BrandingContext = createContext();

const brandingStorageKey = 'uniflow_branding';
const legacySchoolName = 'LADOKE AKINTOLA UNIVERSITY OF TECHNOLOGY, OGBOMOSO';

const getStoredBranding = () => {
  try {
    const savedBranding = localStorage.getItem(brandingStorageKey);
    if (!savedBranding) return {};
    const parsed = JSON.parse(savedBranding);
    return parsed.schoolName && parsed.schoolName !== legacySchoolName ? parsed : {};
  } catch (error) {
    console.error('Error loading saved branding:', error);
    return {};
  }
};

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(() => ({
    ...getStoredBranding(),
    logo: defaultSchoolLogo,
    logoUrl: '',
    loading: false
  }));

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await api.get('/system/settings');
        const settings = response.data;
        setBranding(prev => ({
          ...prev,
          schoolName: settings.siteName || prev.schoolName || '',
          logoUrl: settings.logoUrl || '',
          logo: settings.logoUrl || defaultSchoolLogo,
          loading: false
        }));
      } catch (error) {
        const savedBranding = getStoredBranding();
        setBranding(prev => ({ ...prev, ...savedBranding, logo: savedBranding.logoUrl || defaultSchoolLogo }));
      }
    };

    loadBranding();
  }, []);

  useEffect(() => {
    if (branding.schoolName) {
      localStorage.setItem(brandingStorageKey, JSON.stringify({ schoolName: branding.schoolName }));
    }
  }, [branding.schoolName]);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = branding.logo || defaultSchoolLogo;
    }
  }, [branding.logo]);

  const saveBranding = async (schoolName, logoUrl) => {
    const response = await api.get('/system/settings');
    const settings = response.data;
    const saved = await api.put('/system/settings', {
      ...settings,
      siteName: schoolName,
      logoUrl: logoUrl || null
    });
    setBranding(prev => ({
      ...prev,
      schoolName: saved.data.siteName || schoolName,
      logoUrl: saved.data.logoUrl || '',
      logo: saved.data.logoUrl || defaultSchoolLogo,
      loading: false
    }));
  };

  // Update school name
  const updateSchoolName = async (name) => {
    setBranding(prev => ({ ...prev, loading: true }));
    try {
      await saveBranding(name, branding.logoUrl);
      toast.success('School name updated successfully!');
    } catch (error) {
      setBranding(prev => ({ ...prev, loading: false }));
      toast.error('Failed to update school name');
    }
  };

  // Upload logo
  const uploadLogo = async (file) => {
    setBranding(prev => ({ ...prev, loading: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/system/settings/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await saveBranding(branding.schoolName, response.data.logoUrl);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      setBranding(prev => ({ ...prev, loading: false }));
    }
  };

  // Remove logo
  const removeLogo = async () => {
    setBranding(prev => ({ ...prev, loading: true }));
    try {
      await saveBranding(branding.schoolName, '');
      toast.success('Logo removed successfully!');
    } catch (error) {
      setBranding(prev => ({ ...prev, loading: false }));
      toast.error('Failed to remove logo');
    }
  };

  // Reset to default
  const resetBranding = async () => {
    setBranding(prev => ({ ...prev, loading: true }));
    try {
      await saveBranding('', '');
      localStorage.removeItem(brandingStorageKey);
      toast.success('Branding reset');
    } catch (error) {
      setBranding(prev => ({ ...prev, loading: false }));
      toast.error('Failed to reset branding');
    }
  };

  const refreshBranding = async () => {
    try {
      const response = await api.get('/system/settings');
      const settings = response.data;
      setBranding(prev => ({
        ...prev,
        schoolName: settings.siteName || prev.schoolName || '',
        logoUrl: settings.logoUrl || '',
        logo: settings.logoUrl || defaultSchoolLogo
      }));
    } catch (error) {
      console.error('Error refreshing branding:', error);
    }
  };

  return (
    <BrandingContext.Provider value={{
      branding,
      updateSchoolName,
      uploadLogo,
      removeLogo,
      resetBranding,
      refreshBranding
    }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}