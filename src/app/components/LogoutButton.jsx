'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLoggedCustomerStore } from '@/app/lib/store/loggedCustomer';
import toast from 'react-hot-toast';

const LogoutButton = ({ className = '', onLogout }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearLoggedCustomer } = useLoggedCustomerStore();

  const handleLogout = async () => {
    try {
      // Optional: Call your API to invalidate the token
      // await axios.post('/api/auth/logout');
      
      // Clear local storage and state
      clearLoggedCustomer();
      
      // Call the onLogout callback if provided
      if (onLogout) {
        onLogout();
      } else {
        // If no callback, just refresh the current page
        window.location.reload();
      }
      
      // Show success message
      toast.success('You have been logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={`text-sm text-gray-700 hover:text-gray-900 ${className}`}
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
