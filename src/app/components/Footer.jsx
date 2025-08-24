'use client';
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaLinkedin, FaTiktok, FaSnapchat } from 'react-icons/fa';

export default function Footer() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-white text-black px-6 py-10 ">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <h3 className="text-lg font-medium mb-4">Inspire me with all the latest DBC Elegance news</h3>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Links Grid - Now 3 columns instead of 4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Client Services */}
          <div className="border-b md:border-none border-gray-200 pb-4 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-medium text-lg mb-4 md:mb-6 focus:outline-none"
              onClick={() => toggleSection('services')}
            >
              Client Services
              <span className="md:hidden">
                {openSections['services'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <ul className={`${openSections['services'] ? 'block' : 'hidden'} md:block space-y-3 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors">Delivery and Returns</a></li>
              <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Complaints</a></li>
            </ul>
          </div>

          {/* The House of DBC Elegance */}
          <div className="border-b md:border-none border-gray-200 pb-4 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-medium text-lg mb-4 md:mb-6 focus:outline-none"
              onClick={() => toggleSection('house')}
            >
              The House of DBC Elegance
              <span className="md:hidden">
                {openSections['house'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <ul className={`${openSections['house'] ? 'block' : 'hidden'} md:block space-y-3 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors">DBC Elegance Couture</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Heritage</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Legal Terms */}
          <div className="border-b md:border-none border-gray-200 pb-4 md:pb-0">
            <button 
              className="flex justify-between items-center w-full font-medium text-lg mb-4 md:mb-6 focus:outline-none"
              onClick={() => toggleSection('legal')}
            >
              Legal Terms
              <span className="md:hidden">
                {openSections['legal'] ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <ul className={`${openSections['legal'] ? 'block' : 'hidden'} md:block space-y-3 text-gray-600`}>
              <li><a href="#" className="hover:text-black transition-colors">General Sales Conditions</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Legal Terms</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Notice</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Your Privacy Choices & Cookies</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Ethics & Compliance</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6 md:mb-0">
            <span className="font-medium">Follow Us</span>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaTiktok /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaInstagram /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaTwitter /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaFacebookF /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaPinterest /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaSnapchat /></a>
              <a href="#" className="text-gray-600 hover:text-black transition-colors"><FaLinkedin /></a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="text-2xl  font-bold mb-2">DBC ELEGANCE</div>
            {/* <p className="text-sm text-gray-600">© {new Date().getFullYear()} DBC ELEGANCE. All rights reserved.</p> */}
          </div>
        </div>
      </div>
    </footer>
  );
}