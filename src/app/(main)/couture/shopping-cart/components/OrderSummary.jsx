"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { useGeoDataStore } from "@/app/lib/store/geoDataStore";

const OrderSummary = ({
  products,
  removeCartItem,
  updateCartItem,
  roundToNearestTopHundred,
  geoData,
}) => {
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const defaultRoundToNearestTopHundred = (price) => {
    if (!price) return "N/A";
    return price;
  };

  const roundFunction = roundToNearestTopHundred || defaultRoundToNearestTopHundred;

  const allItems = products || [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between py-4">
        <h2 className="lg:text-xl text-lg tracking-wide">Order Summary</h2>
        {allItems.length > 0 && (
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {allItems.length} items
          </p>
        )}
      </div>

      {allItems.length > 0 ? (
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {allItems.map((item, index) => {
            // 🧠 Detect if item is a product or accessory
            const isAccessory = !!item.accessory_id;

            const name = isAccessory
              ? item.accessory_name
              : item.product_name;

            const gallery = isAccessory
              ? item.accessory_gallery
              : item.product_gallery;

            const sizes = isAccessory
              ? item.accessory_sizes
              : item.product_sizes;

            const selectedSizeObj = item.selected_size;
            const quantity = selectedSizeObj?.quantity || 1;

            const firstImage = gallery?.[0]?.url;
            const selectedSize = selectedSizeObj?.user_selected_size;

            // 🧮 Price calculation
            const rawPrice =
              sizes?.find((s) => s.size === selectedSize)?.price || 0;

            const price = rawPrice * geoData.exchange_rate;
            const roundedPrice = roundFunction(price);
            const totalPrice = roundedPrice * quantity;

            return (
              <div key={index} className="flex md:flex-row gap-2 py-3">
                {/* 🖼️ Image */}
                <div className="w-[40%] lg:w-[30%] lg:h-[350px]">
                  <img
                    src={firstImage || "/placeholder-image.jpg"}
                    alt={name}
                    className="w-full h-full object-fill"
                  />
                </div>

                {/* 🧾 Details */}
                <div className="w-[55%] lg:px-[70px] flex flex-col lg:flex-row lg:items-center bg-white flex-1 relative lg:static">
                  <div className="w-full lg:px-[70px]">
                    <h3 className="text-base font-medium mb-3 pt-2 text-gray-700 tracking-wide">
                      {name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      {/* Size */}
                      <p className="text-sm text-gray-600 uppercase tracking-wide">
                        Size: <b>{selectedSize}</b>
                      </p>

                      {/* Quantity */}
                      <div className="flex gap-2 items-center">
                        <p className="text-sm text-gray-600 uppercase tracking-wide">
                          Qty
                        </p>
                        <div className="flex items-center border border-gray-300 rounded-sm overflow-hidden">
                          <button
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
                            onClick={() =>
                              updateCartItem(
                                isAccessory
                                  ? item.accessory_id
                                  : item.product_id,
                                selectedSize,
                                { quantity: Math.max(1, quantity - 1) },
                                isAccessory // 👈 Pass type if needed
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
                                isAccessory
                                  ? item.accessory_id
                                  : item.product_id,
                                selectedSize,
                                { quantity: quantity + 1 },
                                isAccessory
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🗑️ Remove + 💰 Price */}
                  <div className="flex lg:items-center justify-between px-2 lg:px-6 bottom-2 absolute w-full lg:w-[20%] lg:static lg:flex-col lg:gap-4">
                    <button
                      className="flex items-center text-gray-500 hover:text-red-500 text-xs uppercase tracking-wide"
                      onClick={() => removeCartItem(item)}
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>

                    <div className="font-medium text-base whitespace-nowrap">
                      {geoData?.currency_symbol}
                      {formatPrice(totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500">No Items in the Cart</div>
      )}
    </div>
  );
};

export default OrderSummary;
