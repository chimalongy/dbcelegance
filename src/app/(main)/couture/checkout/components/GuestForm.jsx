"use client";
import { useState } from "react";
import { useGuestCustomerStore } from "@/app/lib/store/guestCustomer";

export default function GuestForm({ onSuccess}) {
  const guestCustomer = useGuestCustomerStore((state) => state.guestCustomer);
  const setGuestCustomer = useGuestCustomerStore((state) => state.setGuestCustomer);

  const [email, setEmail] = useState(guestCustomer || "");

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (isValid) {
      setGuestCustomer(email);
      // Call the onSuccess callback with the email if provided
      if (onSuccess) {
        onSuccess(email);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-6 pb-4">
      <div className="flex flex-col">
        <label htmlFor="guest-email" className="text-sm font-medium text-gray-700 mb-1">
          * Email address
        </label>
        <input
          id="guest-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            isValid || !email 
              ? 'border-gray-300 focus:border-gray-600 focus:ring-1 focus:ring-gray-500' 
              : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          }`}
          required
        />
        {!isValid && email && (
          <p className="mt-1 text-sm text-red-600">
            Please enter a valid email address
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          We'll send your order confirmation to this email
        </p>
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={!isValid || !email}
          className={`w-full px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
            isValid && email
              ? 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue as guest
        </button>
      </div>
    </form>
  );
}
