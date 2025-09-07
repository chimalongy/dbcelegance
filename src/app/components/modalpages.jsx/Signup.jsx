import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiEye, FiEyeOff, FiClock, FiArrowLeft } from "react-icons/fi";
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
    sharePreferences: false,
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

    if (!formData.sharePreferences) {
      newErrors.sharePreferences = "You must agree to store preferences";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send OTP to the user (frontend simulation)
  const sendOtp = async () => {
    if (!validateInputs()) {
      return; // stop if validation fails
    }

    setIsSendingOtp(true);
    try {
      // Generate OTP on frontend
      const newOtp = generateOtp();
      setGeneratedOtp(newOtp);
      
      // Simulate API call to send OTP to user's email/phone
      // In a real scenario, you would make an API call to your backend
      // to actually send the OTP via email/SMS
      await axios.post(apiSummary.store.auth.sendOtp, {
        firstName:formData.firstName, 
        duration:30,
        email: formData.email,
        section:"register",
        otp: newOtp // Send the generated OTP to backend for actual delivery
      });


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
    } catch (error) {
      console.error("❌ OTP Sending Error:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP on frontend
  const verifyOtp = async () => {
    if (!otp || otp.length !== 8) {
      toast.error("Please enter a valid 8-digit OTP");
      return;
    }

    setIsVerifying(true);
    try {
      // Verify OTP on frontend
      if (otp === generatedOtp) {
        // OTP is correct, proceed with registration
        const response = await axios.post(apiSummary.store.auth.register, 
          formData,
        );

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
            sharePreferences: false,
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
      console.error("❌ Registration Error:", error);
      if (error.response) {
        toast.error(error.response.data?.error || "Server error occurred.");
      } else {
        toast.error("Network error. Please check your connection.");
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
      
      // Simulate API call to resend OTP
      await axios.post(apiSummary.store.auth.sendOtp, {
        firstName:formData.firstName, 
        duration:30,
        email: formData.email,
        section:"register",
        otp: newOtp // Send the generated OTP to backend for actual delivery
      });

     
    
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
    } catch (error) {
      console.error("❌ OTP Resend Error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Render the registration form
  const renderRegistrationForm = () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>
      
      {/* Login Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Login Information *</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        <div className="mb-2 relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handlePasswordChange}
            className="w-full p-2 border border-gray-300 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500 hover:text-black"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            <p>Your password must include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li className={passwordRequirements.length ? "text-green-500" : ""}>
                Minimum 8 characters
              </li>
              <li className={passwordRequirements.lowercase ? "text-green-500" : ""}>
                One lowercase letter
              </li>
              <li className={passwordRequirements.uppercase ? "text-green-500" : ""}>
                One uppercase letter
              </li>
              <li className={passwordRequirements.digit ? "text-green-500" : ""}>
                One number
              </li>
              <li className={passwordRequirements.specialChar ? "text-green-500" : ""}>
                One special character (@#$%^&*)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Personal Info */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Personal Information *</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <div className="relative">
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <PhoneInput
            country={"us"} // default country
            value={formData.phone}
            onChange={(phone) =>
              setFormData((prev) => ({ ...prev, phone }))
            }
            inputClass="w-full p-2 border border-gray-300 rounded"
            containerClass="w-full"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}
        </div>
      </section>

      {/* Preferences */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Preferences & Terms *
        </h2>

        <div className="mb-3">
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="fashionNews"
              checked={formData.fashionNews}
              onChange={handleChange}
            />
            <span>
              I'd like to receive fashion news and updates from DBC Elegance
              Couture.
            </span>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="sharePreferences"
              checked={formData.sharePreferences}
              onChange={handleChange}
            />
            <span>
              I agree to store my shopping preferences to enhance future
              recommendations.
            </span>
          </label>
          {errors.sharePreferences && (
            <p className="text-red-500 text-xs">{errors.sharePreferences}</p>
          )}
        </div>

        <p className="text-xs text-gray-500">
          By clicking "Create an account", you confirm you've read and agree
          to the Privacy Policy, and consent to DBC Elegance Couture
          processing your personal data to manage your account.
        </p>
      </section>

      <button
        type="button"
        onClick={sendOtp}
        disabled={isSendingOtp}
        className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {isSendingOtp ? "Sending OTP..." : "Proceed"}
      </button>
    </form>
  );

  // Render the OTP verification form
  const renderOtpForm = () => (
    <div>
      <button
        onClick={() => setOtpSent(false)}
        className="flex items-center text-gray-600 hover:text-black mb-4"
      >
        <FiArrowLeft className="mr-2" /> Back to registration
      </button>
      
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Verify Your Account</h1>
        <p className="text-sm text-gray-600 mb-3">
          We've sent an 8-digit verification code to your email and phone.
        </p>
       
        
        <div className="flex items-center gap-3 mb-3">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
            className="flex-1 p-3 border border-gray-300 rounded"
          />
          <button
            onClick={verifyOtp}
            disabled={isVerifying || otp.length !== 8}
            className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
        
        <div className="flex items-center text-sm">
          <button
            onClick={resendOtp}
            disabled={otpCountdown > 0 || isSendingOtp}
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {isSendingOtp ? "Sending..." : "Resend OTP"}
          </button>
          {otpCountdown > 0 && (
            <span className="ml-2 text-gray-500 flex items-center">
              <FiClock className="mr-1" /> Wait {otpCountdown}s
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-scroll mt-9 lg:px-12 py-6">
      <div className="h-fit">
        {otpSent ? renderOtpForm() : renderRegistrationForm()}
      </div>
    </div>
  );
};

export default SignupForm;