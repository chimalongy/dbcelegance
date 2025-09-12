"use client";
import React, { useState } from "react";

const PackagingOptions = ({packageMessage, setpackageMessage,setShowAddMessageModal}) => {
    const [selectedPackaging, setSelectedPackaging] = useState("signature");
    const [giftOptions, setGiftOptions] = useState({
        shoppingBag: true,
        offerGift: true,
        giftMessage: true,
    });

    const toggleGiftOption = (key) => {
        setGiftOptions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="p-6">
            {/* Packaging Header */}
            <div className="flex items-center justify-between py-4">
                <h2 className="lg:text-xl text-lg  tracking-wide">Packaging & Gifting</h2>
                <p className="text-gray-500 text-sm ">Complimentary options</p>
            </div>

            {/* Packaging Images */}
            <div className="grid grid-cols-4 gap-0.5">
                <img src="/images/packaging/Image_1_Women_desktop.jpg" alt="DBC ELEGANCE 1" className="object-cover" />
                <img src="/images/packaging/Image_2_Women_desktop.jpg" alt="DBC ELEGANCE 2" className="object-cover" />
                <img src="/images/packaging/Image_3_Women_desktop.jpg" alt="DBC ELEGANCE 3" className="object-cover" />
                <img src="/images/packaging/Image_1_Women_desktop.jpg" alt="DBC ELEGANCE 4" className="object-cover" />
            </div>

            {/* Packaging Options */}
            <div className="space-y-4 pt-6">
                {/* Signature Packaging */}
                <label
                    className="flex items-start space-x-3 cursor-pointer"
                    onClick={() => setSelectedPackaging("signature")}
                >
                    <input
                        type="radio"
                        name="packaging"
                        checked={selectedPackaging === "signature"}
                        onChange={() => setSelectedPackaging("signature")}
                        className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <div>
                        <p className="font-medium text-gray-800  uppercase tracking-wide">Signature Packaging</p>
                        {selectedPackaging === "signature" && (
                            <p className="text-sm text-gray-600 p-3">
                                All orders come wrapped in an iconic DBC ELEGANCE gift box – responsibly
                                produced, certified and made of more than 90% recycled materials.
                            </p>
                        )}
                    </div>
                </label>

                {/* Eco Packaging */}
                <label
                    className="flex items-start space-x-3 cursor-pointer"
                    onClick={() => setSelectedPackaging("eco")}
                >
                    <input
                        type="radio"
                        name="packaging"
                        checked={selectedPackaging === "eco"}
                        onChange={() => setSelectedPackaging("eco")}
                        className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                    />
                    <div>
                        <p className="font-medium text-gray-800 text-sm uppercase tracking-wide">Eco Packaging</p>
                        {selectedPackaging === "eco" && (
                            <p className="text-sm text-gray-600 p-3">
                                Conceived to use as few resources as possible, this single-material
                                packaging is made from 100% recycled cardboard, and incorporates
                                solvent-free, water-based ink. <br />
                                Gift packaging is not included. <br />
                                For eligible products only.
                            </p>
                        )}
                    </div>
                </label>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            {/* Gift Options */}
            <div className="space-y-6">
                {/* Shopping Bag */}
                <div className="flex items-center justify-between bg-gray-50 border border-gray-200">
                    <label className="flex items-start space-x-3 cursor-pointer p-4">
                        <input
                            type="checkbox"
                            checked={giftOptions.shoppingBag}
                            onChange={() => toggleGiftOption("shoppingBag")}
                            className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                        />
                        <div>
                            <p className="font-medium text-gray-800 text-sm uppercase tracking-wide">
                                Add a DBC ELEGANCE shopping bag
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                This will be added to your parcel.
                            </p>
                        </div>
                    </label>
                    <img
                        src="/images/packaging/Image_1_Women_desktop.jpg"
                        alt="DBC ELEGANCE bag"
                        className="w-20 object-cover"
                    />
                </div>

                {/* Offer as Gift */}
                <div className="flex flex-col-reverse lg:flex-row justify-between bg-gray-50 border border-gray-200">
                    <div className="flex-1 space-y-3 p-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={giftOptions.offerGift}
                                onChange={() => toggleGiftOption("offerGift")}
                                className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <div>
                                <p className="font-medium text-gray-800 text-sm uppercase tracking-wide">Offer as a gift</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Make it unique by choosing complimentary options
                                </p>
                            </div>
                        </label>

                        {/* Gift message */}
                        {giftOptions.offerGift && (
                            <div className="ml-7 space-y-3">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={giftOptions.giftMessage}
                                        onChange={() => toggleGiftOption("giftMessage")}
                                        className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm uppercase tracking-wide">
                                            Gift message added
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Your order will be delivered with a blank greeting card.
                                        </p>
                                        <button className="mt-2 inline-flex items-center px-3 py-1.5 bg-black text-white text-xs font-medium tracking-wide hover:bg-gray-800"
                                        onClick={()=>{
                                            setShowAddMessageModal(true)
                                        }}
                                        >
                                            ✏ Add a message
                                        </button>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="h-fill lg:w-[20%]">
                        <img
                            src="/images/packaging/Image_2_Women_desktop.jpg"
                            alt="DBC ELEGANCE gift"
                            className="w-full h-[200px] lg:h-[100%] object-fill"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <p className="text-xs text-gray-500 mt-4">
                Prices and billing are removed from gifted products.
            </p>
        </div>
    );
};

export default PackagingOptions;