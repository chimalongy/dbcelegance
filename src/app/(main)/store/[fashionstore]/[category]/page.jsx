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


export default function CategoryPage() {


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

  useEffect(() => {
    console.log("Updated Category: ", selected_category);
  }, [selected_category]);


  const handleScroll = () => {
    const section = document.getElementById('scrollTarget');
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="relative">
        {/* Hero Section with Category Image */}

        <div className='lg:pt-[200px] pt-[150px] flex flex-col gap-6 mb-3'>

          <h1 className='w-full text-center text-2xl'>{selected_category?.category_name}</h1>
          <p className='text-base lg:text-2xl lg:w-[45%] text-center w-[80%] m-auto text-gray-500'>
            Rooted in heritage, designed for the modern era. Discover the essential collection of shirts and overshirts, meticulously crafted from the House's archives to become the defining staples of a sophisticated wardrobe.
          </p>
        </div>

        {/* Content Section */}
        <div
          id="scrollTarget"
          className="min-h-screen  py-10 flex flex-col items-center"
        >
         

          {/* Products List */}
          <ProductList
            gender={gender}
            products={selected_products}
            selected_category={selected_category}
          />
        </div>

        {showmodal && <ModalMain />}
      </div>
      <Footer />
    </div>
  );
}
