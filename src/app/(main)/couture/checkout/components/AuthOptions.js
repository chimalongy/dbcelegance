"use client";
import LoginForm from "@/app/components/modalpages.jsx/Login";
import SignupForm from "@/app/components/modalpages.jsx/Signup";
import GuestForm from "./GuestForm";
import { useGuestCustomerStore } from "@/app/lib/store/guestCustomer";
import { useLoggedCustomerStore } from "@/app/lib/store/loggedCustomer";
import { useState } from "react";
import { 
  FaUser, 
  FaUsers, 
  FaSync, 
  FaSignOutAlt, 
  FaKey, 
  FaEdit, 
  FaFileAlt,
  FaChevronLeft,
  FaCheck
} from "react-icons/fa";

export default function AuthOptions({ selectedauthtype, setSelectedAuthtype }) {
  // ✅ Zustand stores
  const { loggedCustomer, clearLoggedCustomer } = useLoggedCustomerStore();
  const {
    guestCustomer,
    setGuestCustomer,
    clearGuestCustomer,
  } = useGuestCustomerStore();
  
  // Track if guest form is being shown
  const [showGuestForm, setShowGuestForm] = useState(false);

  const handleLogout = () => {
    clearLoggedCustomer();
    clearGuestCustomer();
    setSelectedAuthtype(null);
  };

  // ✅ Build options dynamically based on authentication state
  let options = [];

  // Always show login and guest options, but highlight the current auth state
  if (loggedCustomer) {
    // LOGGED IN USER - prioritize logged in option
    options = [
      {
        id: "logged",
        title: `Continue as ${loggedCustomer.email}`,
        description: `Signed in as ${loggedCustomer.first_name} ${loggedCustomer.last_name}`,
        icon: <FaUser />,
        highlight: true
      },
      {
        id: "guest",
        title: "Continue as guest",
        description: "Checkout without creating an account",
        icon: <FaUsers />
      },
      {
        id: "login",
        title: "Switch account",
        description: "Sign in with a different account",
        icon: <FaSync />
      },
      {
        id: "logout",
        title: "Log out",
        description: "Sign out of this account",
        icon: <FaSignOutAlt />
      }
    ];
  } else if (guestCustomer) {
    // GUEST USER - prioritize guest option
    options = [
      {
        id: "guest-continue",
        title: `Continue as guest (${guestCustomer})`,
        description: "Proceed with your guest checkout",
        icon: <FaUsers />,
        highlight: true
      },
      {
        id: "login",
        title: "Log in",
        description: "Sign in to your existing account",
        icon: <FaKey />
      },
      {
        id: "create",
        title: "Create an account",
        description: "Register a new account",
        icon: <FaFileAlt />
      },
      {
        id: "guest-switch",
        title: "Use different email",
        description: "Clear guest and enter a different email",
        icon: <FaEdit />
      },
    ];
  } else {
    // NO AUTH - show all options
    options = [
      {
        id: "login",
        title: "Log in",
        description: "Sign in to your existing account",
        icon: <FaKey />
      },
      {
        id: "create",
        title: "Create an account",
        description: "Register a new account",
        icon: <FaFileAlt />
      },
      {
        id: "guest",
        title: "Continue as guest",
        description: "Checkout without creating an account",
        icon: <FaUsers />
      }
    ];
  }

  const handleSelect = (id) => {
    switch (id) {
      case "logout":
        handleLogout();
        // Don't set selected auth type here - let the parent handle it
        break;
        
      case "logged":
        // Just set the auth type, parent will handle the rest
        setSelectedAuthtype('logged');
        break;
        
      case "guest":
        // For new guest, show the guest form
        setShowGuestForm(true);
        break;
        
      case "guest-continue":
        // If we have guest data, continue with guest checkout
        if (guestCustomer) {
          setSelectedAuthtype('guest-continue');
        } else {
          // If no guest data, show guest form
          setSelectedAuthtype('guest');
          setShowGuestForm(true);
        }
        break;
        
      case "guest-switch":
        // Clear guest data and reset to show guest form
        clearGuestCustomer();
        setSelectedAuthtype('guest');
        setShowGuestForm(true);
        break;
        
      case "login":
      case "create":
        // Toggle the selected auth type for login/signup forms
        setSelectedAuthtype((prev) => (prev === id ? null : id));
        setShowGuestForm(false);
        break;
        
      default:
        setSelectedAuthtype(id);
        setShowGuestForm(false);
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full rounded-md p-4 md:p-6">
        {selectedauthtype === 'login' || selectedauthtype === 'create' ? (
          <div className="mb-6">
            <button 
              onClick={() => setSelectedAuthtype(null)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaChevronLeft className="w-4 h-4 mr-1" />
              Back to options
            </button>
            <h2 className="text-xl font-medium text-gray-900">
              {selectedauthtype === 'login' ? 'Sign in to your account' : 'Create an account'}
            </h2>
          </div>
        ) : null}

        <div>
          {options.map((opt) => (
            <div
              key={opt.id}
              className="border-b border-gray-200 overflow-hidden"
            >
              <div 
                onClick={() => handleSelect(opt.id)}
                className={`p-4 md:p-6 flex items-start space-x-3 cursor-pointer transition rounded-lg border ${
                  selectedauthtype === opt.id || opt.highlight
                    ? "border-gray-800 bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                } ${opt.highlight ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
              >
                <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${
                  opt.highlight ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${
                    opt.highlight ? 'text-gray-900' : 'text-gray-900'
                  }`}>
                    {opt.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{opt.description}</p>
                </div>
                {(selectedauthtype === opt.id || opt.highlight) && (
                  <div className="flex-shrink-0 text-gray-500">
                    <FaCheck className="h-5 w-5" />
                  </div>
                )}
              </div>

              {/* Expand forms */}
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  (selectedauthtype === opt.id || 
                  (opt.id === 'guest' && showGuestForm && !guestCustomer))
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-4 lg:px-12 pb-4 border-t border-gray-200 bg-white">
                  {opt.id === "login" && <LoginForm />}
                  {opt.id === "create" && <SignupForm />}
                  {((opt.id === "guest" && showGuestForm) || opt.id === "guest-continue") && (
                    <GuestForm 
                      onSuccess={(email) => {
                        // When guest form is submitted successfully, update the auth type
                        if (email) {
                          setSelectedAuthtype('guest')
                          setShowGuestForm(false);
                        }
                      }}
                    />
                  )}
                  {opt.id === "logout" && (
                    <div className="flex justify-center py-4">
                      <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}