"use client"
import React, { useMemo, useState } from 'react';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useUserCart } from '@/app/lib/store/userCart';
import OrderSummary from './components/OrderSummary';
import PackagingGifting from './components/Packaging';
import { FiChevronDown } from "react-icons/fi";

import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineContactSupport } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlineCalendarToday } from "react-icons/md";
import AddMessageModal from './components/AddMessageModal';

const ShoppingCart = () => {
  const usercart = useUserCart((state) => state.usercart)
  const removeCartItem = useUserCart((state) => state.removeCartItem)
  const updateCartItem = useUserCart((state) => state.updateCartItem);
  let router = useRouter()
  const [showAddMessageModal, setShowAddMessageModal]= useState(false)
  const [packageMessage, setpackageMessage] = useState("")

  // ✅ Calculate subtotal dynamically
  const subtotal = useMemo(() => {
    return usercart.reduce((total, product) => {
      const size = product.selected_size;
      const price = parseFloat(
        product.product_sizes.find(
          (s) => s.size === size?.user_selected_size
        )?.price || 0
      );
      return total + price * (size?.quantity || 1);
    }, 0);
  }, [usercart]);

  const total = subtotal;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div className="border-b border-gray-200 p-3 flex flex-col gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span className="font-medium text-sm uppercase tracking-wide text-gray-700">{title}</span>
          <FiChevronDown
            className={`h-4 w-4 transition-transform duration-200 text-gray-500 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && <div className="pb-4 text-sm text-gray-600">{children}</div>}
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header - always fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-3 md:px-6 md:py-4 flex border-b border-gray-200">
        <div className="flex items-center cursor-pointer" onClick={router.back}>
          <MdKeyboardArrowLeft size={24} className="text-gray-700" />
          <p className='text-sm text-gray-700'>Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p className="tracking-wide">DBC ELEGANCE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 bg-gray-50 pt-[30px] lg:pt-[58px]">

        {/* Left Section (scrollable only on large screens) */}
        <div className="flex-2 hide-scrollbar w-full lg:px-[150px] lg:overflow-y-auto lg:h-[calc(100vh-80px)]">
          <OrderSummary
            products={usercart}
            removeCartItem={removeCartItem}
            updateCartItem={updateCartItem}
          />
          <PackagingGifting packageMessage={packageMessage} setpackageMessage={setpackageMessage}  setShowAddMessageModal={ setShowAddMessageModal} />
        </div>

        {/* Right Section (static) */}
        <div className="flex-1 w-full pb-14">
          <div className="bg-white p-6 space-y-6 relative lg:static">
            {/* Total Section */}
            <div className="space-y-3">
              <h2 className="text-xl font-semibold tracking-wide">Total</h2>
              <div className="flex justify-between text-gray-700">
                <span className="text-sm uppercase tracking-wide">Subtotal</span>
                <span className="font-medium">${formatPrice(subtotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="fixed mx-auto bottom-0 left-0 right-0 z-40 rounded-sm
                         w-[90%] bg-black text-white p-4 text-sm font-medium tracking-wide
                         hover:bg-gray-800 flex items-center justify-center
                         lg:static lg:w-full"
            >
              Continue to checkout
              <span className="ml-2">${formatPrice(total)}</span>
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-2">
              By placing your order you agree to the{' '}
              <a href="#" className="underline">
                terms of service
              </a>
            </p>
          </div>

          {/* Help & Services */}
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4 tracking-wide">Help &amp; Services</h2>

            <AccordionItem title={<div className='flex gap-2 items-center text-gray-600'><RiSecurePaymentLine size={20} /> <p className="text-sm uppercase tracking-wide">100% secure payment</p></div>} defaultOpen>
              <div className='flex flex-col gap-3'>
                <p className="mb-3 text-sm">
                  Your credit card details are safe with us. All the information is
                  protected using Secure Sockets Layer (SSL) technology.
                </p>
                <div className="flex space-x-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title={<div className='flex gap-2 items-center text-gray-600'><MdOutlineContactSupport size={20} /> <p className="text-sm uppercase tracking-wide">Need assistance?</p></div>}>
              <div className='flex flex-col gap-3'>
                  <p className='pb-2.5 text-sm'>
                    DBC ELEGANCE Client Service Center is available by phone from Monday to Friday 
                    from 10 am to 8 pm and Saturday from 10 am to 6 pm GMT, or at any time via email.
                  </p>
                  <div className='bg-black text-white rounded-sm p-3 text-sm'>
                    Contact us by phone: 08157967548
                  </div>
                  <div className='bg-black text-white rounded-sm p-3 text-sm'>
                    Contact us by email: support@dbcelegance.com
                  </div>
              </div>
            </AccordionItem>

            <AccordionItem title={<div className='flex gap-2 items-center text-gray-600'><CiDeliveryTruck size={20} /> <p className="text-sm uppercase tracking-wide">Free standard delivery</p></div>}>
              <p className="text-sm">Enjoy free standard delivery on all orders.</p>
            </AccordionItem>

            <AccordionItem title={<div className='flex gap-2 items-center text-gray-600'><MdOutlineCalendarToday size={20} /> <p className="text-sm uppercase tracking-wide">Free returns within 30 days</p></div>}>
              <p className="text-sm">
                You have 30 days from the date of delivery to request a refund or exchange. 
                For any questions or immediate changes, please contact DBC ELEGANCE Customer Care.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>
      {showAddMessageModal && <AddMessageModal setShowAddMessageModal={setShowAddMessageModal} packageMessage={packageMessage} setpackageMessage={setpackageMessage}/>}
    </div>
  );
};

export default ShoppingCart;