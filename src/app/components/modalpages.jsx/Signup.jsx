"use client";

import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiEye, FiEyeOff, FiClock, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    title: "Mr",
    firstName: "",
    lastName: "",
    phone: "",
    fashionNews: false,
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    specialChar: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Generate a random 8-digit OTP
  const generateOtp = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));

    setPasswordRequirements({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[@#$%^&*]/.test(password),
    });
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  // ✅ Validation function
  const validateInputs = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !(
        passwordRequirements.length &&
        passwordRequirements.lowercase &&
        passwordRequirements.uppercase &&
        passwordRequirements.digit &&
        passwordRequirements.specialChar
      )
    ) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP to the user
  const sendOtp = async () => {
    if (!validateInputs()) {
      return; // stop if validation fails
    }

    setIsSendingOtp(true);
    try {
      // Generate OTP on frontend
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Send OTP to backend
      const response = await axios.post(apiSummary.store.auth.sendOtp, {
        firstName: formData.firstName, 
        duration: 30,
        email: formData.email,
        section: "register",
        otp: newOtp
      });

      if (response.data.success) {
        setOtpSent(true);
        // Start countdown timer (60 seconds)
        setOtpCountdown(60);
        const countdownInterval = setInterval(() => {
          setOtpCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(response.data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.log("❌ OTP Sending Error:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        toast.error("Invalid request. Please check your inputs.");
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP and complete registration
  const verifyOtp = async () => {
    if (!otp || otp.length !== 8) {
      toast.error("Please enter a valid 8-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      // Verify OTP on frontend first
      if (otp === generatedOtp) {
        // OTP is correct, proceed with registration
        const response = await axios.post(apiSummary.store.auth.register, formData);

        if (response.data.success) {
          toast.success("Registration successful! You can now login.");
          // Reset form
          setFormData({
            email: "",
            password: "",
            title: "Mr",
            firstName: "",
            lastName: "",
            phone: "",
            fashionNews: false,
          });
          setOtpSent(false);
          setOtp("");
          setGeneratedOtp("");
        } else {
          toast.error(response.data.error || "Registration failed. Please try again.");
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log("❌ Registration Error:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        if (error.response.data.error === "user already exist") {
          toast.error("This email is already registered. Please use a different email or login.");
        } else if (error.response.data.error === "Password does not meet requirements") {
          toast.error("Password does not meet security requirements.");
        } else {
          toast.error("Invalid registration data. Please check your inputs.");
        }
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (otpCountdown > 0) return;
    
    setIsSendingOtp(true);
    try {
      // Generate a new OTP
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Resend OTP to backend
      const response = await axios.post(apiSummary.store.auth.sendOtp, {
        firstName: formData.firstName, 
        duration: 30,
        email: formData.email,
        section: "register",
        otp: newOtp
      });

      if (response.data.success) {
        setOtpCountdown(60);
        const countdownInterval = setInterval(() => {
          setOtpCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast.success("OTP resent successfully!");
      } else {
        toast.error(response.data.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.log("❌ OTP Resend Error:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 400) {
        toast.error("Invalid request. Please check your inputs.");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Render the registration form
  const renderRegistrationForm = () => (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      {/* Login Info */}
      <section>
        <h2 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-4 bold">Login Information</h2>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Password</label>
          <div className="flex items-center border-b border-gray-300 focus-within:border-black transition-colors">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="flex-1 py-2 focus:outline-none bg-transparent"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 p-2"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
          {isPasswordFocused && (
            <div className="text-xs text-gray-500 mt-2">
              <p className="mb-1">Your password must include:</p>
              <ul className="space-y-1">
                <li className={passwordRequirements.length ? "text-green-500" : ""}>
                  • Minimum 8 characters
                </li>
                <li className={passwordRequirements.lowercase ? "text-green-500" : ""}>
                  • One lowercase letter
                </li>
                <li className={passwordRequirements.uppercase ? "text-green-500" : ""}>
                  • One uppercase letter
                </li>
                <li className={passwordRequirements.digit ? "text-green-500" : ""}>
                  • One number
                </li>
                <li className={passwordRequirements.specialChar ? "text-green-500" : ""}>
                  • One special character (@#$%^&*)
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Personal Info */}
      <section>
        <h2 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-4 bold">Personal Information</h2>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">Title</label>
          <div className="relative">
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:border-black py-2 pr-8 focus:outline-none bg-transparent appearance-none transition-colors"
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
            <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            Phone Number
          </label>
          <div className="phone-input-container border-b border-gray-300 focus-within:border-black transition-colors">
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
              inputClass="phone-input-custom"
              buttonClass="phone-button-custom"
              dropdownClass="phone-dropdown-custom"
              containerClass="phone-container-custom"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section>
        <h2 className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-4 bold">
          Preferences & Terms
        </h2>

        <div className="mb-3">
          <label className="flex items-start space-x-2 text-sm">
            <input
              type="checkbox"
              name="fashionNews"
              checked={formData.fashionNews}
              onChange={handleChange}
              className="mt-1"
            />
            <span className="text-gray-700">
              I'd like to receive fashion news and updates from DBC Elegance Couture.
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-500">
          By creating an account, you confirm you've read and agree to the Privacy Policy, 
          and consent to DBC Elegance Couture processing your personal data to manage your account.
        </p>
      </section>

      <button
        type="button"
        onClick={sendOtp}
        disabled={isSendingOtp}
        className={`w-full py-3 rounded-sm text-white text-sm font-medium flex items-center justify-center space-x-2 transition-all ${
          !isSendingOtp 
            ? "bg-black hover:bg-gray-800 active:bg-gray-900" 
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        <span>{isSendingOtp ? "Sending OTP..." : "Create Account"}</span>
        <FiArrowRight size={12} />
      </button>
      <p className="text-xs text-center text-gray-400">You will receive an activation code by email to validate your account creation.</p>
    </form>
  );

  // Render the OTP verification form
  const renderOtpForm = () => (
    <div className="space-y-4">
      <button
        onClick={() => setOtpSent(false)}
        className="flex items-center text-gray-600 hover:text-black transition-colors"
      >
        <FiArrowLeft className="mr-2" /> Back
      </button>
      
      <div className="p-6 border border-gray-200 rounded-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Verify Your Account</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">
          We've sent an 8-digit verification code to your email and phone.
        </p>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
            Verification Code
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
              className="flex-1 p-3 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent transition-colors"
            />
          </div>
        </div>
        
        <div className="flex items-center text-sm mb-4">
          <button
            onClick={resendOtp}
            disabled={otpCountdown > 0 || isSendingOtp}
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
          >
            {isSendingOtp ? "Sending..." : "Resend OTP"}
          </button>
          {otpCountdown > 0 && (
            <span className="ml-2 text-gray-500 flex items-center">
              <FiClock className="mr-1" /> Wait {otpCountdown}s
            </span>
          )}
        </div>

        <button
          onClick={verifyOtp}
          disabled={isVerifying || otp.length !== 8}
          className={`w-full py-3 rounded-sm text-white text-sm font-medium flex items-center justify-center space-x-2 transition-all ${
            !isVerifying && otp.length === 8
              ? "bg-black hover:bg-gray-800 active:bg-gray-900" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <span>{isVerifying ? "Verifying..." : "Verify Account"}</span>
          <FiArrowRight size={12} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-start pt-8">
      <div className="w-full bg-white">
        {otpSent ? renderOtpForm() : renderRegistrationForm()}
      </div>
    </div>
  );
};

export default SignupForm;