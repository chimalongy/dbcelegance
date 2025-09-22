"use client";

import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CheckOutSteps = ({
  showForm, setShowForm,
  selectedShipping, setSelectedShipping,
  useShippingForBilling, setUseShippingForBilling,
  selectedPayment, setSelectedPayment,
  formData, setFormData,
  billingFormData, setBillingFormData,
  errors, setErrors,
  billingErrors, setBillingErrors,
  countries, setCountries,
  validate, validateBilling,
  completedSteps, setCompletedSteps,
  isPurchaseReady, setIsPurchaseReady
}) => {
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    shippingAddress: true,
    shippingMethod: false,
    billingPayment: false
  });

  // State for step enablement
  const [enabledSteps, setEnabledSteps] = useState({
    shippingAddress: true,
    shippingMethod: false,
    billingPayment: false
  });

  // Check if shipping address form is valid
  const isShippingAddressValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.country &&
      formData.address &&
      formData.phone &&
      !errors.firstName &&
      !errors.lastName &&
      !errors.country &&
      !errors.address &&
      !errors.phone
    );
  };

  // Check if billing address form is valid (when not using shipping address)
  const isBillingAddressValid = () => {
    if (useShippingForBilling) return true;

    return (
      billingFormData.firstName &&
      billingFormData.lastName &&
      billingFormData.country &&
      billingFormData.address &&
      billingFormData.phone &&
      !billingErrors.firstName &&
      !billingErrors.lastName &&
      !billingErrors.country &&
      !billingErrors.address &&
      !billingErrors.phone
    );
  };

  // Check if billing step is complete
  const isBillingStepComplete = useShippingForBilling ||
    (billingFormData.firstName &&
      billingFormData.lastName &&
      billingFormData.country &&
      billingFormData.address &&
      billingFormData.phone &&
      !billingErrors.firstName &&
      !billingErrors.lastName &&
      !billingErrors.country &&
      !billingErrors.address &&
      !billingErrors.phone);

  // Update completion status when billing data changes
  useEffect(() => {
    setCompletedSteps(prev => ({
      ...prev,
      billingPayment: isBillingStepComplete
    }));

    // Set purchase ready status (same condition as when Purchase now button is enabled)
    setIsPurchaseReady(isBillingStepComplete);

  }, [isBillingStepComplete, setCompletedSteps, setIsPurchaseReady]);

  // Toggle section expansion (only if step is enabled)
  const toggleSection = (section) => {
    if (!enabledSteps[section]) return;

    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle completion of shipping address step
  const handleShippingAddressComplete = () => {
    if (!isShippingAddressValid()) return;

    setCompletedSteps(prev => ({ ...prev, shippingAddress: true }));
    setEnabledSteps(prev => ({ ...prev, shippingMethod: true }));
    setExpandedSections({
      shippingAddress: false,
      shippingMethod: true,
      billingPayment: false
    });
  };

  // Handle completion of shipping method step
  const handleShippingMethodComplete = () => {
    if (!selectedShipping) return;

    setCompletedSteps(prev => ({ ...prev, shippingMethod: true }));
    setEnabledSteps(prev => ({ ...prev, billingPayment: true }));
    setExpandedSections({
      shippingAddress: false,
      shippingMethod: false,
      billingPayment: true
    });
  };

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name");
        if (!res.ok) {
          throw new Error(`Failed to fetch countries: ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected response format");
        }

        const countryNames = data
          .map((c) => c.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountries([]); // fallback so UI doesn't break
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Shipping Address Submitted:", formData);
    // submit to API here
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (!validateBilling()) return;

    console.log("Billing Address Submitted:", billingFormData);
    // submit to API here
  };

  // Shipping methods data
  const shippingMethods = [
    {
      id: "express",
      name: "Express delivery",
      description: "Estimated delivery in 3 5 Days",
      price: "Included"
    },
    {
      id: "standard",
      name: "Complimentary standard delivery",
      description: "Estimated delivery 2 Weeks",
      price: null
    },
  ];

  return (
    <div className="p-3 mx-auto pt-8 bg-gray-50">
      {/* Step 1: Shipping Address */}
      <div className={`bg-white mb-4 ${!enabledSteps.shippingAddress ? 'opacity-60' : ''}`}>
        <button
          className={`w-full p-4 lg:p-6 text-left flex justify-between items-center ${!enabledSteps.shippingAddress ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          onClick={() => toggleSection('shippingAddress')}
          disabled={!enabledSteps.shippingAddress}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${completedSteps.shippingAddress
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-600'
              }`}>
              {completedSteps.shippingAddress ? '✓' : '1'}
            </div>
            <h2 className="text-lg font-semibold">Shipping address</h2>
          </div>
          {enabledSteps.shippingAddress && (
            expandedSections.shippingAddress ? <FiChevronUp /> : <FiChevronDown />
          )}
        </button>

        {expandedSections.shippingAddress && enabledSteps.shippingAddress && (
          <div className="px-4 lg:px-12 pb-8">
            <p className="text-sm text-gray-600 mb-4">Enter your delivery address:</p>

            <div className="p-4 lg:p-8 bg-gray-50 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showForm}
                  onChange={() => setShowForm(!showForm)}
                  className="accent-black"
                />
                <span className="font-medium">Add new delivery address</span>
              </label>

              <p className="text-sm text-gray-600 mt-2">
                Please note that we require the client's presence, signature and/or ID are required for delivery.
              </p>

              {showForm && (
                <div className="mt-6 pt-6 bg-white p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    All fields marked <span className="text-red-500">*</span> are mandatory.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Title
                      </label>
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

                    {/* First / Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                          * First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                          * Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Country / Region
                      </label>
                      <div className="relative">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 pr-8 focus:outline-none bg-transparent appearance-none transition-colors"
                        >
                          <option value="">Select a country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Please ensure your address is correct. It is not possible to
                        modify it once your order has been placed.
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Phone Number
                      </label>
                      <div className="phone-input-container border-b border-gray-300 focus-within:border-black transition-colors">
                        <PhoneInput
                          country={"us"}
                          value={formData.phone}
                          onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
                          inputClass="!w-full !bg-transparent !border-none !outline-none !ring-0 !shadow-none py-2"
                          buttonClass="!bg-transparent !border-none"
                          dropdownClass="!bg-white !text-black"
                          containerClass="!w-full"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Please enter a valid phone number that can be used for delivery purposes.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 text-sm font-medium rounded-sm hover:bg-gray-800 active:bg-gray-900 transition-colors"
                        onClick={handleShippingAddressComplete}
                        disabled={!isShippingAddressValid()}
                      >
                        Add this address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-sm underline text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <button
              className={`px-6 py-3 text-sm font-medium rounded-sm transition-colors ${isShippingAddressValid()
                  ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={handleShippingAddressComplete}
              disabled={!isShippingAddressValid()}
            >
              Continue to Shipping Method
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Shipping Method */}
      <div className={`bg-white mb-4 ${!enabledSteps.shippingMethod ? 'opacity-60' : ''}`}>
        <button
          className={`w-full p-4 lg:p-6 text-left flex justify-between items-center ${!enabledSteps.shippingMethod ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          onClick={() => toggleSection('shippingMethod')}
          disabled={!enabledSteps.shippingMethod}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${completedSteps.shippingMethod
                ? 'bg-black text-white'
                : enabledSteps.shippingMethod
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
              {completedSteps.shippingMethod ? '✓' : '2'}
            </div>
            <h2 className="text-lg font-semibold">Shipping method</h2>
          </div>
          {enabledSteps.shippingMethod && (
            expandedSections.shippingMethod ? <FiChevronUp /> : <FiChevronDown />
          )}
        </button>

        {expandedSections.shippingMethod && enabledSteps.shippingMethod && (
          <div className="px-4 lg:px-12 pb-8">
            <p className="text-sm text-gray-600 mb-4">Choose a shipping method for your delivery</p>

            <div className="p-4 lg:p-8 bg-gray-50 mb-4">
              {shippingMethods.map((method) => (
                <div key={method.id} className="mb-4 last:mb-0">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={selectedShipping === method.id}
                      onChange={() => setSelectedShipping(method.id)}
                      className="accent-black mt-1"
                    />
                    <div className="flex-1">
                      <span className="font-medium block">{method.name}</span>
                      <span className="text-sm text-gray-600 block">{method.description}</span>
                    </div>
                    {method.price && (
                      <span className="text-sm font-medium">{method.price}</span>
                    )}
                  </label>
                </div>
              ))}

              <p className="text-sm text-gray-600 mt-4 pt-4">
                Please note that we require the client's presence, signature and/or ID are required for delivery.
              </p>
            </div>

            <button
              className={`px-6 py-3 text-sm font-medium rounded-sm transition-colors ${selectedShipping
                  ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              onClick={handleShippingMethodComplete}
              disabled={!selectedShipping}
            >
              Continue to Billing & Payment
            </button>
          </div>
        )}
      </div>

      {/* Step 3: Billing & Payment */}
      <div className={`bg-white mb-4 ${!enabledSteps.billingPayment ? 'opacity-60' : ''}`}>
        <button
          className={`w-full p-4 lg:p-6 text-left flex justify-between items-center ${!enabledSteps.billingPayment ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
          onClick={() => toggleSection('billingPayment')}
          disabled={!enabledSteps.billingPayment}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${completedSteps.billingPayment
                ? 'bg-black text-white'
                : enabledSteps.billingPayment
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
              {completedSteps.billingPayment ? '✓' : '3'}
            </div>
            <h2 className="text-lg font-semibold">Billing & Payment</h2>
          </div>
          {enabledSteps.billingPayment && (
            expandedSections.billingPayment ? <FiChevronUp /> : <FiChevronDown />
          )}
        </button>

        {expandedSections.billingPayment && enabledSteps.billingPayment && (
          <div className="px-4 lg:px-12 pb-8">
            <div className="p-4 lg:p-8 bg-gray-50 mb-4">
              {/* Use shipping address for billing */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useShippingForBilling}
                    onChange={() => setUseShippingForBilling(!useShippingForBilling)}
                    className="accent-black mt-1"
                  />
                  <span className="font-medium">Use shipping address for billing</span>
                </label>
              </div>

              {/* Billing address form (shown when checkbox is unchecked) */}
              {!useShippingForBilling && (
                <div className="mt-6 pt-6 mb-6">
                  <h3 className="text-md font-semibold mb-2">Billing address</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    All fields marked <span className="text-red-500">*</span> are mandatory.
                  </p>

                  <form onSubmit={handleBillingSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Title
                      </label>
                      <div className="relative">
                        <select
                          name="title"
                          value={billingFormData.title}
                          onChange={handleBillingChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 pr-8 focus:outline-none bg-transparent appearance-none transition-colors"
                        >
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                          <option value="Other">Other</option>
                        </select>
                        <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* First / Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                          * First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={billingFormData.firstName}
                          onChange={handleBillingChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                        />
                        {billingErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{billingErrors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                          * Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={billingFormData.lastName}
                          onChange={handleBillingChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                        />
                        {billingErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{billingErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Country / Region
                      </label>
                      <div className="relative">
                        <select
                          name="country"
                          value={billingFormData.country}
                          onChange={handleBillingChange}
                          className="w-full border-b border-gray-300 focus:border-black py-2 pr-8 focus:outline-none bg-transparent appearance-none transition-colors"
                        >
                          <option value="">Select a country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {billingErrors.country && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.country}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingFormData.address}
                        onChange={handleBillingChange}
                        className="w-full border-b border-gray-300 focus:border-black py-2 focus:outline-none bg-transparent transition-colors"
                      />
                      {billingErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.address}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Please ensure your address is correct. It is not possible to
                        modify it once your order has been placed.
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                        * Phone Number
                      </label>
                      <div className="phone-input-container border-b border-gray-300 focus-within:border-black transition-colors">
                        <PhoneInput
                          country={"us"}
                          value={billingFormData.phone}
                          onChange={(phone) => setBillingFormData((prev) => ({ ...prev, phone }))}
                          inputClass="!w-full !bg-transparent !border-none !outline-none !ring-0 !shadow-none py-2"
                          buttonClass="!bg-transparent !border-none"
                          dropdownClass="!bg-white !text-black"
                          containerClass="!w-full"
                        />
                      </div>
                      {billingErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{billingErrors.phone}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Please enter a valid phone number that can be used for billing purposes.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 text-sm font-medium rounded-sm hover:bg-gray-800 active:bg-gray-900 transition-colors"
                      >
                        Add billing address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Terms and conditions */}
              <div className="text-xs text-gray-600 border-t pt-4">
                <p className="mb-4">
                  By clicking on "Purchase now" I confirm I have read and accepted the{" "}
                  <a href="/terms" className="underline text-blue-600 hover:text-blue-800">
                    terms and conditions of sale
                  </a>{" "}
                  and I agree to the processing of my personal data by DBC ELEGANCE in the conditions set forth in the terms of sale and for the purposes detailed in our Privacy Statement, such as the management of my order. If I am under 16 years old, I confirm I have parental consent to give my personal data. As per applicable laws and regulations, you are entitled to access, correct and delete any data that may relate to you. You may also ask us not to send you personalized communications on our products and services. You may exercise this right at any time, upon sending us notice by referring to our Contact section in our Privacy Statement.
                </p>

                {/* Purchase button */}
                <button
                  className={`w-full py-3 text-sm font-medium rounded-sm transition-colors ${isBillingStepComplete
                      ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={!isBillingStepComplete}
                >
                  Purchase now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOutSteps;