"use client"
import { useState, useEffect } from 'react';
import LoginForm from './Login';
import SignupForm from './Signup';
import { useLoggedCustomerStore } from '@/app/lib/store/loggedCustomer';
import LogoutButton from '../LogoutButton';

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { loggedCustomer, isSessionExpired } = useLoggedCustomerStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If not on client-side yet, show loading or nothing
  if (!isClient) {
    return null;
  }

  // Check if user is logged in and session is valid
  const isLoggedIn = loggedCustomer && !isSessionExpired();

  if (isLoggedIn) {
    const handleLogout = () => {
      // The LogoutButton will handle the actual logout
      // This will cause a re-render showing the login form
      setActiveTab('login');
    };

    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-light mb-6">My Account</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account Information</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900">
                {loggedCustomer.first_name} {loggedCustomer.last_name}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-gray-900">{loggedCustomer.email}</p>
            </div>
            
            {loggedCustomer.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-gray-900">{loggedCustomer.phone}</p>
              </div>
            )}
            
            {loggedCustomer.address && (
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">
                  {loggedCustomer.address.street && `${loggedCustomer.address.street}, `}
                  {loggedCustomer.address.city && `${loggedCustomer.address.city}, `}
                  {loggedCustomer.address.country}
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <LogoutButton 
              className="block w-full text-center py-2 border border-black text-black hover:bg-gray-50 transition-colors"
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show login/signup form if not logged in
  return (
    <div className="max-w-md mx-auto mt-10 bg-white overflow-hidden">
      <div className="flex border-b border-gray-200 border-t-0">
        <button
          className={`flex-1 py-4 text-center font-light tracking-wide transition-all duration-300 ${
            activeTab === 'login'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('login')}
        >
          LOGIN
        </button>
        <button
          className={`flex-1 py-4 text-center font-light tracking-wide transition-all duration-300 ${
            activeTab === 'signup'
              ? 'text-black border-b-2 border-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          REGISTER
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}