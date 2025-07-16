'use client';

import React, { useState } from 'react';
import { useNavStore } from '../lib/store/navmodalstore';

import {
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
  FaUser,
  FaShoppingBag
} from 'react-icons/fa';

import { CiSearch } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import Link from 'next/link';


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { selectednavtab, setSelectedNavTab, clearSelectedNavTab, showmodal,setShowModal } = useNavStore();
  

  return (
    <nav className="w-full border-b border-gray-100 px-6 py-4 flex justify-between items-center relative bg-white z-50 shadow-sm">
      {/* Left - Hamburger */}
      <div className="">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <FaTimes className="text-xl text-gray-700 hover:text-gray-900 transition-colors" />
          ) : (
            <FaBars className="text-xl text-gray-700 hover:text-gray-900 transition-colors" />
          )}
        </button>
      </div>

      {/* Center - Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 lg:text-2xl font-serif lg:font-medium lg:tracking-wider text-gray-900">
        DBC ELEGANCE
      </div>


      {/* Right - Icons */}
      <div className="flex  ml-auto">
        <button className="p-1 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          onClick={
            () => {
              setSelectedNavTab("search")
              console.log(selectednavtab)
              setShowModal(true)
            }
          }
        >
          <CiSearch  className="" />
        </button>
        <button className="p-1 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          onClick={
            () => {
              setSelectedNavTab("wishlist")
              console.log(selectednavtab)
              setShowModal(true)
            }
          }

        >
          <CiHeart  className="" />
        </button>
        <button className="p-1 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          onClick={
            () => {
              setSelectedNavTab("user")
              console.log(selectednavtab)
              setShowModal(true)
            }
          }
        >
          <CiUser  className="" />
        </button>
        <button className="p-1 text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
          onClick={
            () => {
              setSelectedNavTab("cart")
              console.log(selectednavtab)
              setShowModal(true)
            }
          }
        >
          <CiShoppingCart size={24} className="" />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 animate-fadeIn">
          <ul className="space-y-4 p-6 text-gray-800">
            <li className="cursor-pointer py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              What's New
            </li>
            <li className="cursor-pointer py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              <Link href={"/store/mensfashion"}> Men's Fashion</Link>
            </li>
            <li className="cursor-pointer py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors">
              <Link href={"/store/femalefashion"}> Women's Fashion</Link>
            </li>

          </ul>
        </div>
      )}
    </nav>
  );
}