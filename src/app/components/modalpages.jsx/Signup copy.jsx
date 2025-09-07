import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="h-full overflow-y-scroll mt-9 lg:px-12 px-4 py-6">
      <div className="h-fit">
        <h1 className="text-2xl font-bold mb-6">Create Your Account</h1>

        <form onSubmit={handleSubmit}>
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
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                <p>Your password must include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li
                    className={
                      passwordRequirements.length ? "text-green-500" : ""
                    }
                  >
                    Minimum 8 characters
                  </li>
                  <li
                    className={
                      passwordRequirements.lowercase ? "text-green-500" : ""
                    }
                  >
                    One lowercase letter
                  </li>
                  <li
                    className={
                      passwordRequirements.uppercase ? "text-green-500" : ""
                    }
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={
                      passwordRequirements.digit ? "text-green-500" : ""
                    }
                  >
                    One number
                  </li>
                  <li
                    className={
                      passwordRequirements.specialChar ? "text-green-500" : ""
                    }
                  >
                    One special character (@#$%^&*)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Personal Information *
            </h2>

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
                required
              />
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
                required
              />
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
                  I’d like to receive fashion news and updates from DBC Elegance
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
                  required
                />
                <span>
                  I agree to store my shopping preferences to enhance future
                  recommendations.
                </span>
              </label>
            </div>

            <p className="text-xs text-gray-500">
              By clicking “Create an account”, you confirm you’ve read and agree
              to the Privacy Policy, and consent to DBC Elegance Couture
              processing your personal data to manage your account. Your data
              may also be shared across our global network to offer you a
              personalized experience worldwide.
            </p>
          </section>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
          >
            Create an Account
          </button>

          <div className="flex justify-center mt-4 text-xs space-x-4 text-gray-500">
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700">
              Legal
            </a>
            <a href="#" className="hover:text-gray-700">
              Terms & Conditions
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
