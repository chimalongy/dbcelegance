'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoggedCustomerStore } from '@/app/lib/store/loggedCustomer';
import toast from 'react-hot-toast';

export const useSessionTimeout = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    loggedCustomer, 
    updateLastActivity, 
    isSessionExpired, 
    clearLoggedCustomer 
  } = useLoggedCustomerStore();

  useEffect(() => {
    if (!loggedCustomer) return;

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];
    const updateActivity = () => updateLastActivity();
    
    // Add event listeners
    events.forEach(event => window.addEventListener(event, updateActivity));

    const handleSessionExpired = () => {
      clearLoggedCustomer();
      // Only show toast if we're not already on the accounts page
      if (!pathname.includes('/accounts')) {
        toast.error('Your session has expired. Please log in again.');
      }
    };

    // Check session every minute
    const checkSession = setInterval(() => {
      if (isSessionExpired()) {
        handleSessionExpired();
      }
    }, 60000);

    // Initial check
    if (isSessionExpired()) {
      handleSessionExpired();
      return;
    }

    // Cleanup
    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(checkSession);
    };
  }, [loggedCustomer, router, updateLastActivity, isSessionExpired, clearLoggedCustomer, pathname]);

  return null;
};
