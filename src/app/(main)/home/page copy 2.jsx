'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import mensfashionbg from "../../../../public/images/malefashion.jpg";
import womensfashionbg from "../../../../public/images/femalefashion.jpg";
import customfashion from "../../../../public/images/customfashion.jpg";
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiShoppingBag, FiMail } from 'react-icons/fi';
import Navbar from '@/app/components/Nav';
import { motion } from 'framer-motion';
import { apiSummary } from '@/app/lib/apiSummary';
import axios from 'axios';
import { useSelectedStoreCategories } from '@/app/lib/store/selectedstorecategoriesstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';

const categories = [
  {
    label: "Women's Collection",
    tag: "Elegance Redefined",
    image: womensfashionbg,
    link: "/store/womensfashion",
    color: "from-gray-900/30 to-gray-800/20",
    icon: <FiShoppingBag className="text-white" size={18} />,
    actionText: "Shop Now",
    store_name: "female"
  },
  {
    label: "Men's Essentials",
    tag: "Sharp & Sophisticated",
    image: mensfashionbg,
    link: "/store/mensfashion",
    color: "from-gray-900/30 to-gray-800/20",
    icon: <FiShoppingBag className="text-white" size={18} />,
    actionText: "Shop Now",
    store_name: "male"
  },
  {
    label: "Custom Designs",
    tag: "Uniquely Yours",
    image: customfashion,
    link: "/store/customfashion",
    color: "from-gray-900/30 to-gray-800/20",
    icon: <FiMail className="text-white" size={18} />,
    actionText: "Contact Us"
  },
];

export default function Home() {
  const router = useRouter();
   const [loadingCategory, setLoadingCategory] = useState(null);
  const setSelectedStoreCategories = useSelectedStoreCategories(
    (state) => state.setSelectedStoreCategories
  );
  const setSelectedStoreProducts = useSelectedStoreProducts(
    (state) => state.setSelectedStoreProducts
  );

    async function fetch_collections(category) {
    if (!category.store_name) {
      router.push(category.link);
      return;
    }

    setLoadingCategory(category.label);

    try {
      // fetch categories & products at the same time
       setSelectedStoreCategories([]);
        setSelectedStoreProducts([]);
      const [categoriesRes, productsRes] = await Promise.all([
        axios.post(apiSummary.store.get_store_categories, { store_name: category.store_name }),
        axios.post(apiSummary.store.get_store_products, { store_name: category.store_name })
      ]);

      if (categoriesRes.data.success) {
        setSelectedStoreCategories(categoriesRes.data.data);
      }

      if (productsRes.data.success) {
        setSelectedStoreProducts(productsRes.data.data);
      }

      router.push(category.link);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoadingCategory(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="relative flex-1 overflow-hidden group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => !loadingCategory && fetch_collections(category)}
          >
            <div className="relative w-full h-full">
              <Image
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                placeholder="blur"
                quality={90}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent`}></div>
            </div>

            {/* Content positioned at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-6 text-white z-10">
              <motion.h2
                className="text-2xl md:text-3xl font-serif font-light mb-2 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {category.label}
              </motion.h2>
              <motion.p
                className="text-sm md:text-base mb-4 font-light text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                {category.tag}
              </motion.p>
              <motion.div
                className="flex items-center gap-2 mt-2 group-hover:underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.4 }}
              >
                <span className="text-sm md:text-base font-medium tracking-wide">
                  {category.actionText}
                </span>
                <FiArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}