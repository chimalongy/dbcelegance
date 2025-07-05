'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import mensfashionbg from '../../../../../public/images/malefashion.jpg';
import womensfashionbg from '../../../../../public/images/femalefashion.jpg';
import Navbar from '@/app/components/Nav';

export default function FashionPage() {
  const params = useParams();
  const gender = params.fashionstore;

  const backgroundImage = gender === 'mensfashion' ? mensfashionbg.src : womensfashionbg.src;

  return (
    <div>
      <div
    
        className='h-[40vh] lg:h-screen bg-cover bg-center transition-all duration-300 cursor-pointer'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
          <Navbar/>
        <h1 className='text-Yellow text-3xl font-bold p-4'>Fashion for {gender}</h1>
      </div>
        //ad bouncy paralex effect thay would link to this seection below and the section bellow should fit the current screen
      <div className='h-screen bg-green-500'>

      </div>
    </div>
  );
}
