"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { FaHeart } from "react-icons/fa";
import { useUserWishList } from "../lib/store/UserWishList";

const ProductList = ({ gender, products = [], selected_category }) => {
  const setSelectedProduct = useSelectedProductStore((state) => state.setSelectedProduct);

  // ✅ Ensure wishlist is always an array
  const wishlist = useUserWishList((state) => state.userwishlist) || [];
  const setWishList = useUserWishList((state) => state.setWishList);

  const itemsPerLoad = 8; 
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);

  const visibleProducts = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + itemsPerLoad);
  };

  const handleProductClick = (product) => {
    setSelectedProduct({
      ...product,
    });
  };

  const handleWishlistClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    const inWishlist = isInWishlist(product.product_id);

    if (inWishlist) {
      const updated = wishlist.filter((item) => item.product_id !== product.product_id);
      setWishList(updated);
    } else {
      const updated = [...wishlist, product];
      setWishList(updated);
    }

    console.log(`Product ${product.product_id} wishlist status: ${!inWishlist}`);
  };

  // ✅ Safe check: wishlist is always array
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.product_id === productId);
  };

  return (
    <div className="container mx-auto py-8 ">
      <div className="grid grid-cols-2 gap-2 md:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <Link
            href={`/store/${gender}/${selected_category.category_name}/${product.product_name}`}
            key={product.product_id}
            onClick={() => handleProductClick(product)}
            className="group"
          >
            <div className="bg-white overflow-hidden relative transition-all duration-500 group-hover:shadow-xl">
              {/* Heart icon for wishlist - Reduced size */}
              <div
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white"
                onClick={(e) => handleWishlistClick(product, e)}
                style={{
                  color: isInWishlist(product.product_id) ? "black" : "rgba(0,0,0,0.6)",
                }}
              >
                <FaHeart
                  className={`w-3 h-3 ${isInWishlist(product.product_id) ? "text-black" : "text-gray-600"}`}
                  style={{
                    fill: isInWishlist(product.product_id) ? "black" : "none",
                    stroke: isInWishlist(product.product_id) ? "black" : "currentColor",
                    strokeWidth: isInWishlist(product.product_id) ? "0" : "1.5"
                  }}
                />
              </div>

              <ImageCarousel product={product} />

              <div className="p-4 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                <h3 className="text-sm font-light text-gray-700 mb-1 tracking-wide uppercase">
                  {product.product_name}
                </h3>
                {/* Price section removed */}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-24">
        {/* Show "See More" button only if there are more products to show */}
        {visibleCount < products.length && (
          <div className="flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-black text-white text-sm tracking-wide uppercase hover:bg-gray-800 transition-colors duration-300 font-light"
            >
              View More
            </button>
          </div>
        )}

        {/* Show disabled button when all products are visible */}
        {visibleCount >= products.length && products.length > 0 && (
          <div className="flex justify-center">
            <button
              disabled
              className="px-8 py-3 bg-gray-100 text-gray-400 text-sm tracking-wide uppercase cursor-not-allowed font-light"
            >
              All Items Displayed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ImageCarousel = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef(0);
  const currentX = useRef(0);

  const images = (product.product_gallery || [])
    .filter((media) => media?.type === "image")
    .slice(0, 3);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (images.length <= 1) return;

    const diff = startX.current - currentX.current;
    const threshold = window.innerWidth * 0.2;

    if (diff > threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      className="relative h-[280px] lg:h-[500px] overflow-hidden bg-gray-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.length > 0 ? (
          images.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <img
                src={img.url}
                alt={`${product.product_name} - ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-sm tracking-wide">NO IMAGE AVAILABLE</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;