"use client"
import React from 'react';
import { FaTrash, FaLock, FaWindows } from 'react-icons/fa';
import { SiVisa, SiPaypal } from 'react-icons/si';
import { MdKeyboardArrowLeft } from "react-icons/md";

const ShoppingCart = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 flex border-b border-gray-200">
        <div className="flex gap-1 items-center">
          <MdKeyboardArrowLeft size={30} />
          Back
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p>DBC ELEGANCE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-center border flex-1">
        <div className="border flex-2 w-full h-full">LEFT</div>
        <div className="border flex-1 w-full h-full">RIGHT</div>
      </div>
    </div>
  );
};

export default ShoppingCart;
