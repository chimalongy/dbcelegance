"use client";
import React from "react";

const ModalMain = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 h-screen bg-gray-300/40 backdrop-blur-md flex  lg:justify-end p-3 z-50">

      <div 
        className=" w-full lg:w-[50%] bg-white rounded"
        style={{
          animation: 'slide-in-right 0.5s ease-out',
        }}
      >
        search
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default ModalMain;
