"use client";

import React from "react";
import { FiTrash2, FiChevronDown } from "react-icons/fi";

const OrderSummary = ({ products, removeCartItem, updateCartItem }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 font-sans">
            <h2 className="text-2xl font-medium mb-2">Order Summary</h2>
            <p className="text-gray-500 mb-6">{products.length} products</p>

            <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {products.map((product) => {
                    const firstImage = product.product_gallery?.[0]?.url;

                    // Get current selection from cart
                    const selectedSizeObj = product.selected_sizes?.[0]?.selected_size;
                    const quantity = product.selected_sizes?.[0]?.quantity || 1;

                    const price = selectedSizeObj?.price || 0;
                    const totalPrice = price * quantity;

                    return (
                        <div
                            key={product.product_id}
                            className=" flex md:flex-row gap-2  "
                        >
                            {/* Product Image */}
                            <div className="w-[50%] md:w-40 ">
                                <img
                                    src={firstImage || "/placeholder-image.jpg"}
                                    alt={product.product_name}
                                    className="w-full h-52 object-cover"
                                />
                            </div>

                            <div className="w-[50%] flex flex-col flex-1 relative">
                                {/* Product Details */}
                                <div className="">
                                    <h3 className="text-lg font-medium mb-3 pt-2 text-gray-700">
                                        {product.product_name}
                                    </h3>


                                    <div className="flex flex-wrap gap-2">
                                        {/* Size Selection */}
                                        <div className="flex gap-2 items-center">
                                            <p className="text-sm text-gray-600 mb-1">Size</p>
                                            <div className="relative inline-block">
                                                <select
                                                    value={selectedSizeObj?.size || ""}
                                                    onChange={(e) =>
                                                        updateCartItem(product.product_id, {
                                                            selected_size: product.sizes.find(
                                                                (s) => s.size === e.target.value
                                                            ),
                                                            quantity,
                                                        })
                                                    }
                                                    className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {product.sizes?.map((s) => (
                                                        <option key={s.sku} value={s.size}>
                                                            {s.size}
                                                        </option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Quantity Selection */}
                                        <div className="flex gap-2 items-center">
                                            <p className="text-sm text-gray-600 mb-1">Qty</p>
                                            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                                                <button
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                                                    onClick={() =>
                                                        updateCartItem(product.product_id, {
                                                            selected_size: selectedSizeObj,
                                                            quantity: Math.max(1, quantity - 1),
                                                        })
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 py-1">{quantity}</span>
                                                <button
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200"
                                                    onClick={() =>
                                                        updateCartItem(product.product_id, {
                                                            selected_size: selectedSizeObj,
                                                            quantity: quantity + 1,
                                                        })
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                    </div>


                                </div>

                                <div className="flex items-center justify-between px-2 bottom-2 absolute w-full">

                                    {/* Remove Button */}
                                    <button
                                        className="flex items-center text-gray-500 hover:text-red-500 text-sm"
                                        onClick={() => removeCartItem(product)}
                                    >
                                        <FiTrash2 className="mr-1" /> Remove
                                    </button>

                                    {/* Price */}
                                    <div className="text-right font-medium text-lg whitespace-nowrap">
                                        {formatPrice(totalPrice)} €
                                    </div>

                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Total */}
            <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>
                        {formatPrice(
                            products.reduce((total, product) => {
                                const selectedSizeObj =
                                    product.selected_sizes?.[0]?.selected_size;
                                const quantity = product.selected_sizes?.[0]?.quantity || 1;
                                const price = selectedSizeObj?.price || 0;
                                return total + price * quantity;
                            }, 0)
                        )}{" "}
                        €
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
