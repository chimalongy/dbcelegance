"use client";

import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import ForgotPasswordModal from "../ForgotPasswordModal";
import toast from "react-hot-toast";
import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const isFormValid = email && password;

  

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter both email and password.");
      return;
    }

   try {
     let loginresponse = await axios.post(apiSummary.store.auth.login,{email, password})
      console.log(loginresponse.data)
      if (loginresponse.data.success){
        toast.success("Login sucessfull.")
      }
      
    
   } catch (error) {
    toast.error(error.response.data.error)

   }

   
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Integrate OAuth logic here
  };

  const handleCreateAccount = () => {
    console.log("Redirecting to create account...");
    // Route to register page
  };

  return (
    <div className="flex pt-16 justify-center">
      <div className="w-full max-w-md bg-white overflow-hidden">
        {/* Luxury header section */}


        <div className="">
          {/* Social login options - minimal and elegant */}


          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Email Address</label>
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

            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Password</label>
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

            <div className="text-right">
              <button
                type="button"
                onClick={() => { setShowForgotPasswordModal(true) }}
                className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 rounded-sm text-white text-sm font-medium flex items-center justify-center space-x-2 transition-all ${isFormValid
                  ? "bg-black hover:bg-gray-800 active:bg-gray-900"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <span>Sign In</span>
              <FaArrowRight size={12} />
            </button>
          </form>


        </div>


      </div>
      {showForgotPasswordModal && <ForgotPasswordModal setShowForgotPasswordModal={setShowForgotPasswordModal} />}
    </div>
  );
};

export default LoginForm;