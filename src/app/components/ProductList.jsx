"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { FaHeart } from "react-icons/fa";

const ProductList = ({ gender, products = [], selected_category }) => {
  const setSelectedProduct = useSelectedProductStore((state) => state.setSelectedProduct);
  const itemsPerLoad = 8; // Number of products to load each time
  const [visibleCount, setVisibleCount] = useState(itemsPerLoad);
  const [wishlist, setWishlist] = useState([]); // Store entire product objects

  // Get the currently visible products
  const visibleProducts = products.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + itemsPerLoad);
  };

  const handleProductClick = (product) => {
    // Ensure we're storing the complete product data
    setSelectedProduct({
      ...product
    });
  };

  const handleWishlistClick = (product, e) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    e.stopPropagation(); // Prevent event bubbling
    
    // Check if product is already in wishlist
    const isInWishlist = wishlist.some(item => item.product_id === product.product_id);
    
    if (isInWishlist) {
      // Remove from wishlist
      setWishlist(prev => prev.filter(item => item.product_id !== product.product_id));
    } else {
      // Add to wishlist
      setWishlist(prev => [...prev, product]);
    }
    
    // Here you would typically make an API call to update wishlist on the server
    console.log(`Product ${product.product_id} wishlist status: ${!isInWishlist}`);
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-2 gap-2 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <Link
            href={`/store/${gender}/${selected_category.category_name}/${product.product_name}`}
            key={product.product_id}
            onClick={() => handleProductClick(product)}
          >
            <div className="bg-white shadow hover:shadow-lg transition duration-300 overflow-hidden relative">
              {/* Heart icon for wishlist */}
              <div 
                className="absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-colors"
                onClick={(e) => handleWishlistClick(product, e)}
                style={{
                  backgroundColor: isInWishlist(product.product_id) ? 'black' : 'white'
                }}
              >
                <FaHeart 
                  className={isInWishlist(product.product_id) ? "text-white" : "text-black"} 
                />
              </div>

              <ImageCarousel product={product} />

              <div className="p-4">
                <h3 className="text-md font-extralight text-gray-500 mb-2">
                  {product.product_name}
                </h3>

              </div>
            </div>
          </Link>
        ))}
      </div>

    <div className="mt-[160px]">
        {/* Show "See More" button only if there are more products to show */}
      {visibleCount < products.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-black text-white rounded-3xl hover:bg-gray-800 transition-colors duration-300"
          >
            See More
          </button>
        </div>
      )}

      {/* Show disabled button when all products are visible */}
      {visibleCount >= products.length && products.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            disabled
            className="px-6 py-3 bg-gray-300 text-gray-500 rounded-3xl cursor-not-allowed"
          >
            See More
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

  // Safely handle product_gallery being undefined
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
    const threshold = window.innerWidth * 0.2; // 20% swipe threshold

    if (diff > threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Next
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // Prev
    }
  };

  return (
    <div
      className="relative h-[300px] lg:h-[600px] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.length > 0 ? (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`${product.product_name} - ${idx + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-500">No images available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;