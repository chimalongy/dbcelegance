'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import mensfashionbg from '../../../../../public/images/malefashion.jpg';
import womensfashionbg from '../../../../../public/images/femalefashion.jpg';
import { FaChevronDown } from 'react-icons/fa';
import ProductList from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Nav';
import ModalMain from '@/app/components/modalpages.jsx/ModalMain';

export default function FashionPage() {
    const params = useParams();
    const gender = params.fashionstore;
    const [shownavmodals, setshownavmodals] = useState(false)

    const backgroundImage =
        gender === 'mensfashion' ? mensfashionbg.src : womensfashionbg.src;

    const handleScroll = () => {
        const section = document.getElementById('scrollTarget');
        section?.scrollIntoView({ behavior: 'smooth' });
    };




    return (
        <div className="w-full ">
            <Navbar showmodal={()=>{setshownavmodals(true)}} close={()=>{setshownavmodals(false)}} />
            <div className="relative">

                {/* Parallax Section */}
                <div
                    className="min-h-[60vh] lg:min-h-screen bg-fixed bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    {/* Hero Text */}
                    <div className="flex items-center justify-center text-center py-20 px-4">
                        <h1 className="text-yellow-300 text-4xl md:text-6xl font-bold drop-shadow-lg">
                            {gender == "mensfashion" ? "Men's Fashion" : "Women's Fashion"}
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
                    className="min-h-screen bg-gray-50 py-10  flex flex-col items-center"
                >
                    <p className='text-gray-600'>
                        {`Browse our ${gender == "mensfashion" ? "Men" : "Women"} Collections`}
                    </p>
                    <ProductList gender={gender} />
                </div>

                {shownavmodals && <ModalMain close={()=>{setshownavmodals(false)}}/>}
            </div>


            <Footer />

        </div>
    );
}
