'use client';

import React from 'react';
import Image from 'next/image';
import mensfashionbg from "../../../../public/images/malefashion.jpg";
import womensfashionbg from "../../../../public/images/femalefashion.jpg";
import customfashion from "../../../../public/images/customfashion.jpg"; // Add a kids image
import { useRouter } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import Navbar from '@/app/components/Nav';

const categories = [
  {
    label: "Woman",
    tag: "Female Fashion",
    image: womensfashionbg,
    link: "/store/womensfashion",
  },
  {
    label: "Man",
    tag: "Men's fashion",
    image: mensfashionbg,
    link: "/store/mensfashion",
  },
  {
    label: "Custom Fashion",
    tag: "Custom Fashion Design",
    image: customfashion,
    link: "/store/customfashion",
  },
];

function Home() {
  const router = useRouter();

  return (
    <div>
      <Navbar/>

      <div className="min-h-screen bg-white px-4 py-8 lg:py-16">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Add rhythm to your life
          </h1>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            From the everyday essentials to bold statements, we blend functionality with flair to make sure your style fits seamlessly into the rhythm of your life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.label}
              className="relative group cursor-pointer rounded-xl overflow-hidden"
              onClick={() => router.push(category.link)}
            >
              <Image
                src={category.image}
                alt={category.label}
                className="w-full h-[400px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
              />
              {/* <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition duration-300" /> */}
              <div className="absolute bottom-4 left-4 z-10 text-white">
                <p className="text-sm text-gray-200">{category.tag}</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-semibold">{category.label}</h2>
                  <FiArrowRight size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
