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

  const selectedstoreproducts = useSelectedStoreProducts(   // ✅ correct hook
    (state) => state.selectedstoreproducts
  );

    let setUserSelectedStoreCategory= useUserSelectedCategory((state)=>state.setUserSelectedStoreCategory)
    let userselectedstorecategory = useUserSelectedCategory((state)=>state.userselectedstorecategory)

  const pathname = usePathname(); // gives the current path
  let gender = pathname=="/store/womensfashion"?"women":"men"
  const router = useRouter();     // lets you navigate programmatically
  const [menuOpen, setMenuOpen] = useState(false);
  const [showrightnavoptions, setshowrightnavoptions] = useState(false)
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

    // setLoadingCategory(category.label);

    try {
      // fetch categories & products at the same time

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
    } finally {
      //setLoadingCategory(null);
    }
  }

   const handleCategoryClick = (category) => {
        // Sanitize category name for URL
        const sanitizedCategory = category.category_name.toLowerCase().replace(/\s+/g, '-');
        setUserSelectedStoreCategory(category)
        router.push(`/store/${gender}/${sanitizedCategory}`);
        setMenuOpen(false)

    };

  return (
    // <nav className=" w-full border-b border-gray-100 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white z-50 shadow-sm relative">
    // <nav className={`${showrightnavoptions ? "bg-black/20 " : ""} absolute w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center  z-50 shadow-sm`}>
    <nav className={`${showrightnavoptions ? "bg-black/20 " : ""} absolute w-full px-4 py-3 md:px-6 md:py-4 flex justify-between items-center  z-50 shadow-sm`}>
      {/* Left - Hamburger */}
      <div className=' flex ' >
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

        <button
          className="text-white hover:text-white transition-colors p-1"
          onClick={() => handleIconClick('search')}
        >
          <CiSearch className=" w-4 h-4 lg:w-7 lg:h-7 text-xl" />
        </button>
      </div>

      {/* Center - Logo */}
      {/* <div className={`  ${showrightnavoptions?"":"mx-auto"} text-white`}> */}
      <div className={` mx-auto text-white`}>
        <DbcEleganceLogo />
      </div>

      {/* Right - Icons */}
      {
        showrightnavoptions &&
        <div className="flex items-center lg:space-x-4 ml-auto">
          {/* <button
            className="text-white hover:text-white transition-colors p-1"
            onClick={() => handleIconClick('search')}
          >
            <CiSearch className=" w-4 h-4 lg:w-7 lg:h-7" />
          </button> */}
          <button
            className="text-white hover:text-white transition-colors p-1"
            onClick={() => handleIconClick('wishlist')}
          >
            <CiHeart className=" w-4 h-4 lg:w-7 lg:h-7" />
          </button>
          <button
            className="text-white hover:text-white transition-colors p-1"
            onClick={() => handleIconClick('user')}
          >
            <CiUser className=" w-4 h-4 lg:w-7 lg:h-7" />
          </button>
          <button
            className="text-white hover:text-white transition-colors p-1"
            onClick={() => handleIconClick('cart')}
          >
            <CiShoppingCart className=" w-4 h-4 lg:w-7 lg:h-7" />
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
            <li className="py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors"
              onClick={async () => {
                let result = await fetch_collections("male")
                if (result) {
                  console.log(result)
                  router.push("/store/mensfashion")
                }

              }}
            >
              {/* <Link href="/store/mensfashion">Men's Fashion</Link> */}
              Men's Fashion
            </li>
            <li className="py-2 hover:text-gray-900 hover:bg-gray-50 px-3 rounded-md transition-colors"
              onClick={async () => {
                let result = await fetch_collections("female")
                if (result) {
                  console.log(result)
                  router.push("/store/womensfashion")
                }

              }}
            >
              {/* <Link href="/store/femalefashion">Women's Fashion</Link> */}
              Women's Fashion
            </li>

            <h1 className='text-xl font-bold '>Store</h1>

            <div className="pl-4 py-3 border-t border-gray-100">
              <h1 className="text-lg font-semibold text-gray-800 mb-3">Categories</h1>
              <div className="ml-2 flex flex-col gap-2">
                {selectedstorecategories && selectedstorecategories.map((category, index) => (
                  <div key={index} className="group">
                    <p
                      className={`block py-2 px-4 rounded-md transition-all duration-200 
                     group-hover:bg-gray-50 group-hover:text-gray-900 
                     group-hover:font-medium text-gray-700 ${category.category_name==userselectedstorecategory.category_name ?"font-bold":""}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category.category_name}
                    </p>
                  </div>
                ))}
              </div>

              <h1 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Products</h1>
              <div className="ml-2 flex flex-col gap-2">
                {selectedstoreproducts && <div>
                  {selectedstoreproducts.length>0? (<div>
                    {
                       selectedstoreproducts.map((product, index) => (
                  <div key={index} className="group">
                    <Link
                      href={
                        pathname === "/store/mensfashion"
                          ? `/store/mensfashion/${product.product_name}`
                          : `/store/mensfashion/${product.product_name}`
                      }
                      className={`block py-2 px-4 rounded-md transition-all duration-200 
                     group-hover:bg-gray-50 group-hover:text-gray-900 
                     group-hover:font-medium text-gray-700 `}
                      onClick={() => setMenuOpen(false)}
                    >
                      {product.product_name}
                    </Link>
                  </div>))
                    }
                  </div>):
                  
                  <div>
                    <p className='p-6'>No products available</p>
                  </div>
                  }
                </div>
                }
              </div>
            </div>

          </ul>
        </div>
      )}
    </nav>
  );
}
