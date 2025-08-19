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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const hoverVariants = {
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

function Home() {
  const router = useRouter();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const setSelectedStoreCategories = useSelectedStoreCategories(
    (state) => state.setSelectedStoreCategories
  );
  const setSelectedStoreProducts = useSelectedStoreProducts(
    (state) => state.setSelectedStoreProducts
  );

  const handleNavigation = (path) => {
    router.push(path);
  };

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
    <div className="bg-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen px-4 py-8 lg:py-16 max-w-7xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Style That Moves With You
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover collections designed to complement your rhythm, from everyday essentials to statement pieces that turn heads.
          </motion.p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {categories.map((category) => (
            <motion.div
              key={category.label}
              variants={itemVariants}
              whileHover={loadingCategory ? {} : "hover"}
              className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => !loadingCategory && fetch_collections(category)}
            >
              {loadingCategory === category.label && (
                <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}

              <motion.div
                variants={hoverVariants}
                className="relative h-96 overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.label}
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  placeholder="blur"
                  quality={90}
                />
                <div className={`absolute inset-0 bg-gradient-to-b ${category.color}`} />
              </motion.div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                <motion.span
                  className="text-sm font-medium text-white/90 mb-1"
                  whileHover={{ x: 2 }}
                >
                  {category.tag}
                </motion.span>
                <div className="flex items-center justify-between">
                  <motion.h2
                    className="text-2xl font-bold"
                    whileHover={{ x: 2 }}
                  >
                    {category.label}
                  </motion.h2>
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 2 }}
                  >
                    <span className="text-sm font-medium">{category.actionText}</span>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                      {category.icon}
                      <FiArrowRight
                        size={16}
                        className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.4,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mt-20 text-center"
        >
          <motion.h3
            className="text-2xl font-semibold text-gray-800 mb-4"
            whileHover={{ scale: 1.02 }}
          >
            Not Sure Where to Start?
          </motion.h3>
          <motion.button
            onClick={() => handleNavigation('/store')}
            className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-gray-400/20 flex items-center mx-auto"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Explore All Collections
            <FiArrowRight className="ml-2" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
