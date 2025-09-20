"use client";

import React from 'react';
import { CiCircleMinus } from 'react-icons/ci';
import { useLeftNavStore } from '../lib/store/leftnavmodalstore';

const NavLeftModal = () => {
  const { setShowLeftNavModal } = useLeftNavStore();

  return (
    <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-start items-end lg:items-stretch p-3 z-50">
      <div
        className="w-full lg:w-[25%] h-full bg-white rounded-sm flex flex-col animate-slide-in-left"
      >
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            {/* Close Button */}
            <button
              onClick={() => setShowLeftNavModal(false)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors duration-200 uppercase tracking-wide"
              aria-label="Close modal"
            >
              <CiCircleMinus className="text-lg" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
          <div className="w-full flex flex-col gap-4 items-center justify-center py-10 px-6">
            Content here
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NavLeftModal;
