'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import ProductList from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Nav';
import ModalMain from '@/app/components/modalpages.jsx/ModalMain';
import { useNavStore } from '../../../lib/store/navmodalstore';
import { useSelectedStoreCategories } from '@/app/lib/store/selectedstorecategoriesstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function FashionPage() {
    const router = useRouter();
    const params = useParams();
    const store_categories = useSelectedStoreCategories((state) => state.selectedstorecategories);
    const store_products = useSelectedStoreProducts((state) => state.selectedstoreproducts);
    const { showmodal } = useNavStore();
    const gender = params.fashionstore;
    const [isLoading, setIsLoading] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (store_categories && store_products) {
            setIsLoading(false);
        }
    }, [store_categories, store_products]);

    useEffect(() => {
        const handleWindowScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleWindowScroll);
        return () => window.removeEventListener('scroll', handleWindowScroll);
    }, []);

    const backgroundVideo =
        gender === 'mensfashion' ? '/videos/menintro.mp4' : '/videos/womenintro.mp4';

    const scrollToSection = () => {
        const section = document.getElementById('scrollTarget');
        section?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCategoryClick = (categoryName) => {
        // Sanitize category name for URL
        const sanitizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
        router.push(`/${gender}/${sanitizedCategory}`);
    };

    return (
        <div className="w-full">
            <Navbar />
            <div className="relative">
                {/* Parallax Section */}
                <div className="relative h-[60vh] lg:h-screen w-full">
                    <video
                        src={backgroundVideo}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>

                    {/* Hero text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            {gender === 'mensfashion' ? "Men's Collection" : "Women's Collection"}
                        </h1>
                        <p className="text-lg md:text-xl text-white max-w-2xl mb-8">
                            Discover our latest styles and exclusive pieces
                        </p>
                    </div>

                    {/* Scroll Arrow */}
                    <div className="absolute bottom-6 w-full flex justify-center">
                        <button
                            onClick={scrollToSection}
                            className="animate-bounce text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all"
                            aria-label="Scroll down"
                        >
                            <FaChevronDown />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div
                    id="scrollTarget"
                    className="min-h-screen bg-gray-50 py-10 flex flex-col items-center"
                >
                    <div className="w-full max-w-7xl px-4">
                        <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto text-base w-[80%]">
                            Explore our carefully curated categories to find the perfect pieces for your style
                        </p>

                        {/* Loading State */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-96">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                                <span className="ml-3 text-gray-600">Loading categories...</span>
                            </div>
                        ) : (
                            <>
                                {/* Categories Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                                    {store_categories?.map((category, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="group relative overflow-hidden cursor-pointer transition-all duration-500 rounded-lg shadow-md hover:shadow-xl"
                                            onClick={() => handleCategoryClick(category.category_name)}
                                        >
                                            <div className="h-[450px] md:h-[500px] flex flex-col">
                                                {/* Image Container with Header Inside */}
                                                <div className="relative h-full w-full">
                                                    <Image
                                                        src={category.category_image}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        style={{ objectFit: 'cover' }}
                                                        alt={`DBC - ${category.category_name}`}
                                                        className="group-hover:scale-105 transition-transform duration-700"
                                                    />

                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                                    {/* Category Title positioned inside image */}
                                                    <div className="absolute bottom-0 left-0 right-0 text-white flex flex-col items-center justify-center p-6">
                                                        <h3 className="text-2xl font-bold mb-2 text-center">
                                                            {category.category_name}
                                                        </h3>
                                                        <div className="flex items-center text-sm underline opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <span>Shop now</span>
                                                            <FiArrowRight className="ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Featured Products Section */}
                                {/* <ProductList products={store_products} /> */}
                            </>
                        )}
                    </div>
                </div>

                {showmodal && <ModalMain />}
            </div>
            <Footer />
        </div>
    );
}
