"use client";

import React from 'react';
import { CiSearch, CiHeart, CiUser, CiShoppingCart, CiCircleMinus } from 'react-icons/ci';
import Search from './Search';
import AccountsPage from './AccountsPage';
import { useNavStore } from '@/app/lib/store/navmodalstore';
import Wishlist from './WishList';
import { useUserCart } from '@/app/lib/store/userCart';
import { useRouter } from 'next/navigation';

const ModalMain = () => {
  let router= useRouter()
  const { selectednavtab, setSelectedNavTab, clearSelectedNavTab, showmodal, setShowModal } = useNavStore();
  const usercart = useUserCart((state) => state.usercart);

  if (!showmodal) return null;

  function renderActiveTab() {
    switch (selectednavtab) {
      case "search":
        return <Search setShowModal={setShowModal} />;
      case "wishlist":
        return <Wishlist setShowModal={setShowModal} />;
      case "user":
        return <AccountsPage />;
      case "cart":
        return <Search />;
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end p-3 z-50">
      <div
        className="w-full lg:w-[50%] bg-white rounded shadow-lg flex flex-col"
        style={{
          animation: 'slide-in-right 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                clearSelectedNavTab();
              }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
              aria-label="Close modal"
            >
              <CiCircleMinus className="text-xl" />
              <span className="tracking-wide">CLOSE</span>
            </button>

            {/* Icons */}
            <div className="flex gap-5 items-center">
              {[
                { name: 'search', icon: <CiSearch /> },
                { name: 'wishlist', icon: <CiHeart /> },
                { name: 'user', icon: <CiUser /> },
                { name: 'cart', icon: <CiShoppingCart /> },
              ].map(({ name, icon }) => (
                <button
                  key={name}
                  onClick={() => 
                    {if (name!=="cart"){
                      setSelectedNavTab(name)
                    }
                    else{
                     
                         router.push("/couture/shopping-cart")
                          setShowModal(false)
                    }
                  }
                  }
                  aria-label={name}
                  className={`relative flex justify-center items-center h-10 w-10 transition-all duration-200 ${
                    selectednavtab === name
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{icon}</span>

                  {/* Show badge only on cart */}
                  {name === 'cart' && usercart?.length > 0 && (
                    <span className="absolute -bottom-0.5 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                      {usercart.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
          {renderActiveTab()}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ModalMain;
