'use client';

import React, { useEffect, useState } from 'react';
import { useNavStore } from '../lib/store/navmodalstore';
import { FaBars, FaTimes } from 'react-icons/fa';
import { CiSearch, CiHeart, CiUser, CiShoppingCart } from 'react-icons/ci';
import { HiOutlineEquals } from "react-icons/hi2";
import Link from 'next/link';
import DbcEleganceLogo from './DBCEleganceLogo';
import { IoMdClose } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
   const pathname = usePathname(); // gives the current path
  const router = useRouter();     // lets you navigate programmatically
  const [menuOpen, setMenuOpen] = useState(false);
  const [showrightnavoptions, setshowrightnavoptions]= useState(false)
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


  useEffect(()=>{
   if (pathname =="/store/womensfashion" || pathname=="/store/mensfashion"){
  setshowrightnavoptions(false)
   }
   else{
     setshowrightnavoptions(true)
   }
  },[pathname])



  return (
    // <nav className=" w-full border-b border-gray-100 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white z-50 shadow-sm relative">
    <nav className="  absolute w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center  z-50 shadow-sm">
      {/* Left - Hamburger */}
      <div >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <IoMdClose className="text-2xl text-white" />
          ) : (
         
            <HiOutlineEquals className="text-2xl text-white" />
          )}
        </button>
      </div>

      {/* Center - Logo */}
      <div className={`  ${showrightnavoptions?"":"mx-auto"} text-white`}>
        <DbcEleganceLogo/>
      </div>

      {/* Right - Icons */}
      {
          showrightnavoptions &&
          <div className="flex items-center space-x-4 ml-auto">
        <button
          className="text-white hover:text-white transition-colors p-1"
          onClick={() => handleIconClick('search')}
        >
          <CiSearch className=" w-5 h-5 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-white hover:text-white transition-colors p-1"
          onClick={() => handleIconClick('wishlist')}
        >
          <CiHeart className=" w-5 h-5 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-white hover:text-white transition-colors p-1"
          onClick={() => handleIconClick('user')}
        >
          <CiUser className=" w-5 h-5 lg:w-7 lg:h-7" />
        </button>
        <button
          className="text-white hover:text-white transition-colors p-1"
          onClick={() => handleIconClick('cart')}
        >
          <CiShoppingCart className=" w-5 h-5 lg:w-7 lg:h-7" />
        </button>
      </div>
      }

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 animate-fadeIn ">
          <ul className="space-y-3 p-5 text-gray-600 ">
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
