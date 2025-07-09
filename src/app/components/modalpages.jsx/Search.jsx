"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoArrowForwardSharp } from "react-icons/io5";

export default function Search () {
  const [searchTerm, setSearchTerm] = useState("");

  const suggestions = [
    "Saddle",
    "Sneaker b30",
    "J'Adior",
    "Earrings",
    "Gifts for her",
    "Gifts for him",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Search Input */}
      <div className="relative border-b border-gray-300">
        <div className="flex items-center">
          <FaSearch className="text-gray-400 text-sm mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 border-none focus:outline-none text-gray-800 placeholder-gray-400 py-2"
          />
          <IoArrowForwardSharp className="text-gray-400" />
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Suggestions</p>
        <ul className="space-y-2">
          {suggestions.map((item, idx) => (
            <li
              key={idx}
              className="text-gray-800 hover:underline hover:cursor-pointer text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

