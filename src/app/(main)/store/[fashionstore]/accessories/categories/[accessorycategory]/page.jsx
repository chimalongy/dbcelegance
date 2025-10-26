'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import AccessoryProductList from '@/app/components/AccessoryProductList';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Nav';
import ModalMain from '@/app/components/modalpages.jsx/ModalMain';
import { useNavStore } from '@/app/lib/store/navmodalstore';
import { useSelectedStoreAccessoryProducts } from '@/app/lib/store/selectedstoreaccessoryproductsstore';
import { useUserSelectedAccessoryCategory } from '@/app/lib/store/UserSelectedAccessoryCategory';
import Image from 'next/image';
import { useLeftNavStore } from '@/app/lib/store/leftnavmodalstore';
import NavLeftModal from '@/app/components/NavLeftModal';

export default function CategoryPage() {
  const { showLeftNavModal } = useLeftNavStore();
  const userselectedaccessorycategory = useUserSelectedAccessoryCategory(
    (state) => state.userselectedstoreaccessorycategory
  );
  const store_accessory_products = useSelectedStoreAccessoryProducts(
    (state) => state.selectedstoreaccessoryproducts
  );
  const { showmodal } = useNavStore();
  const params = useParams();
  const gender = params.fashionstore;

  const [selected_accessory_category, setSelectedAccessoryCategory] = useState(null);
  const [selected_accessory_products, setSelectedAccessoryProducts] = useState([]);

  useEffect(() => {
    if (userselectedaccessorycategory?.accessory_category_id && Array.isArray(store_accessory_products)) {
      const foundCategory = userselectedaccessorycategory;
      if (foundCategory) {
        setSelectedAccessoryCategory(foundCategory);
        const selectedaccessoryproducts = store_accessory_products.filter(
          (product) => product.accessory_category === foundCategory.accessory_category_id
        );
        console.log("selectedaccessoryproducts", selectedaccessoryproducts);
        setSelectedAccessoryProducts(selectedaccessoryproducts);
      }
    }
  }, [userselectedaccessorycategory?.accessory_category_id, store_accessory_products]);

  const handleScroll = () => {
    const section = document.getElementById('scrollTarget');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-white">
      <Navbar />
      <div className="relative">
        {/* Hero Section */}
        <div className='lg:pt-30 pt-24 flex flex-col gap-8 mb-8 px-4'>
          <h1 className='w-full text-center text-3xl lg:text-4xl font-light tracking-wide text-gray-900'>
            {selected_accessory_category?.accessory_category_name}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <p className='text-base lg:text-lg text-center lg:w-[50%] w-[90%] text-gray-600 leading-relaxed tracking-wide'>
              Rooted in heritage, designed for the modern era. Discover the essential collection of shirts and overshirts,
              meticulously crafted from the House's archives to become the defining staples of a sophisticated wardrobe.
            </p>

            <div className="border-t border-gray-200 w-20"></div>

            <p className='text-sm lg:text-base text-center text-gray-500 tracking-wide uppercase'>
              {selected_accessory_products?.length || 0} {selected_accessory_products?.length === 1 ? "ITEM" : "ITEMS"}
            </p>
          </div>

          {/* Scroll Indicator */}
          {/* <div className="flex justify-center mt-4">
            <button
              onClick={handleScroll}
              className="flex flex-col items-center text-gray-500 hover:text-gray-700 transition-colors duration-300 group"
              aria-label="Scroll to products"
            >
              <span className="text-xs tracking-wide uppercase mb-2">EXPLORE</span>
              <FaChevronDown className="animate-bounce text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          </div> */}
        </div>

        {/* Content Section */}
        <div
          id="scrollTarget"
          className="min-h-screen lg:py-10 flex flex-col items-center"
        >
          {/* Products List */}
          <AccessoryProductList
            gender={gender}
            accessory_products={selected_accessory_products}
            selected_accessory_category={selected_accessory_category}
          />
        </div>


        {showmodal && <ModalMain />}
        {showLeftNavModal && <NavLeftModal />}
      </div>
      <Footer />
    </div>
  );
}