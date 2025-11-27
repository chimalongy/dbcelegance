'use client';
import React, { useState } from 'react';

export default function Complaints() {
  const [complaintData, setComplaintData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    complaintType: '',
    description: '',
    resolution: ''
  });

  const handleChange = (e) => {
    setComplaintData({
      ...complaintData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle complaint submission
    console.log('Complaint submitted:', complaintData);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-8 text-center">COMPLAINTS</h1>
        
        <div className="space-y-8">
          <section className="text-center">
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              At DBC ELEGANCE, we strive for excellence in every aspect of our service. 
              If we have fallen short of your expectations, please let us know so we can make it right.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">SUBMIT A COMPLAINT</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={complaintData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={complaintData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={complaintData.orderNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200"
                />
              </div>

              <div>
                <label htmlFor="complaintType" className="block text-sm font-medium text-gray-700 mb-2">
                  Nature of Complaint *
                </label>
                <select
                  id="complaintType"
                  name="complaintType"
                  required
                  value={complaintData.complaintType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200"
                >
                  <option value="">Select complaint type</option>
                  <option value="product-quality">Product Quality</option>
                  <option value="delivery-issue">Delivery Issue</option>
                  <option value="customer-service">Customer Service</option>
                  <option value="website-experience">Website Experience</option>
                  <option value="boutique-experience">Boutique Experience</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows="6"
                  value={complaintData.description}
                  onChange={handleChange}
                  placeholder="Please provide as much detail as possible about your complaint..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 resize-none"
                ></textarea>
              </div>

              <div>
                <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Resolution
                </label>
                <textarea
                  id="resolution"
                  name="resolution"
                  rows="3"
                  value={complaintData.resolution}
                  onChange={handleChange}
                  placeholder="What would you like us to do to resolve this issue?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 resize-none"
                ></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  We take all complaints seriously and will respond within 48 hours. 
                  Your feedback helps us improve our services.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white px-8 py-4 rounded-sm font-light tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase"
              >
                SUBMIT COMPLAINT
              </button>
            </form>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">ALTERNATIVE CONTACT METHODS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">BY PHONE</h3>
                <p className="text-gray-600 mb-2">Speak directly with our Complaints Resolution Team</p>
                <p className="text-lg font-medium">+1 (888) 555-0151</p>
                <p className="text-sm text-gray-500 mt-2">Monday-Friday, 9AM-6PM EST</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">BY MAIL</h3>
                <p className="text-gray-600">
                  DBC ELEGANCE Complaints Department<br />
                  27 rue Jean Goujon<br />
                  75008 PARIS<br />
                  FRANCE
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}