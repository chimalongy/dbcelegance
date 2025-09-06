import React from 'react';
import { FaCircleNotch } from "react-icons/fa";
import DbcEleganceLogo from './DBCEleganceLogo';
import SplashScreen from '../splashscreencompoents/splashscreen';

export default function CategoryLoader() {
  return (
    <div className='w-full h-screen bg-white fixed inset-0 z-[999] flex items-center justify-center'>
      {/* <div className=' '></div> */}



    <div className='bg-white animate-pulse'>
      <div className="h-full flex justify-center items-center">
        <img
        src="/images/dbclogo.png"
        alt="dbclogo"
        className="lg:w-[10%] w-[40%]"
        // width={200}
        // height={200}
        />
      </div>
    </div>
      
    {/* <div className='bg-white animate-pulse'> <SplashScreen/></div>
       */}

    </div>

    
  );
}