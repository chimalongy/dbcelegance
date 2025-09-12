"use client";

import React from 'react';
import { CiCircleMinus } from 'react-icons/ci';

const AddMessageModal = ({ packageMessage, setpackageMessage, setShowAddMessageModal }) => {
    return (
        <div className="fixed inset-0 h-screen bg-gray-300/40 backdrop-blur-md flex lg:justify-end items-end lg:items-stretch p-3 z-50">
            <div
                className="w-full lg:w-[50%] lg:h-full h-[70%] bg-white rounded-sm flex flex-col"
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
                                setShowAddMessageModal(false);
                            }}
                            className="flex items-center gap-2 text-xs text-gray-600 hover:text-black transition-colors duration-200 uppercase tracking-wide"
                            aria-label="Close modal"
                        >
                            <CiCircleMinus className="text-lg" />
                            <span>CLOSE</span>
                        </button>

                        <div>
                            <h1 className="text-sm font-medium uppercase tracking-wide">Write your Gift Message</h1>
                        </div>
                    </div>
                </div>

                {/* Scrollable Tab Content */}
                <div className="flex-grow overflow-y-auto min-h-0 hide-scrollbar">
                    <div className='w-full bg-gray-100 h-[300px] lg:h-[600px] flex items-center justify-center'>
                        <div className='bg-white h-[150px] w-[150px] lg:h-[300px] lg:w-[300px] flex flex-col gap-3'>
                            <p className="text-center lg:pt-6 pt-3 tracking-wide">
                                DBC ELEGANCE
                            </p>

                            <div className="w-full text-xs font-light italic text-center break-words text-gray-500 lg:px-3 px-2">
                                {packageMessage}
                            </div>
                        </div>
                    </div>

                    <div className='lg:px-6 px-6 gap-6 w-full pt-8'>
                        <p className="text-sm uppercase tracking-wide text-gray-700">Your Message</p>

                        <div className='gap-4 flex flex-col'>
                            <textarea
                                value={packageMessage}
                                onChange={(e) => setpackageMessage(e.target.value)}
                                placeholder='Enter your gift message and preview the greeting card above.'
                                className='w-full p-4 border-b border-gray-300 focus:border-black focus:outline-none bg-transparent transition-colors resize-none'
                                rows="3"
                            />

                            <button 
                                className={`${packageMessage.length < 1 ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"} text-white p-3 rounded-sm text-sm font-medium tracking-wide transition-all`}
                                disabled={packageMessage.length < 1}

                               onClick={()=>{setShowAddMessageModal(false)}}
                            >
                                Confirm
                            </button>
                            <p className='text-center text-xs text-gray-500 pt-2'
                             onClick={()=>{setShowAddMessageModal(false)}}
                            >I prefer a blank card.</p>
                        </div>
                    </div>
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

export default AddMessageModal;