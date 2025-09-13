"use client";

import React, { useState } from 'react';
import { CiCircleMinus } from 'react-icons/ci';

const ForgotPasswordModal = ({ setShowForgotPasswordModal }) => {
    const [email, setEmail] = useState("");
    const [showOTPVerification, setShowOTpVerification] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: replace with your forgot password logic
        console.log("Password reset link sent to:", email);
        setShowForgotPasswordModal(false);
    };

    return (
        <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end items-end lg:items-stretch p-3 z-50">
            <div
                className="w-full lg:w-[40%] lg:h-full h-[60%] bg-white rounded-sm flex flex-col"
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
                            <h1 className="text-sm font-medium uppercase tracking-wide">Forgot Password</h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
                    <div className='w-full flex flex-col gap-4 items-center justify-center py-10 px-6 border'>
                        {
                            !showOTPVerification &&
                            <div className="w-full max-w-md flex flex-col gap-6">
                            <p className="text-sm text-gray-600 text-center">
                                Enter your email address below and we’ll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:outline-none text-sm transition-colors"
                                    required
                                />

                                <button
                                    type="submit"
                                    className={`${email.length < 1
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-black hover:bg-gray-800"
                                        } text-white p-3 rounded-sm text-sm font-medium tracking-wide transition-all`}
                                    disabled={email.length < 1}
                                >
                                    Send Reset Link
                                </button>
                            </form>


                        </div>
                        }

                        <p
                            className="text-center text-xs text-gray-500 cursor-pointer"
                            onClick={() => setShowForgotPasswordModal(false)}
                        >
                            Back to login
                        </p>
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
