"use client";

import React, { useState } from "react";
import { CiCircleMinus } from "react-icons/ci";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useLeftNavStore } from "../lib/store/leftnavmodalstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useSelectedStoreProducts } from "@/app/lib/store/selectedstoreproductsstore";
import { useUserSelectedCategory } from "../lib/store/UserSelectedCategory";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import axios from "axios";
import { apiSummary } from "../lib/apiSummary";

const NavLeftModal = () => {
  const { setShowLeftNavModal } = useLeftNavStore();
  const router = useRouter();
  const pathname = usePathname(); // ✅ track current path

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const setSelectedStoreCategories = useSelectedStoreCategories(
    (state) => state.setSelectedStoreCategories
  );
  const selectedstorecategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );

  const setSelectedStoreProducts = useSelectedStoreProducts(
    (state) => state.setSelectedStoreProducts
  );
  const selectedstoreproducts = useSelectedStoreProducts(
    (state) => state.selectedstoreproducts
  );

  const setUserSelectedStoreCategory = useUserSelectedCategory(
    (state) => state.setUserSelectedStoreCategory
  );
  const userselectedstorecategory = useUserSelectedCategory(
    (state) => state.userselectedstorecategory
  );

  const setSelectedProduct = useSelectedProductStore(
    (state) => state.setSelectedProduct
  );

  async function fetch_collections(store_name) {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.post(apiSummary.store.get_store_categories, { store_name }),
        axios.post(apiSummary.store.get_store_products, { store_name }),
      ]);

      if (categoriesRes.data.success && productsRes.data.success) {
        setSelectedStoreCategories(categoriesRes.data.data);
        setSelectedStoreProducts(productsRes.data.data);
        return true;
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
    return false;
  }

  const handleCategoryClick = (category, gender) => {
    const sanitizedCategory = category.category_name
      .toLowerCase()
      .replace(/\s+/g, "-");
    setUserSelectedStoreCategory(category);
    router.push(`/store/${gender}/${sanitizedCategory}`);
    setShowLeftNavModal(false); // ✅ close after category click
  };

  return (
    <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-start items-end lg:items-stretch p-3 z-50">
      <div className="w-full lg:w-[25%] h-full bg-white rounded-sm flex flex-col animate-slide-in-left p-2">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <button
              onClick={() => setShowLeftNavModal(false)}
              className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors duration-200 uppercase tracking-wide"
            >
              <CiCircleMinus className="text-lg" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
          <div className="w-full flex flex-col gap-2 p-3">
            {/* Main Links */}
            <button
              className="py-3 text-gray-700 text-left hover:bg-gray-50 rounded-md"
              onClick={() => {
                router.push("/store/whats-new");
                setShowLeftNavModal(false);
              }}
            >
              What’s New
            </button>

            {/* Categories */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                className="flex items-center justify-between w-full py-3 text-gray-800 font-light text-sm tracking-wide uppercase"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>CATEGORIES</span>
                {categoriesOpen ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>

              {categoriesOpen && (
                <div className="pl-2 mt-2 flex flex-col gap-1">
                  {selectedstorecategories?.map((category, index) => (
                    <p
                      key={index}
                      className={`block py-2 px-4 rounded-md text-sm cursor-pointer transition-colors ${
                        category.category_name ===
                        userselectedstorecategory?.category_name
                          ? "font-medium text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() =>
                        handleCategoryClick(
                          category,
                          category.store_name === "female" ? "women" : "men"
                        )
                      }
                    >
                      {category.category_name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Products */}
            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                className="flex items-center justify-between w-full py-3 text-gray-800 font-light text-sm tracking-wide uppercase"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                <span>PRODUCTS</span>
                {productsOpen ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>

              {productsOpen && (
                <div className="pl-2 mt-2 flex flex-col gap-1">
                  {selectedstoreproducts?.length > 0 ? (
                    selectedstoreproducts.map((product, index) => {
                      const category = selectedstorecategories.find(
                        (c) =>
                          String(c.category_id) ===
                          String(product.product_category)
                      );
                      return (
                        <p
                          key={index}
                          className="block py-2 px-4 rounded-md text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                          onClick={() => {
                            if (category) {
                              setSelectedProduct(product);
                              router.push(
                                `/store/${
                                  product.product_store === "female"
                                    ? "women"
                                    : "men"
                                }/${category.category_name.trim()}/${
                                  product.product_name.trim()
                                }`
                              );
                              setShowLeftNavModal(false);
                            }
                          }}
                        >
                          {product.product_name}
                        </p>
                      );
                    })
                  ) : (
                    <p className="py-3 px-4 text-gray-500 text-sm">
                      No products available
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Fixed Section */}
        <div className="p-1 bg-gray-400 flex justify-between rounded-md">
          {/* Men’s Fashion */}
          <button
            className={`py-3 px-4 text-gray-700 text-left rounded-md transition-colors ${
              pathname.includes("/store/men")
                ? "bg-white font-medium"
                : "hover:bg-gray-50"
            }`}
            onClick={async () => {
              let result = await fetch_collections("male");
              if (result) {
                router.push("/store/mensfashion");
                setShowLeftNavModal(false);
              }
            }}
          >
            Men’s Fashion
          </button>

          {/* Women’s Fashion */}
          <button
            className={`py-3 px-4 text-gray-700 text-left rounded-md transition-colors ${
              pathname.includes("/store/women")
                ? "bg-white font-medium"
                : "hover:bg-gray-50"
            }`}
            onClick={async () => {
              let result = await fetch_collections("female");
              if (result) {
                router.push("/store/womensfashion");
                setShowLeftNavModal(false);
              }
            }}
          >
            Women’s Fashion
          </button>
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
