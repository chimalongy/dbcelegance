"use client";

import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

import { useSelectedStoreProducts } from "@/app/lib/store/selectedstoreproductsstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useSelectedProductStore } from "@/app/lib/store/selectedproductstore";

export default function Search({ setShowModal }) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const searchableList = useSelectedStoreProducts(
    (state) => state.selectedstoreproducts
  );

  const selectedCategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );

  const setSelectedProduct = useSelectedProductStore(
    (state) => state.setSelectedProduct
  );

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
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="flex items-center border-b-2 border-gray-200 focus-within:border-gray-500 transition-colors duration-300 pb-2">
          <FaSearch className="text-gray-400 text-lg mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for?"
            className="flex-1 border-none focus:outline-none text-gray-800 placeholder-gray-400 py-2 text-lg bg-transparent"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {searchTerm && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 font-medium">
              {filteredSuggestions?.length > 0
                ? `Found ${filteredSuggestions.length} matching product${filteredSuggestions.length !== 1 ? "s" : ""
                }`
                : "No matches found"}
            </p>
          </div>

          {filteredSuggestions?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {filteredSuggestions.map((product, idx) => (
                <div
                  key={idx}
                  onClick={() => handleProductClick(product)}
                  className="group cursor-pointer bg-white  overflow-hidden  hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        product?.product_gallery?.[0]?.url || "/no-image.png"
                      }
                      alt={product.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {product.product_name}
                    </p>
                    {product.product_price && (
                      <p className="text-xs text-gray-500 mt-1">
                        ${product.product_price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-300 mb-3">
                <FaSearch size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try different keywords or browse categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}