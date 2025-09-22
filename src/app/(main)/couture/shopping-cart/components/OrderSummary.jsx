"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGeoDataStore } from '@/app/lib/store/geoDataStore';

const OrderSummary = ({ products, removeCartItem, updateCartItem, roundToNearestTopHundred, geoData }) => {
    const formatPrice = (price) =>
        new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);

    // Helper function if not passed as prop
    const defaultRoundToNearestTopHundred = (price) => {
        if (!price) return "N/A";
        //return Math.ceil(price / 10) * 10;
        return price
    };

    const roundFunction = roundToNearestTopHundred || defaultRoundToNearestTopHundred;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between py-4">
                <h2 className="lg:text-xl text-lg tracking-wide">Order Summary</h2>
                {products.length > 0 && <p className="text-gray-500 text-sm uppercase tracking-wide">{products.length} products</p>}
            </div>

            {
                products.length > 0 ?
                    (
                        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                            {products.map((product, index) => {
                                const firstImage = product.product_gallery?.[0]?.url;
                                const selectedSizeObj = product.selected_size;
                                const quantity = selectedSizeObj?.quantity || 1;

                                // Find matching price and apply exchange rate
                                const rawPrice =
                                    product.product_sizes.find(
                                        (s) => s.size === selectedSizeObj?.user_selected_size
                                    )?.price || 0;

                                const price = rawPrice * geoData.exchange_rate;
                                const roundedPrice = roundFunction(price);
                                const totalPrice = roundedPrice * quantity;

                                return (
                                    <div key={index} className="flex md:flex-row gap-2 ">
                                        {/* Product Image */}
                                        <div className="w-[40%] lg:w-[30%] lg:h-[350px]">
                                            <img
                                                src={firstImage || "/placeholder-image.jpg"}
                                                alt={product.product_name}
                                                className="w-full h-full object-fill"
                                            />
                                        </div>

                                        <div className={`w-[55%] lg:px-[70px] flex flex-col lg:flex-row lg:items-center bg-white flex-1 relative lg:static`}>
                                            {/* Product Details */}
                                            <div className="w-full lg:px-[70px]">
                                                <h3 className="text-base font-medium mb-3 pt-2 text-gray-700 tracking-wide">
                                                    {product.product_name}
                                                </h3>

                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    {/* Size */}
                                                    <p className="text-sm text-gray-600 uppercase tracking-wide">
                                                        Size: <b>{selectedSizeObj?.user_selected_size}</b>
                                                    </p>

                                                    {/* Quantity */}
                                                    <div className="flex gap-2 items-center">
                                                        <p className="text-sm text-gray-600 uppercase tracking-wide">Qty</p>
                                                        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
                                                            <button
                                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
                                                                onClick={() =>
                                                                    updateCartItem(
                                                                        product.product_id,
                                                                        selectedSizeObj.user_selected_size,
                                                                        { quantity: Math.max(1, quantity - 1) }
                                                                    )
                                                                }
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-3 py-1 text-sm">{quantity}</span>
                                                            <button
                                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
                                                                onClick={() =>
                                                                    updateCartItem(
                                                                        product.product_id,
                                                                        selectedSizeObj.user_selected_size,
                                                                        { quantity: quantity + 1 }
                                                                    )
                                                                }
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex lg:items-center justify-between px-2 lg:px-6 bottom-2 absolute w-full lg:w-[20%] lg:static lg:flex-col lg:gap-4">
                                                {/* Remove */}
                                                <button
                                                    className="flex items-center text-gray-500 hover:text-red-500 text-xs uppercase tracking-wide"
                                                    onClick={() => removeCartItem(product)}
                                                >
                                                    <FiTrash2 className="mr-1" /> Remove
                                                </button>

                                                {/* Price */}
                                                <div className="font-medium text-base whitespace-nowrap">
                                                    {geoData?.currency_symbol}{formatPrice(totalPrice)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) :

                    (<div className="text-gray-500">No Items in the Cart</div>)
            }
        </div>
    );
};

export default OrderSummary;