"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { useSelectedStoreProducts } from "@/app/lib/store/selectedstoreproductsstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useSelectedProductStore } from "@/app/lib/store/selectedproductstore";

export default function Search({ setShowModal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  const searchableList = useSelectedStoreProducts(
    (state) => state.selectedstoreproducts
  );

  const selectedCategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );

  const setSelectedProduct = useSelectedProductStore(
    (state) => state.setSelectedProduct
  );

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // ✅ Filter suggestions
  const filteredSuggestions = searchableList?.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product) => {
    const selected_category = selectedCategories.find(
      (category) =>
        String(category.category_id) === String(product.product_category)
    );

    if (selected_category) {
      setSelectedProduct(product);
      router.push(
        `/store/${product.product_store === "female" ? "women" : "mens"
        }/${selected_category.category_name.trim()}/${product.product_name.trim()}`
      );
      setShowModal(false);
    } else {
      console.warn("No category found for product:", product);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setIsInputFocused(false), 200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 md:p-6">
      {/* Search Header */}
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-light tracking-wide text-gray-900 uppercase">SEARCH</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">Discover our luxury collection</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6 md:mb-8">
        <div className={`flex items-center border-b-2 ${isInputFocused ? 'border-black' : 'border-gray-300'} transition-colors duration-300 pb-3`}>
          <FaSearch className="text-gray-400 text-base md:text-lg mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="What are you looking for?"
            className="flex-1 border-none focus:outline-none text-gray-800 placeholder-gray-400 py-1 md:py-2 text-base md:text-lg bg-transparent tracking-wide"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-black transition-colors p-1"
            >
              <FaTimes className="text-base md:text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {(searchTerm && isInputFocused) && (
        <div className="mt-2 animate-fadeIn">
          <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-gray-200 pb-2">
            <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
              {filteredSuggestions?.length > 0
                ? `${filteredSuggestions.length} PRODUCT${filteredSuggestions.length !== 1 ? "S" : ""} FOUND`
                : "NO MATCHES FOUND"}
            </p>
          </div>

          {filteredSuggestions?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {filteredSuggestions.map((product, idx) => (
                <div
                  key={idx}
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer bg-white overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={
                        product?.product_gallery?.[0]?.url || "/no-image.png"
                      }
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 md:p-4 border-t border-gray-100 group-hover:border-gray-300 transition-colors">
                    <p className="text-xs md:text-sm font-light text-gray-800 tracking-wide line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {product.product_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-8 md:py-12">
              <div className="text-gray-300 mb-3 md:mb-4">
                <FaSearch size={36} className="mx-auto md:size-12" />
              </div>
              <p className="text-xs md:text-sm text-gray-500 tracking-wide">NO PRODUCTS FOUND</p>
              <p className="text-xs text-gray-400 mt-1 md:mt-2 tracking-wide">
                Try different keywords or browse our categories
              </p>
            </div>
          ) : null}
        </div>
      )}

      {/* Browse Categories Hint */}
      {!searchTerm && (
        <div className="text-center py-8 md:py-12 border-t border-gray-100 mt-6 md:mt-8">
          <p className="text-xs md:text-sm text-gray-500 tracking-wide">ENTER SEARCH TERMS ABOVE</p>
          <p className="text-xs text-gray-400 mt-1 md:mt-2 tracking-wide">Or browse through our collections</p>
        </div>
      )}
    </div>
  );
}