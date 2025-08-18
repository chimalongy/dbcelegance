'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import mensfashionbg from '../../../../../public/images/malefashion.jpg';
import womensfashionbg from '../../../../../public/images/femalefashion.jpg';
import { FaChevronDown } from 'react-icons/fa';
import ProductList from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Nav';
import ModalMain from '@/app/components/modalpages.jsx/ModalMain';
import { useNavStore } from '../../../lib/store/navmodalstore';
import CategoryList from '@/app/components/CategoryList';
import { useSelectedStoreCategories } from '@/app/lib/store/selectedstorecategoriesstore';
import { useSelectedStoreProducts } from '@/app/lib/store/selectedstoreproductsstore';
import Image from 'next/image';

export default function FashionPage() {
    const store_categories = useSelectedStoreCategories((state) => state.selectedstorecategories);
    const store_products = useSelectedStoreProducts((state)=>state.selectedstoreproducts)
    const { selectednavtab, setSelectedNavTab, clearSelectedNavTab, showmodal, setShowModal } = useNavStore();
    const params = useParams();
    const gender = params.fashionstore;
    const [selected_category, setSelectedCategory] = useState(null);
    const [selected_products, setsetelctedProducts]= useState([])

    useEffect(() => {
        if( (store_categories && store_categories.length > 0)&& (store_products && store_products.length > 0) ) {
            let sel_category = store_categories[0]
            setSelectedCategory(sel_category); // set default to first category
            let selectedproducts = store_products.filter((product)=> product.product_category==sel_category.category_id)
            setsetelctedProducts(selectedproducts)
        }
    }, [store_categories]);

    const backgroundImage =
        gender === 'mensfashion' ? mensfashionbg.src : womensfashionbg.src;

    const handleScroll = () => {
        const section = document.getElementById('scrollTarget');
        section?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            <Navbar />
            <div className="relative">

                {/* Parallax Section */}
                <div
                    className="min-h-[60vh] lg:min-h-screen bg-fixed bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    {/* Hero Text */}
                    <div className="flex items-center justify-center text-center py-20 px-4">
                        <h1 className="text-yellow-300 text-4xl md:text-6xl font-bold drop-shadow-lg">
                            {gender === 'mensfashion' ? "Men's Fashion" : "Women's Fashion"}
                        </h1>
                    </div>

                    {/* Scroll Arrow */}
                    <div className="absolute bottom-6 w-full flex justify-center">
                        <button onClick={handleScroll} className="animate-bounce text-white text-3xl">
                            <FaChevronDown />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div
                    id="scrollTarget"
                    className="min-h-screen bg-gray-50 py-10 flex flex-col items-center"
                >
                    <p className="text-gray-600 mb-8">
                        {`Browse our ${gender === 'mensfashion' ? 'Men' : 'Women'} Collections`}
                    </p>

                    <div className="w-[80%] p-4 md:p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {store_categories && store_categories.map((category, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${
                                    selected_category?.category_id === category?.category_id ? "border border-yellow-400" : ""
                                }`}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    

                                }}
                            >
                                <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mb-2">
                                    <Image
                                        src={category.category_image}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        alt={`DBC - ${category.category_name}`}
                                        className="rounded-full"
                                    />
                                </div>
                                <span className="text-xs md:text-sm text-center font-medium text-gray-700">
                                    {category.category_name}
                                </span>
                            </div>

                        ))}
                    </div>

                    <ProductList gender={gender} products={selected_products} />


                    
                </div>

                {showmodal && <ModalMain />}
            </div>
            <Footer />
        </div>
    );
}
