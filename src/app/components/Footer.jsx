'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaLinkedin, FaTiktok, FaSnapchat } from 'react-icons/fa';

export default function Footer() {
  const [openSections, setOpenSections] = useState({});
  const [email, setEmail] = useState('');

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed with:', email);
    setEmail('');
  };

  return (
    <footer className="bg-white text-black px-6 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="border-b border-gray-200 pb-10 mb-12">
          <h3 className="text-lg font-light tracking-wide mb-6 text-center md:text-left">
            INSPIRE ME WITH ALL THE LATEST DBC ELEGANCE NEWS
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto md:mx-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-black transition-colors duration-200 text-sm tracking-wide placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded-sm font-light tracking-wider hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap text-sm uppercase"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Links Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Client Services */}
          <div className="border-b md:border-none border-gray-200 pb-6 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-light text-sm tracking-wide uppercase mb-6 focus:outline-none group"
              onClick={() => toggleSection('services')}
            >
              CLIENT SERVICES
              <span className="md:hidden">
                {openSections['services'] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </span>
            </button>
            <ul className={`${openSections['services'] ? 'block' : 'hidden'} md:block space-y-4 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Delivery and Returns</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">FAQ</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Contact Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Complaints</a></li>
            </ul>
          </div>

          {/* The House of DBC Elegance */}
          <div className="border-b md:border-none border-gray-200 pb-6 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-light text-sm tracking-wide uppercase mb-6 focus:outline-none group"
              onClick={() => toggleSection('house')}
            >
              THE HOUSE OF DBC ELEGANCE
              <span className="md:hidden">
                {openSections['house'] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </span>
            </button>
            <ul className={`${openSections['house'] ? 'block' : 'hidden'} md:block space-y-4 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">DBC Elegance Couture</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Heritage</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Sustainability</a></li>
            </ul>
          </div>

          {/* Legal Terms */}
          <div className="border-b md:border-none border-gray-200 pb-6 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-light text-sm tracking-wide uppercase mb-6 focus:outline-none group"
              onClick={() => toggleSection('legal')}
            >
              LEGAL TERMS
              <span className="md:hidden">
                {openSections['legal'] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </span>
            </button>
            <ul className={`${openSections['legal'] ? 'block' : 'hidden'} md:block space-y-4 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">General Sales Conditions</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Legal Terms</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Privacy Notice</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Your Privacy Choices & Cookies</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Ethics & Compliance</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Accessibility</a></li>
              <li><a href="#" className="hover:text-black transition-colors duration-200 text-sm tracking-wide block py-1">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8 md:mb-0">
            <span className="font-light text-sm tracking-wide uppercase text-gray-700">FOLLOW US</span>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaTiktok className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaPinterest className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaSnapchat className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors duration-200 p-2">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-2xl font-light tracking-widest mb-3">DBC ELEGANCE</div>
            <p className="text-xs text-gray-500 tracking-wide">
              © {new Date().getFullYear()} DBC ELEGANCE. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}