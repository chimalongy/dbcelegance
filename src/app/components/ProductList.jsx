"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { FaHeart } from "react-icons/fa";

const ProductList = ({ gender, products = [], selected_category }) => {
  const setSelectedProduct = useSelectedProductStore((state) => state.setSelectedProduct);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState([]); // Store entire product objects

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleProductClick = (product) => {
    // Ensure we're storing the complete product data
    setSelectedProduct({
      ...product,
      // Make sure variants is properly formatted
      variants: product.variants?.map(variant => ({
        ...variant,
        variant_gallery: variant.variant_gallery || []
      })) || []
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
        {currentProducts.map((product) => (
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
                <p className="text-gray-700 font-bold">
                  ${product.variants[0]?.variant_price?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-700 text-center sm:text-left">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(indexOfLastItem, products.length)}
          </span>{" "}
          of <span className="font-medium">{products.length}</span> products
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
                  currentPage === pageNumber
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-amber-500"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 py-1 text-sm text-gray-500">...</span>
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-amber-300 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-amber-500"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
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