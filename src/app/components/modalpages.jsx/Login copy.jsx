"use client";

import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = email && password;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please enter both email and password.");
      return;
    }
    // Perform login (simulate or call backend)
    console.log("Logging in:", { email, password });
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
    // <div className="flex flex-col lg:flex-row justify-between w-full max-w-5xl mx-auto p-6 ">
<div>
          <h1 className="text-2xl font-bold mb-6">Login</h1>
      {/* Left side info */}
      {/* <div className="hidden lg:flex flex-col justify-center w-1/3">
        <h2 className="text-lg font-semibold text-gray-800">Login</h2>
        <p className="text-sm text-gray-500 mt-1">To access your account</p>
      </div> */}

      {/* Right side form */}
      <div className="w-full lg:w-2/3 max-w-md mx-auto">
        {/* Social buttons */}
        {/* <div className="flex flex-col gap-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm"
          >
            <FaGoogle /> Google
          </button>
          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="border px-4 py-2 rounded-md flex items-center justify-center gap-2 text-sm"
          >
            <FaFacebook /> Facebook
          </button>
        </div> */}

        {/* Privacy */}
        {/* <p className="text-center text-xs text-gray-500 mt-4">Privacy statement</p> */}

        {/* Divider */}
        {/* <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">Or</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4 mt-36">
            
          <div>
            <label className="text-sm text-gray-700 font-medium">* Email address</label>
            <input
              type="email"
              className="w-full border-b focus:outline-none focus:border-black py-1 text-sm mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">* Password</label>
            <div className="flex items-center border-b">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 py-1 focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={() => alert("Redirecting to forgot password...")}
              className="text-sm text-gray-500 underline"
            >
              I forgot my password
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 rounded-md text-white text-sm font-medium ${
              isFormValid ? "bg-black hover:bg-gray-900" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Sign in to your account
          </button>

         
        </form>

        <hr className="my-6" />

        {/* Sign up */}
        {/* <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-700 font-semibold">Sign up</p>
            <p className="text-sm text-gray-500">Don't have an account yet?</p>
          </div>
          <button
            onClick={handleCreateAccount}
            className="bg-gray-900 text-white text-sm px-6 py-2 rounded-md hover:bg-black"
          >
            Create an account
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
