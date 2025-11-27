'use client';
import React, { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderNumber: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      title: 'CLIENT SERVICE CENTER',
      details: [
        { label: 'Phone', value: '+1 (888) 555-0150' },
        { label: 'Email', value: 'clientservices@dbcelegance.com' },
        { 
          label: 'Hours', 
          value: 'Monday - Friday: 9:00 AM - 9:00 PM EST\nSaturday: 10:00 AM - 6:00 PM EST\nSunday: 12:00 PM - 5:00 PM EST'
        }
      ]
    },
    {
      title: 'CORPORATE OFFICE',
      details: [
        { label: 'Address', value: 'DBC ELEGANCE\n27 rue Jean Goujon\n75008 PARIS\nFRANCE' }
      ]
    },
    {
      title: 'PRESS INQUIRIES',
      details: [
        { label: 'Email', value: 'press@dbcelegance.com' },
        { label: 'Phone', value: '+1 (888) 555-0151' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 tracking-wide mb-4">CONTACT US</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our dedicated client service team is here to assist you with any inquiries. 
            Reach out to us and experience the DBC ELEGANCE standard of service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="bg-gray-50 p-8 rounded-sm mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-6">SEND US A MESSAGE</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm">
                  <p className="text-green-800 text-sm">
                    Thank you for your message. We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
                  <p className="text-red-800 text-sm">
                    There was an error sending your message. Please try again or contact us directly.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                      Order Number
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                      placeholder="If applicable"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product Inquiry</option>
                    <option value="order-support">Order Support</option>
                    <option value="returns-exchanges">Returns & Exchanges</option>
                    <option value="customization">Customization Services</option>
                    <option value="appointment">Book an Appointment</option>
                    <option value="corporate">Corporate Inquiries</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide text-xs">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm resize-none"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white px-8 py-4 rounded-sm font-light tracking-wider hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 uppercase text-sm"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            </div>

            {/* Live Chat Section */}
            <div className="bg-gray-600 text-white p-8 rounded-sm text-center">
              <h3 className="text-xl font-light mb-4">IMMEDIATE ASSISTANCE</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Need help right away? Start a live chat with our client advisors for real-time support.
              </p>
              <button className="bg-white text-black px-8 py-3 rounded-sm font-light tracking-wider hover:bg-gray-100 transition-colors duration-300 uppercase text-sm">
                START LIVE CHAT
              </button>
              <p className="text-gray-400 text-xs mt-4">
                Available Monday-Friday, 9AM-9PM EST
              </p>
            </div>
          </div>

          {/* Contact Information & Services */}
          <div>
            {/* Contact Methods */}
            <div className="space-y-8 mb-12">
              {contactMethods.map((method, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <h3 className="text-xl font-light text-gray-900 mb-6">{method.title}</h3>
                  <div className="space-y-4">
                    {method.details.map((detail, detailIndex) => (
                      <div key={detailIndex}>
                        <p className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">
                          {detail.label}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Services */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-sm">
                <h3 className="text-lg font-light text-gray-900 mb-4">BOOK AN APPOINTMENT</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Schedule a personalized shopping experience with our style advisors. 
                  Choose between in-boutique appointments or virtual consultations.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-sm font-light tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase text-sm">
                  BOOK APPOINTMENT
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-sm">
                <h3 className="text-lg font-light text-gray-900 mb-4">VISIT OUR BOUTIQUES</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Experience DBC ELEGANCE in person. Find your nearest boutique and discover our latest collections.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-sm font-light tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase text-sm">
                  FIND A BOUTIQUE
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-sm">
                <h3 className="text-lg font-light text-gray-900 mb-4">CARE SERVICES</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Learn about our repair and maintenance services to keep your DBC ELEGANCE pieces in perfect condition.
                </p>
                <button className="bg-black text-white px-6 py-3 rounded-sm font-light tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase text-sm">
                  LEARN MORE
                </button>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 p-6 border border-gray-200 rounded-sm">
              <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">RESPONSE TIME</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                We strive to respond to all inquiries within 24 hours during business days. 
                For urgent matters, please call our Client Service Center directly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">QUICK LINKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="/faq" className="text-center group">
              <div className="bg-gray-50 p-6 rounded-sm hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-light text-gray-900 mb-3 group-hover:text-black">FAQ</h3>
                <p className="text-gray-600 text-sm">Find answers to common questions</p>
              </div>
            </a>
            <a href="/delivery-returns" className="text-center group">
              <div className="bg-gray-50 p-6 rounded-sm hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-light text-gray-900 mb-3 group-hover:text-black">DELIVERY & RETURNS</h3>
                <p className="text-gray-600 text-sm">Shipping and return policies</p>
              </div>
            </a>
            <a href="/complaints" className="text-center group">
              <div className="bg-gray-50 p-6 rounded-sm hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-light text-gray-900 mb-3 group-hover:text-black">COMPLAINTS</h3>
                <p className="text-gray-600 text-sm">Submit formal complaints</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}