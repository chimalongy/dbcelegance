'use client';
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Logo + Socials */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-2xl font-bold font-serif mb-4">DBC Elegance</h1>
          <p className="mb-4 text-gray-300">Social Media</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#"><FaFacebookF className="hover:text-green-300" /></a>
            <a href="#"><FaTwitter className="hover:text-green-300" /></a>
            <a href="#"><FaInstagram className="hover:text-green-300" /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold mb-4">SHOP</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">Products</a></li>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Releases</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold mb-4">COMPANY</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">News</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold mb-4">STAY UP TO DATE</h3>
          <form className="flex w-full max-w-xs md:max-w-none">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-md border border-amber-700 text-white placeholder-gray-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="bg-amber-700 text-white px-4 rounded-r-md font-semibold hover:bg-amber-600 transition"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-amber-600 mt-10 pt-6 text-sm text-gray-300 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2">
        <p className="hidden sm:block">&nbsp;</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
