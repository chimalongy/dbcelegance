'use client';

import React, { useState } from 'react';
import { useNavStore } from '../lib/store/navmodalstore';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CiSearch, CiHeart, CiUser, CiShoppingCart } from 'react-icons/ci';
import Link from 'next/link';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    selectednavtab,
    setSelectedNavTab,
    clearSelectedNavTab,
    showmodal,
    setShowModal
  } = useNavStore();

  const handleIconClick = (tab) => {
    setSelectedNavTab(tab);
    setShowModal(true);
  };

  return (
    <nav className="w-full border-b border-gray-100 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white z-50 shadow-sm relative">
      {/* Left - Hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <FaTimes className="text-2xl text-gray-700" />
          ) : (
            <FaBars className="text-2xl text-gray-700" />
          )}
        </button>
      </div>

      {/* Center - Logo */}
      <div className="absolute left-1/3 lg:left-1/2 transform -translate-x-1/2 text-lg md:text-2xl font-serif font-medium tracking-wide text-gray-900">
        DBC ELEGANCE
      </div>

      {/* Right - Icons */}
      <div className="flex items-center space-x-4 ml-auto">
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-1"
          onClick={() => handleIconClick('search')}
        >
          <CiSearch className=" w-4 h-4 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-1"
          onClick={() => handleIconClick('wishlist')}
        >
          <CiHeart className=" w-4 h-4 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-1"
          onClick={() => handleIconClick('user')}
        >
          <CiUser className=" w-4 h-4 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-gray-700 hover:text-gray-900 transition-colors p-1"
          onClick={() => handleIconClick('cart')}
        >
          <CiShoppingCart className=" w-4 h-4 lg:w-7 lg:h-7" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 animate-fadeIn md:hidden">
          <ul className="space-y-3 p-5 text-gray-800 text-sm">
            <li className="py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              What's New
            </li>
            <li className="py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              <Link href="/store/mensfashion">Men's Fashion</Link>
            </li>
            <li className="py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              <Link href="/store/femalefashion">Women's Fashion</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
