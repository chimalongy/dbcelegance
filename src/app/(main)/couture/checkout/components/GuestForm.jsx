"use client";
import { useState } from "react";
import { useGuestCustomerStore } from "@/app/lib/store/guestCustomer";

export default function GuestForm() {
  const guestCustomer = useGuestCustomerStore((state) => state.guestCustomer);
  const setGuestCustomer = useGuestCustomerStore((state) => state.setGuestCustomer);

  const [email, setEmail] = useState(guestCustomer || "");

  // Email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  const handleSubmit = () => {
    if (isValid) {
      setGuestCustomer(email);
    }
  };

  return (
    <div className="space-y-4 pt-10 pb-10">
      <div className="flex flex-col">
        <label className="text-sm text-gray-700">* Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`border-b p-3 focus:outline-none ${
            isValid ? "border-gray-300 focus:border-gray-600" : "border-red-500"
          }`}
        />
        {!isValid && email && (
          <span className="text-xs text-red-500 mt-1">
            Please enter a valid email address
          </span>
        )}
      </div>
      <button
        disabled={!isValid}
        onClick={handleSubmit}
        className={`w-full rounded-md py-2 text-center ${
          isValid
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
