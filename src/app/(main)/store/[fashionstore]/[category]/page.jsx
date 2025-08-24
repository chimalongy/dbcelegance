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
        {selected_category!==null && (
          <div className="relative min-h-[60vh] lg:min-h-screen bg-fixed bg-cover bg-center">
            <Image
              src={selected_category.category_image}
              fill
              style={{ objectFit: 'cover' }}
              alt={`DBC - ${selected_category?.category_name}`}
              className="z-0"
            />

          
          

            {/* Hero Text */}
            <div className=" flex absolute bottom-0 items-center justify-center text-center py-20 px-4  w-full z-2">
              <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg text-shadow-2xs text-shadow-amber-950">
                {selected_category.category_name}
              </h1>
            </div>

            {/* Scroll Arrow */}
            <div className="absolute bottom-6 w-full flex justify-center z-2">
              <button
                onClick={handleScroll}
                className="animate-bounce text-white text-3xl"
              >
                <FaChevronDown />
              </button>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div
          id="scrollTarget"
          className="min-h-screen bg-gray-50 py-10 flex flex-col items-center"
        >
          <p className="text-gray-600 mb-8 text-lg">
            Browse our {selected_category?.category_name} Collection
          </p>
          {/* <button onClick={()=>{console.log(selected_category)}}>
            cllick
          </button> */}

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
