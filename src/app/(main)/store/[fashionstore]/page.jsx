'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
    const store_categories = useSelectedStoreCategories((state) => state.selectedstorecategories);
    const store_products = useSelectedStoreProducts((state) => state.selectedstoreproducts);
    const { showmodal } = useNavStore();
    const params = useParams();
    const gender = params.fashionstore;

    const [selected_category, setSelectedCategory] = useState(null);
    const [selected_products, setSelectedProducts] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (store_categories?.length > 0 && store_products?.length > 0) {
            let sel_category = store_categories[0];
            setSelectedCategory(sel_category); // set default to first category
            let selectedproducts = store_products.filter(
                (product) => product.product_category == sel_category.category_id
            );
            setSelectedProducts(selectedproducts);
        }
    }, [store_categories, store_products]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const backgroundVideo =
        gender === 'mensfashion' ? '/videos/menintro.mp4' : '/videos/womenintro.mp4';

    const handleScroll = () => {
        const section = document.getElementById('scrollTarget');
        section?.scrollIntoView({ behavior: 'smooth' });
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
                            onClick={handleScroll}
                            className="animate-bounce text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all"
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
                        <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto text-2xl">
                            Explore our carefully curated categories to find the perfect pieces for your style
                        </p>

                        {/* Redesigned Categories Grid with Headers Inside Images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {store_categories?.map((category, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`group relative overflow-hidden cursor-pointer transition-all duration-500 ${
                                        selected_category?.category_id === category.category_id
                                            ? 'ring-2 ring-black'
                                            : 'hover:scale-[1.02]'
                                    }`}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        let selectedproducts = store_products.filter(
                                            (product) =>
                                                product.product_category == category.category_id
                                        );
                                        setSelectedProducts(selectedproducts);
                                    }}
                                >
                                    <div className="h-[450px] md:h-[500px] flex flex-col">
                                        {/* Image Container with Header Inside */}
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={category.category_image}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                alt={`DBC - ${category.category_name}`}
                                                className="group-hover:scale-105 transition-transform duration-700"
                                            />

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                                            {/* Category Title positioned inside image */}
                                            <div className="absolute bottom-0 left-0 right-0 text-white  flex flex-col items-center justify-center pb-3">
                                                <h3 className="text-2xl font-bold ">
                                                    {category.category_name}
                                                </h3>
                                                <p className='underline'>Shop now</p>
                                                
                                               
                                               
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Selected Products Section */}
                        {selected_category && selected_products.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                                    {selected_category.category_name}
                                </h2>
                                <ProductList products={selected_products} />
                            </div>
                        )}
                    </div>
                </div>

                {showmodal && <ModalMain />}
            </div>
            <Footer />
        </div>
    );
}