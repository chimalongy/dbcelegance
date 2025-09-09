"use client"
import React from 'react';
import { FaTrash, FaLock, FaWindows } from 'react-icons/fa';
import { SiVisa, SiPaypal } from 'react-icons/si';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useUserCart } from '@/app/lib/store/userCart';
import OrderSummary from './components/OrderSummary';

const ShoppingCart = () => {
  //const { usecart, removeCartItem} = useUserCart()

  const usercart = useUserCart((state)=>state.usercart)
  const removeCartItem = useUserCart((state)=>state.removeCartItem)
  const updateCartItem = useUserCart((state) => state.updateCartItem);
  let router = useRouter()
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 md:px-6 md:py-4 flex border-b border-gray-200">
        <div className="flex items-center" onClick={router.back}>
          <MdKeyboardArrowLeft size={30} />
         <p className='text-sm lg:text-base'>Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p>DBC ELEGANCE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-between items-center  flex-1 bg-gray-50">
        <div className=" flex-2 w-full h-full">
          <OrderSummary 
          products={usercart} 
          removeCartItem={removeCartItem}
          updateCartItem={updateCartItem}
          />
        </div>
        <div className=" flex-1 w-full h-full">RIGHT</div>
      </div>
    </div>
  );
};

export default ShoppingCart;
