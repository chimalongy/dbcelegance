"use client";

import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import ForgotPasswordModal from "../ForgotPasswordModal";
import toast from "react-hot-toast";
import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";
import { useLoggedCustomerStore } from "@/app/lib/store/loggedCustomer";

const LoginForm = () => {
  const loggedCustomer = useLoggedCustomerStore((state) => state.loggedCustomer);
  const setLoggedCustomer = useLoggedCustomerStore((state) => state.setLoggedCustomer);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false); // 🔹 new state for signing in

  const isFormValid = email && password;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(apiSummary.store.auth.login, { 
        email, 
        password 
      });

      if (response.data.success) {
        // Store the token and user data
        setLoggedCustomer({
          ...response.data.customer,
          token: response.data.token // Ensure your API returns a token
        });
        
        toast.success("Login successful.");
        
        // Redirect to dashboard or previous page
        // const searchParams = new URLSearchParams(window.location.search);
        // const redirectTo = searchParams.get('redirect') || '/';
        // window.location.href = redirectTo;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex pt-16 justify-center">
      <div className="w-full max-w-md bg-white overflow-hidden">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="flex items-center border-b border-gray-300 focus-within:border-black transition-colors">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 py-2 focus:outline-none bg-transparent"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 p-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPasswordModal(true)}
              className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-sm text-white text-sm font-medium flex items-center justify-center space-x-2 transition-all ${
              isFormValid && !loading
                ? "bg-black hover:bg-gray-800 active:bg-gray-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <FaArrowRight size={12} />
              </>
            )}
          </button>
        </form>
      </div>

      {showForgotPasswordModal && (
        <ForgotPasswordModal setShowForgotPasswordModal={setShowForgotPasswordModal} />
      )}
    </div>
  );
};

export default LoginForm;
