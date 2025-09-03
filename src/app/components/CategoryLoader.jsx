import React from 'react';
import { FaCircleNotch } from "react-icons/fa";
import DbcEleganceLogo from './DBCEleganceLogo';

export default function CategoryLoader() {
  return (
    <div className='w-full h-screen fixed inset-0 z-[999] flex items-center justify-center'>
      <div className='absolute inset-0 bg-white/80 backdrop-blur-md'></div>
      
    
        <div className='flex flex-col items-center justify-center gap-6'>
         
          
          <div className='text-center'>
            <p className='text-2xl font-bold text-black drop-shadow-md'>DBC ELEGANCE</p>
            {/* <p className='text-white/80 mt-2'>Loading categories...</p> */}
          </div>

           <div className='animate-spin duration-1000'>
            <FaCircleNotch className='text-black text-4xl' />
          </div>

        </div>
        
        {/* Subtle decorative elements */}
        <div className='absolute -inset-4 -z-10 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-3xl'></div>
        <div className='absolute top-2 right-2 w-16 h-16 bg-white/10 rounded-full blur-md'></div>
        <div className='absolute bottom-2 left-2 w-12 h-12 bg-purple-400/10 rounded-full blur-md'></div>
      
    </div>
  );
}