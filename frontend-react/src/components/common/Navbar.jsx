import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from './UserAvatar';
import toast from 'react-hot-toast';
import SchoolBranding from './SchoolBranding';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProfileDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setIsMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const hidePaths = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/dashboard',
    '/queue',
    '/appointments',
    '/documents',
    '/offices',
    '/profile',
    '/settings',
    '/staff',
    '/staff/queue',
    '/staff/appointments',
    '/staff/documents',
  ];
  const hideNavbar = hidePaths.includes(location.pathname)
    || location.pathname.startsWith('/admin')
    || location.pathname.startsWith('/staff');

  if (hideNavbar) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm transition-colors duration-300 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex flex-shrink-0 items-center space-x-2">
              <SchoolBranding showName={true} showLogo={true} />
              {user?.role === 'ADMIN' && <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/50 dark:text-red-400">Admin</span>}
            </Link>
          </div>

          <div className="hidden items-center space-x-3 lg:flex">
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center space-x-1 focus:outline-none" aria-label="Open profile menu">
                <UserAvatar user={user} size="sm" />
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" /></svg>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <Link to="/profile" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">My Profile</Link>
                  <Link to="/settings" onClick={() => setIsProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Settings</Link>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700">Logout</button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Toggle menu">
              <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? 'M6 18 18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
            </button>
          </div>
        </div>

        <div ref={mobileMenuRef} className={`overflow-hidden transition-all duration-300 lg:hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-1 border-t border-gray-200 py-3 dark:border-gray-700">
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">My Profile</Link>
            <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Settings</Link>
            <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
