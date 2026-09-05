import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import defaultLogo from '../assets/images/school-logo.png';
import api from '../api/axiosConfig';

const BrandingContext = createContext();

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState({
    schoolName: 'LADOKE AKINTOLA UNIVERSITY OF TECHNOLOGY, OGBOMOSO',
    logo: defaultLogo,
    logoUrl: '',
    loading: false
  });

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await api.get('/system/settings');
        const settings = response.data;
        setBranding(prev => ({
          ...prev,
          schoolName: settings.siteName || prev.schoolName,
          logoUrl: settings.logoUrl || '',
          logo: settings.logoUrl || defaultLogo,
          loading: false
        }));
      } catch (error) {
        const savedBranding = localStorage.getItem('uniflow_branding');
        if (!savedBranding) return;
        try {
          const parsed = JSON.parse(savedBranding);
          setBranding(prev => ({ ...prev, ...parsed, logo: parsed.logoUrl || defaultLogo }));
        } catch (storageError) {
          console.error('Error loading branding fallback:', storageError);
        }
      }
    };

    loadBranding();
  }, []);

  useEffect(() => {
    localStorage.setItem('uniflow_branding', JSON.stringify({ schoolName: branding.schoolName }));
  }, [branding.schoolName]);

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
      logo: saved.data.logoUrl || defaultLogo,
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
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
      await saveBranding(branding.schoolName, base64String);
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
    const defaultName = 'LADOKE AKINTOLA UNIVERSITY OF TECHNOLOGY, OGBOMOSO';
    setBranding(prev => ({ ...prev, loading: true }));
    try {
      await saveBranding(defaultName, '');
      toast.success('Branding reset to default!');
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
        schoolName: settings.siteName || prev.schoolName,
        logoUrl: settings.logoUrl || '',
        logo: settings.logoUrl || defaultLogo
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