'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import ProductList from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Nav';
import ModalMain from '@/app/components/modalpages.jsx/ModalMain';
import { useNavStore } from '@/app/lib/store/navmodalstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';
import { useUserSelectedCategory } from '@/app/lib/store/UserSelectedCategory';
import Image from 'next/image';
import { useLeftNavStore } from '@/app/lib/store/leftnavmodalstore';
import NavLeftModal from '@/app/components/NavLeftModal';

export default function CategoryPage() {
  const { showLeftNavModal } = useLeftNavStore();
  const userselectedcategory = useUserSelectedCategory(
    (state) => state.userselectedstorecategory
  );
  const store_products = useSelectedStoreProducts(
    (state) => state.selectedstoreproducts
  );
  const { showmodal } = useNavStore();
  const params = useParams();
  const gender = params.fashionstore;

  const [selected_category, setSelectedCategory] = useState(null);
  const [selected_products, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (userselectedcategory?.category_id) {
      const foundCategory = userselectedcategory;
      if (foundCategory) {
        setSelectedCategory(foundCategory);
        const selectedproducts = store_products.filter(
          (product) => product.product_category === foundCategory.category_id
        );
        setSelectedProducts(selectedproducts);
      }
    }
  }, [userselectedcategory?.category_id, store_products]);

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
            {selected_category?.category_name}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <p className='text-base lg:text-lg text-center lg:w-[50%] w-[90%] text-gray-600 leading-relaxed tracking-wide'>
              Rooted in heritage, designed for the modern era. Discover the essential collection of shirts and overshirts,
              meticulously crafted from the House's archives to become the defining staples of a sophisticated wardrobe.
            </p>

            <div className="border-t border-gray-200 w-20"></div>

            <p className='text-sm lg:text-base text-center text-gray-500 tracking-wide uppercase'>
              {selected_products?.length || 0} {selected_products?.length === 1 ? "ITEM" : "ITEMS"}
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
          <ProductList
            gender={gender}
            products={selected_products}
            selected_category={selected_category}
          />
        </div>


        {showmodal && <ModalMain />}
        {showLeftNavModal && <NavLeftModal />}
      </div>
      <Footer />
    </div>
  );
}