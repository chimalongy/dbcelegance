"use client";

import React, { useState } from 'react';
import { CiSearch, CiHeart, CiUser, CiShoppingCart, CiCircleMinus } from 'react-icons/ci';
import Search from './Search';
import AccountsPage from './AccountsPage';

const ModalMain = () => {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [showModal, setShowModal] = useState(true);

  if (!showModal) return null;

  function renderActiveTab() {
    switch (activeTab) {
      case "search":
        return <Search />;
      case "wishlist":
        return <Search />; // Replace with actual Wishlist component
      case "profile":
        return <AccountsPage />; // Replace with actual Profile component
      case "cart":
        return <Search />; // Replace with actual Cart component
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end p-3 z-50">
      <div
        className="w-full lg:w-[50%] bg-white rounded shadow-lg flex flex-col"
        style={{
          animation: 'slide-in-right 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div className="border-b border-b-gray-300">
          <div className="flex justify-between items-center px-4 py-3">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
              aria-label="Close modal"
            >
              <CiCircleMinus className="text-xl" />
              <span>Close</span>
            </button>

            {/* Icons */}
            <div className="flex gap-6 items-center">
              {[
                { name: 'search', icon: <CiSearch /> },
                { name: 'wishlist', icon: <CiHeart /> },
                { name: 'profile', icon: <CiUser /> },
                { name: 'cart', icon: <CiShoppingCart /> },
              ].map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  aria-label={name}
                  className={`flex justify-center items-center h-[40px] w-[40px] ${
                    activeTab === name ? 'border-b-4 border-b-amber-500' : ''
                  }`}
                >
                  <span className="text-2xl text-gray-700">{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-grow overflow-y-auto p-6 min-h-0 hide-scrollbar">
          {renderActiveTab()}
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
