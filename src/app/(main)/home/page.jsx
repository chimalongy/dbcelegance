'use client'
import React from 'react';
import mensfashionbg from "../../../../public/images/malefashion.jpg";
import womensfashionbg from "../../../../public/images/femalefashion.jpg";
import { useRouter } from 'next/navigation'; // correct hook import

function Home() {
  const router = useRouter(); // correctly call the hook

  return (
    <div className='flex flex-col lg:flex-row h-screen relative'>

      {/* Centered H1 over entire screen */}
      {/* <div className='absolute inset-0 flex items-center justify-center z-20 pointer-events-none'>
        <h1 className='text-4xl font-bold text-white text-center drop-shadow-lg'>
          DBC Elegance
        </h1>
      </div> */}

      {/* Men's Fashion */}
      <div
        className='group relative flex-1 flex items-center justify-center bg-cover bg-center transition-all duration-300 cursor-pointer'
        style={{ backgroundImage: `url(${mensfashionbg.src})` }}
        onClick={() => router.push("/store/mensfashion")}
      >
        <h1 className='text-amber-500 text-2xl font-semibold z-10 drop-shadow-lg'>Men's Fashion</h1>
        <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      {/* Women's Fashion */}
      <div
        className='group relative flex-1 flex items-center justify-center bg-cover bg-center transition-all duration-300 cursor-pointer'
        style={{ backgroundImage: `url(${womensfashionbg.src})` }}
        onClick={() => router.push("/store/womensfashion")}
      >
        <h1 className='text-amber-500 text-2xl font-semibold z-10 drop-shadow-lg'>Women's Fashion</h1>
        <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>

    </div>
  );
}

export default Home;
