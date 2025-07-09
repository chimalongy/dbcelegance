import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    title: 'Mr',
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+43',
    newsFashion: false,
    newsBeauty: false,
    sharePreferences: false
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    specialChar: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    
    setPasswordRequirements({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[@#$%^&*]/.test(password)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className='h-[100%] overflow-y-scroll' >
        <div className=" h-fit  ">
             <h1 className="text-2xl font-bold mb-6">Quick connect</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Login information</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email address</label>
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
              <p>Password requirements:</p>
              <ul className="list-disc pl-5">
                <li className={passwordRequirements.length ? 'text-green-500' : ''}>At least 8 characters</li>
                <li className={passwordRequirements.lowercase ? 'text-green-500' : ''}>Lower case letter</li>
                <li className={passwordRequirements.uppercase ? 'text-green-500' : ''}>Upper case letter</li>
                <li className={passwordRequirements.digit ? 'text-green-500' : ''}>1 digit</li>
                <li className={passwordRequirements.specialChar ? 'text-green-500' : ''}>Special character (@#$%^&*)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Personal information</h2>
          
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
            <label className="block text-sm font-medium mb-1">First name</label>
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
            <label className="block text-sm font-medium mb-1">Last name</label>
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
            <label className="block text-sm font-medium mb-1">Phone</label>
            <div className="flex">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-20 p-2 border border-gray-300 rounded-l"
              >
                <option value="+43">+43</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+33">+33</option>
              </select>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 p-2 border border-gray-300 rounded-r"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">My membership terms & conditions</h2>
          
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsFashion"
                checked={formData.newsFashion}
                onChange={handleChange}
                className="mr-2"
              />
              <span>I would like to be informed and inspired by news regarding Fashion & Accessories</span>
            </label>
          </div>
          
          <div className="mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="newsBeauty"
                checked={formData.newsBeauty}
                onChange={handleChange}
                className="mr-2"
              />
              <span>I would like to be informed and inspired by news regarding Fragrance & Beauty</span>
            </label>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sharePreferences"
                checked={formData.sharePreferences}
                onChange={handleChange}
                className="mr-2"
                required
              />
              <span>I accept for my purchasing preferences to be shared with the UMH group to improve the relevance of the offers and recommendations I receive (<a href="#" className="text-blue-500">See more</a>)</span>
            </label>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            By clicking on "Create an account" you confirm you have read the Privacy Policy and consent to the processing of your personal data by Christian Dior Couture for the management of your Client account relationship in the conditions set forth herein. Following Privacy Policy, Christian Dior Couture may send you commercial communications, including clienteling availability, allowing you to select to share your personal data and make decisions about how your personal data is used to provide you with the same personalized service worldwide, your personal data may be communicated to relevant entity of Christian Dior Couture worldwide for these purposes.
          </p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded hover:bg-gray-800 transition-colors"
        >
          Create an account
        </button>
        
        <div className="flex justify-center mt-4 text-xs">
          <a href="#" className="mx-2 text-gray-500 hover:text-gray-700">Privacy Policy</a>
          <a href="#" className="mx-2 text-gray-500 hover:text-gray-700">Legal mentions</a>
          <a href="#" className="mx-2 text-gray-500 hover:text-gray-700">Terms & conditions</a>
        </div>
      </form>
        </div>
     
    </div>
  );
};

export default SignupForm;