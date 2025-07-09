"use client";

import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiSearch, CiHeart, CiUser, CiShoppingCart, CiCircleMinus  } from 'react-icons/ci';

const ModalMain = () => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [showModal, setShowModal] = useState(true);

  // if (!showModal) return null;

  return (
    <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end p-3 z-50">
      <div
        className="w-full lg:w-[50%] bg-white rounded shadow-lg"
        style={{
          animation: 'slide-in-right 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div className="border-b border-b-gray-300">
          <div className="flex justify-between items-center px-4">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black "
              aria-label="Close modal"
            >
              <CiCircleMinus  className="text-xl" />
              <span>Close</span>
            </button>

            {/* Icons */}
            <div className="flex gap-6 items-center">
              <button
                onClick={() => setActiveTab('search')}
                aria-label="Search"
                className={`flex justify-center items-center h-[40px] w-[40px] ${
                  activeTab === "search" ? "border-b-4 border-b-amber-500" : ""
                }`}
              >
                <CiSearch className="text-2xl text-gray-700" />
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                aria-label="Wishlist"
                className={`flex justify-center items-center h-[40px] w-[40px] ${
                  activeTab === "wishlist" ? "border-b-4 border-b-amber-500" : ""
                }`}
              >
                <CiHeart className="text-2xl text-gray-700" />
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                aria-label="Profile"
                className={`flex justify-center items-center h-[40px] w-[40px] ${
                  activeTab === "profile" ? "border-b-4 border-b-amber-500" : ""
                }`}
              >
                <CiUser className="text-2xl text-gray-700" />
              </button>
              <button
                onClick={() => setActiveTab('cart')}
                aria-label="Cart"
                className={`flex justify-center items-center h-[40px] w-[40px] ${
                  activeTab === "cart" ? "border-b-4 border-b-amber-500" : ""
                }`}
              >
                <CiShoppingCart className="text-2xl text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content Placeholder */}
        <div className="p-6">
          <p className="text-gray-600">Currently viewing: <strong>{activeTab}</strong></p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalMain;
