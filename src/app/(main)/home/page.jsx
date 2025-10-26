'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import mensfashionbg from "../../../../public/images/malefashion.avif";
import womensfashionbg from "../../../../public/images/femalefashion.avif";
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import Navbar from '@/app/components/Nav';
import { motion } from 'framer-motion';
import { apiSummary } from '@/app/lib/apiSummary';
import axios from 'axios';
import { useSelectedStoreCategories } from '@/app/lib/store/selectedstorecategoriesstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';
import { useSelectedStoreAccessoryCategories } from '@/app/lib/store/selectedstoreaccessorycategoriesstore';

import { Noto_Serif } from 'next/font/google';
import CategoryLoader from '@/app/components/CategoryLoader';
import { useSelectedStoreAccessoryProducts } from '@/app/lib/store/selectedstoreaccessoryproductsstore';

const categories = [
  {
    label: "WOMEN'S COLLECTION",
    image: womensfashionbg,
    link: "/store/womensfashion",
    color: "from-black/40 to-transparent",
    icon: <FiShoppingBag className="text-white" size={16} />,
    actionText: "SHOP NOW",
    store_name: "female"
  },
  {
    label: "MEN'S COLLECTION",
    image: mensfashionbg,
    link: "/store/mensfashion",
    color: "from-black/40 to-transparent",
    icon: <FiShoppingBag className="text-white" size={16} />,
    actionText: "SHOP NOW",
    store_name: "male"
  },
];

const notoSerif = Noto_Serif({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif'
});

export default function Home() {
  const router = useRouter();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const setSelectedStoreCategories = useSelectedStoreCategories(
    (state) => state.setSelectedStoreCategories
  );
  const setSelectedStoreProducts = useSelectedStoreProducts(
    (state) => state.setSelectedStoreProducts
  );
  const setSelectedStoreAccessoryCategories = useSelectedStoreAccessoryCategories(
    (state) => state.setSelectedStoreAccessoryCategories
  );
  const setSelectedStoreAccessoryProducts = useSelectedStoreAccessoryProducts(
    (state) => state.setSelectedStoreAccessoryProducts
  );  
  async function fetch_collections(category) {
    if (!category.store_name) {
      router.push(category.link);
      return;
    }

    setLoadingCategory(category.label);
    let dataloaded = false;

    try {
      setSelectedStoreCategories([]);
      setSelectedStoreProducts([]);
      const [categoriesRes, productsRes, acccessoriesCategoriesRes, acccessoriesRes] = await Promise.all([
        axios.post(apiSummary.store.get_store_categories, { store_name: category.store_name }),
        axios.post(apiSummary.store.get_store_products, { store_name: category.store_name }),
        axios.post(apiSummary.store.get_store_accessories_categories, { store_name: category.store_name }),
        axios.post(apiSummary.store.get_store_accessories, { store_name: category.store_name })
      ]);


      // console.log(categoriesRes.data.data);
      // console.log(productsRes.data.data);
      console.log(acccessoriesCategoriesRes.data.data);
      console.log(acccessoriesRes.data.data);
      if (categoriesRes.data.success && productsRes.data.success && acccessoriesCategoriesRes.data.success && acccessoriesRes.data.success) {
        setSelectedStoreCategories(categoriesRes.data.data);
        setSelectedStoreProducts(productsRes.data.data);
        setSelectedStoreAccessoryCategories(acccessoriesCategoriesRes.data.data);
        setSelectedStoreAccessoryProducts(acccessoriesRes.data.data);
        dataloaded = true;
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      if (dataloaded) {
        // ✅ keep loader active, then navigate
        router.push(category.link);
      } else {
        // ❌ only reset loader if navigation won’t happen
        setLoadingCategory(null);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      {/* Show only loader when loading */}
      {loadingCategory ? (
        <CategoryLoader />
      ) : (
        <main className="flex-1 flex flex-col lg:flex-row">
          {/* Brand Header */}
          <div className='absolute top-6 left-1/2 transform -translate-x-1/2 z-50 text-white text-center'>
            <h1 className={`${notoSerif.className} text-2xl md:text-3xl font-light tracking-widest`}>
              DBC ELEGANCE
            </h1>
          </div>
          
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="relative flex-1 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onClick={() => !loadingCategory && fetch_collections(category)}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image  
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-fill lg:object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  placeholder="blur"
                  quality={100}
                  priority={index === 0}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.color} via-transparent to-transparent`}></div>
              </div>

              {/* Text content */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center p-6 text-white z-10">
                <motion.h2
                  className="text-xl md:text-2xl font-light mb-3 text-center tracking-wider"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                  {category.label}
                </motion.h2>
            
                <motion.div
                  className="flex items-center gap-2 mt-1 group-hover:underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.5 }}
                >
                  <span className="text-xs md:text-sm font-light tracking-widest uppercase border-b border-white/30 pb-1 transition-all duration-300 group-hover:border-white">
                    {category.actionText}
                  </span>
                  <FiArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </motion.div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
            </motion.div>
          ))}
        </main>
      )}
    </div>
  );
}
