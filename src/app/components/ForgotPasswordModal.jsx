"use client";

import React, { useState, useEffect } from 'react';
import { CiCircleMinus } from 'react-icons/ci';
import { FiEye, FiEyeOff, FiClock, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPasswordModal = ({ setShowForgotPasswordModal }) => {
    const [step, setStep] = useState("email"); // email → otp → reset
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        digit: false,
        specialChar: false,
    });
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");
    const [otpCountdown, setOtpCountdown] = useState(0);
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Generate a random 8-digit OTP
    const generateOtp = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

    // Step 1: Send OTP
    const sendOtp = async () => {
        if (!formData.email) {
            toast.error("Email is required");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Enter a valid email address");
            return;
        }

        setIsSendingOtp(true);
        try {
            const newOtp = generateOtp();
            setGeneratedOtp(newOtp);

            const response = await axios.post(apiSummary.store.auth.sendOtp, {
                email: formData.email,
                otp: newOtp,
                duration: 30,
                section: "forgot-password",
            });

            if (response.data.success) {
                toast.success("OTP sent to your email!");
                setStep("otp");
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
            } 
            else if(response.data.email_registered) {
                 toast.error("This email is registered.")
            }
            
            else {
                toast.error(response.data.error || "Failed to send OTP");
            }
        } catch (error) {

            console.log("❌ OTP Sending Error:", error);
            toast.error(error.response.data.error);
        } finally {
            setIsSendingOtp(false);
        }
    };

    // Step 2: Verify OTP
    const verifyOtp = async () => {
        if (!otp || otp.length !== 8) {
            toast.error("Enter a valid 8-digit OTP");
            return;
        }

        setIsVerifyingOtp(true);
        try {
            if (otp === generatedOtp) {

                toast.success("OTP verified! Please reset your password.");
                setStep("reset");
            } else {
                toast.error("Invalid OTP. Try again.");
            }
        } catch (error) {
            console.log("❌ OTP Verification Error:", error);
            toast.error("OTP verification failed.");
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    // Step 3: Reset Password
    const resetPassword = async () => {
        if (!formData.password || !formData.confirmPassword) {
            toast.error("All fields are required");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (
            !(
                passwordRequirements.length &&
                passwordRequirements.lowercase &&
                passwordRequirements.uppercase &&
                passwordRequirements.digit &&
                passwordRequirements.specialChar
            )
        ) {
            toast.error("Password does not meet security requirements");
            return;
        }

        setIsResetting(true);
        try {
           
            const response = await axios.post(apiSummary.store.auth.update_password, {
                customerEmail: formData.email,
                fieldName:"password_hash",
                newValue: formData.password,
            });

            if (response.data.success) {
                toast.success("Password reset successful! You can now login.");
                setShowForgotPasswordModal(false);
            } else {
                toast.error(response.data.error || "Password reset failed");
            }
        } catch (error) {
            console.log("❌ Reset Error:", error);
            toast.error("Failed to reset password. Try again.");
        } finally {
            setIsResetting(false);
        }
    };

    // UI Renders
    const renderEmailForm = () => (
        <div className="w-full max-w-md flex flex-col gap-6">
            <p className="text-sm text-gray-600 text-center">
                Enter your email address below and we'll send you a code to reset your password.
            </p>

            <div className="flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:outline-none text-sm transition-colors"
                    required
                />

                <button
                    onClick={sendOtp}
                    disabled={isSendingOtp || !formData.email || !/\S+@\S+\.\S+/.test(formData.email)}
                    className={`${isSendingOtp || !formData.email || !/\S+@\S+\.\S+/.test(formData.email)
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        } text-white p-3 rounded-sm text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2`}
                >
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                    <FiArrowRight size={14} />
                </button>
            </div>
        </div>
    );

    const renderOtpForm = () => (
        <div className="w-full max-w-md flex flex-col gap-6">
            <button
                onClick={() => setStep("email")}
                className="flex items-center text-gray-600 hover:text-black self-start text-sm"
            >
                <FiArrowLeft className="mr-2" /> Back
            </button>

            <h2 className="text-sm font-medium uppercase tracking-wide text-center">Verify OTP</h2>
            <p className="text-sm text-gray-600 text-center">
                We sent an 8-digit code to {formData.email}
            </p>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:outline-none text-sm transition-colors"
                />

                <div className="flex justify-between items-center text-xs">
                    <button
                        onClick={sendOtp}
                        disabled={otpCountdown > 0 || isSendingOtp}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    >
                        {isSendingOtp ? "Sending..." : "Resend OTP"}
                    </button>
                    {otpCountdown > 0 && (
                        <span className="flex items-center text-gray-500">
                            <FiClock className="mr-1" /> {otpCountdown}s
                        </span>
                    )}
                </div>

                <button
                    onClick={verifyOtp}
                    disabled={isVerifyingOtp || otp.length !== 8}
                    className={`${isVerifyingOtp || otp.length !== 8
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        } text-white p-3 rounded-sm text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2`}
                >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                    <FiArrowRight size={14} />
                </button>
            </div>
        </div>
    );

    const renderResetForm = () => (
        <div className="w-full max-w-md flex flex-col gap-6">
            <button
                onClick={() => setStep("otp")}
                className="flex items-center text-gray-600 hover:text-black self-start text-sm"
            >
                <FiArrowLeft className="mr-2" /> Back
            </button>

            <h2 className="text-sm font-medium uppercase tracking-wide text-center">Reset Password</h2>

            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs text-gray-600 mb-1">New Password</label>
                    <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-black p-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                            className="flex-1 focus:outline-none bg-transparent text-sm"
                            placeholder="Enter new password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1 text-gray-500">
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Confirm Password</label>
                    <div className="flex items-center border border-gray-300 rounded-sm focus-within:border-black p-3">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="flex-1 focus:outline-none bg-transparent text-sm"
                            placeholder="Confirm new password"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1 text-gray-500">
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                    </div>
                </div>

                {isPasswordFocused && (
                    <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-sm">
                        <p className="mb-1 font-medium">Password must include:</p>
                        <ul className="space-y-1">
                            <li className={passwordRequirements.length ? "text-green-500" : ""}>• At least 8 characters</li>
                            <li className={passwordRequirements.lowercase ? "text-green-500" : ""}>• One lowercase letter</li>
                            <li className={passwordRequirements.uppercase ? "text-green-500" : ""}>• One uppercase letter</li>
                            <li className={passwordRequirements.digit ? "text-green-500" : ""}>• One number</li>
                            <li className={passwordRequirements.specialChar ? "text-green-500" : ""}>• One special character (@#$%^&*)</li>
                        </ul>
                    </div>
                )}

                <button
                    onClick={resetPassword}
                    disabled={isResetting}
                    className={`${isResetting
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                        } text-white p-3 rounded-sm text-sm font-medium tracking-wide transition-all flex items-center justify-center gap-2`}
                >
                    {isResetting ? "Resetting..." : "Reset Password"}
                    <FiArrowRight size={14} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end items-end lg:items-stretch p-3 z-50">
            <div
                className="w-full lg:w-[40%] lg:h-full h-[70%] bg-white rounded-sm flex flex-col"
                style={{
                    animation: 'slide-in-right 0.5s ease-out',
                }}
            >
                {/* Header */}
                <div className="border-b border-gray-200">
                    <div className="flex justify-between items-center px-6 py-4">
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowForgotPasswordModal(false);
                            }}
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors duration-200 uppercase tracking-wide"
                            aria-label="Close modal"
                        >
                            <CiCircleMinus className="text-lg" />
                            <span>CLOSE</span>
                        </button>

                        <div>
                            <h1 className="text-sm font-medium uppercase tracking-wide">
                                {step === "email" && "Forgot Password"}
                                {step === "otp" && "Verify OTP"}
                                {step === "reset" && "Reset Password"}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
                    <div className='w-full flex flex-col gap-4 items-center justify-center py-10 px-6'>
                        {step === "email" && renderEmailForm()}
                        {step === "otp" && renderOtpForm()}
                        {step === "reset" && renderResetForm()}

                        {step === "email" && (
                            <p
                                className="text-center text-xs text-gray-500 cursor-pointer mt-4"
                                onClick={() => setShowForgotPasswordModal(false)}
                            >
                                Back to login
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-in-right {
                  0% {
                    transform: translateX(100%);
                    opacity: 0;
                  }
                  100% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }
            `}</style>
        </div>
    );
};

export default ForgotPasswordModal;