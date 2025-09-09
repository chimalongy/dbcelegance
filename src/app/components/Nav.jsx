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
import { useSelectedStoreCategories } from '@/app/lib/store/selectedstorecategoriesstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';
import { useUserSelectedCategory } from '../lib/store/UserSelectedCategory';
import axios from 'axios';
import { apiSummary } from '../lib/apiSummary';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSelectedProductStore } from '../lib/store/selectedproductstore';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'], // choose weights you need
});

export default function Navbar() {
  const setSelectedStoreCategories = useSelectedStoreCategories(
    (state) => state.setSelectedStoreCategories
  );
  const setSelectedStoreProducts = useSelectedStoreProducts(
    (state) => state.setSelectedStoreProducts
  );

  const selectedstorecategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );

  const selectedstoreproducts = useSelectedStoreProducts(
    (state) => state.selectedstoreproducts
  );

  let setUserSelectedStoreCategory = useUserSelectedCategory((state) => state.setUserSelectedStoreCategory)
  let userselectedstorecategory = useUserSelectedCategory((state) => state.userselectedstorecategory)
  const setSelectedProduct = useSelectedProductStore((state) => state.setSelectedProduct)

  const pathname = usePathname();
  let gender = pathname == "/store/womensfashion" ? "women" : "men"
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showrightnavoptions, setshowrightnavoptions] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

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

  useEffect(() => {
    console.log(pathname)
    if (pathname == "/store/womensfashion" || pathname == "/store/mensfashion") {
      setshowrightnavoptions(false)
    }
    else {
      setshowrightnavoptions(true)
    }
  }, [pathname])

  async function fetch_collections(store_name) {
    console.log("hello")
    if (!store_name) {
      console.log("no storre name")
      return false;
    }

    try {
      const [categoriesRes, productsRes] = await Promise.all([
        axios.post(apiSummary.store.get_store_categories, { store_name: store_name }),
        axios.post(apiSummary.store.get_store_products, { store_name: store_name })
      ]);

      if (categoriesRes.data.success && productsRes.data.success) {
        setSelectedStoreCategories([]);
        setSelectedStoreProducts([]);
        setSelectedStoreCategories(categoriesRes.data.data);
        setSelectedStoreProducts(productsRes.data.data);
        console.log(categoriesRes.data.data)
        console.log(productsRes.data.data)
        return true
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      console.log(error)
      return false
    }
  }

  const handleCategoryClick = (category) => {
    const sanitizedCategory = category.category_name.toLowerCase().replace(/\s+/g, '-');
    setUserSelectedStoreCategory(category)
    router.push(`/store/${gender}/${sanitizedCategory}`);
    setMenuOpen(false)
  };

  // Determine text and icon color based on showrightnavoptions
  const textColorClass = showrightnavoptions ? "text-black" : "text-white";
  const hoverColorClass = showrightnavoptions ? "hover:text-black/80" : "hover:text-white/80";
  const hoverBgClass = showrightnavoptions ? "hover:bg-black/10" : "hover:bg-white/10";

  return (
    <nav className={`absolute w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center z-50 ${showrightnavoptions ? "shadow-b shadow-sm" : ""}`}>
      {/* Left Section - Hamburger & Search */}
      <div className='flex items-center'>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={` focus:outline-none focus:ring-2 rounded-md transition-all duration-200 ${hoverBgClass} ${showrightnavoptions ? "focus:ring-black/30" : "focus:ring-white/30"}`}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <IoMdClose size={28} className={`text-xl  ${textColorClass}`} />
          ) : (
            <HiOutlineEquals size={28} className={`text-xl ${textColorClass}`} />
          )}
        </button>

        <button
          className={`${textColorClass} ${hoverColorClass} transition-colors ml-2 rounded-md ${hoverBgClass}`}
          onClick={() => handleIconClick('search')}
        >
          <CiSearch size={28} />
        </button>
      </div>

      {/* Center - Logo (Always Centered) */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <div className={`${textColorClass} ${hoverColorClass}flex flex-row text-xl  gap-3 items-center ${hoverBgClass}`}>

          <p className={`${showrightnavoptions ? "text-lg font-bold" : "text-xl"} ${playfair.className}`}>
            DBC ELEGANCE
          </p>

        </div>
      </div>

      {/* Right - Icons */}
      {showrightnavoptions && (
        <div className="flex items-center ">
          <button
            className={`${textColorClass} ${hoverColorClass} transition-colors p-1 rounded-md ${hoverBgClass}`}
            onClick={() => handleIconClick('wishlist')}
          >
            <CiHeart size={28} />
          </button>
          <button
            className={`${textColorClass} ${hoverColorClass} transition-colors p-1 rounded-md ${hoverBgClass}`}
            onClick={() => handleIconClick('user')}
          >
            <CiUser size={28} />
          </button>
          <button
            className={`${textColorClass} ${hoverColorClass} transition-colors p-1 rounded-md ${hoverBgClass}`}
            onClick={() => handleIconClick('cart')}
          >
            <CiShoppingCart size={28} />
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg z-40 animate-fadeIn">
          <div className="p-6">
            <ul className="space-y-1 text-gray-700">
              <li className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer font-light">
                What's New
              </li>
              <li
                className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer font-light"
                onClick={async () => {
                  let result = await fetch_collections("male")
                  if (result) {
                    router.push("/store/mensfashion")
                  }
                }}
              >
                Men's Fashion
              </li>
              <li
                className="py-3 px-4 hover:bg-gray-50 rounded-md transition-colors cursor-pointer font-light"
                onClick={async () => {
                  let result = await fetch_collections("female")
                  if (result) {
                    router.push("/store/womensfashion")
                  }
                }}
              >
                Women's Fashion
              </li>
            </ul>

            <div className="border-t border-gray-100 mt-4 pt-4">
              {/* Collapsible Categories Section */}
              <button
                className="flex items-center justify-between w-full py-3 text-gray-800 font-light text-sm tracking-wide uppercase"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>CATEGORIES</span>
                {categoriesOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </button>

              {categoriesOpen && (
                <div className="pl-2 mt-2">
                  <div className="flex flex-col gap-1">
                    {selectedstorecategories && selectedstorecategories.map((category, index) => (
                      <div key={index} className="group">
                        <p
                          className={`block py-2 px-4 rounded-md transition-all duration-200 text-sm
                            group-hover:bg-gray-50 group-hover:text-gray-900 
                            ${category.category_name == userselectedstorecategory.category_name ? "font-medium text-gray-900" : "text-gray-600"}`}
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category.category_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Products Section */}
              <button
                className="flex items-center justify-between w-full py-3 text-gray-800 font-light text-sm tracking-wide uppercase mt-4"
                onClick={() => setProductsOpen(!productsOpen)}
              >
                <span>PRODUCTS</span>
                {productsOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
              </button>

              {productsOpen && (
                <div className="pl-2 mt-2">
                  <div className="flex flex-col gap-1">
                    {selectedstoreproducts && (
                      <div>
                        {selectedstoreproducts.length > 0 ? (
                          <div>
                            {selectedstoreproducts.map((product, index) => (
                              <div
                                key={index}
                                className="block py-2 px-4 rounded-md transition-all duration-200 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
                                onClick={() => {
                                  const selected_category = selectedstorecategories.find(
                                    (category) => String(category.category_id) === String(product.product_category)
                                  );
                                  if (selected_category) {
                                    setSelectedProduct(product)
                                    router.push(
                                      `/store/${product.product_store === "female" ? "women" : "mens"}/${selected_category.category_name.trim()}/${product.product_name.trim()}`
                                    );
                                    setShowModal(false)
                                  }
                                }}
                              >
                                {product.product_name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-3 px-4 text-gray-500 text-sm">
                            No products available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}