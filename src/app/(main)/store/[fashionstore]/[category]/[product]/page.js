"use client";
import Navbar from "@/app/components/Nav";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { useNavStore } from "../../../../../lib/store/navmodalstore";
import ModalMain from "@/app/components/modalpages.jsx/ModalMain";
import { useSelectedProductStore } from "@/app/lib/store/selectedproductstore";

const ProductPage = () => {
  const selectedProductMem = useSelectedProductStore((state) => state.selectedproduct);
  const [selectedProduct, setSelectedProduct] = useState({});
  const { selectednavtab, setSelectedNavTab, clearSelectedNavTab, showmodal, setShowModal } = useNavStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showMore, setShowMore] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  // store refs for all videos
  const videoRefs = useRef([]);

  const tabs = [
    { key: "description", label: "Description" },
    { key: "size", label: "Size & Fit" },
    { key: "contact", label: "Contact & In-Store Availability" },
    { key: "delivery", label: "Delivery & returns" },
  ];

  const content = {
    description: selectedProduct?.product_description || "",
    size: "Model is 6'1\" and wears size M.",
    contact: "Available in select stores. Please contact customer service.",
    delivery: "Standard delivery in 3-5 business days. Free returns within 30 days.",
  };

  useEffect(() => {
    if (selectedProductMem?.product_id) {
      setSelectedProduct(selectedProductMem);
    }
  }, [selectedProductMem?.product_id]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (video) {
        if (i === currentIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  const productMedia = selectedProduct?.product_gallery || [];
  const productSizes = ["S", "M", "L", "XL"];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % productMedia.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + productMedia.length) % productMedia.length);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      console.log(selectedProductMem);
      setSizeError(true);
      return;
    }
    console.log(`Added to cart: ${selectedProduct?.product_name}, Size ${selectedSize}`);
  };

  const renderMedia = (mediaItem, index) => {
    if (mediaItem.type === "video") {
      return (
        <div key={index} className="relative w-full h-[70vh] lg:h-[85vh] bg-black">
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={mediaItem.url}
            className="w-full h-full object-cover"
            autoPlay={index === currentIndex}
            muted
            loop
            playsInline
          />
        </div>
      );
    } else {
      return (
        <div key={index} className="relative w-full h-[70vh] lg:h-[85vh] bg-white">
          <Image
            src={mediaItem.url}
            alt={`${selectedProduct.product_name} image ${index + 1}`}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      );
    }
  };

  if (!selectedProduct?.product_id) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>No product selected</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar />

      <div className="flex flex-col lg:py-24 lg:flex-row lg:px-16 xl:px-32 gap-8 lg:gap-16">
        {/* Media Carousel */}
        <div className="flex-1 flex flex-col items-center lg:sticky lg:top-24 lg:self-start">
          {productMedia.length > 0 && (
            <>
              {renderMedia(productMedia[currentIndex], currentIndex)}

              {/* Navigation Arrows - Only show if more than one media item */}
              {productMedia.length > 1 && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Previous media"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Next media"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Enhanced Thumbnail Navigation */}
              {productMedia.length > 1 && (
                <div className="w-full mt-4 px-4 max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide px-2">
                      {productMedia.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`flex-shrink-0 relative rounded overflow-hidden transition-all duration-200 ${
                            currentIndex === index
                              ? "ring-2 ring-black"
                              : "opacity-70 hover:opacity-100"
                          }`}
                          style={{
                            width: "clamp(60px, 15vw, 80px)",
                            height: "clamp(60px, 15vw, 80px)",
                          }}
                          aria-label={`View media ${index + 1}`}
                        >
                          {item.type === "image" ? (
                            <Image
                              src={item.url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 15vw, 80px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-gray-400"
                              >
                                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                              </svg>
                              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                            </div>
                          )}
                          {item.type === "video" && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-3 h-3"
                              >
                                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col w-full lg:w-1/2 space-y-6 px-6 lg:px-0 justify-end mb-6 lg:sticky lg:top-24 lg:self-start">
          <div className="max-w-2xl mx-auto w-full">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
              {selectedProduct.product_name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedProduct.variants?.[0]?.sku || "Product variant"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Reference: {selectedProduct.product_id}
            </p>

            {/* Price Display */}
            <div className="mt-4 text-lg font-medium">
              {selectedProduct.variants?.[0]?.variant_price?.toFixed(2) || "0.00"} €
            </div>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="size" className="block text-sm font-medium">
                  Select your size
                </label>
                {/* <button className="text-xs text-gray-500 hover:underline">
                  Size guide
                </button> */}
              </div>
              <div className="flex flex-wrap gap-2">
                {productSizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className={`border w-14 h-10 flex items-center justify-center text-sm transition-colors
                      ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="mt-2 text-sm text-red-600">Please select a size</p>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Add to cart
              </button>
              <button
                className="w-full border border-gray-300 text-gray-500 py-3 rounded cursor-not-allowed"
                disabled
              >
                Express payment
              </button>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8 font-sans text-gray-800 border-t border-gray-200 pt-6">
              {/* Tabs for Desktop */}
              <div className="hidden md:flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm border-b-2 transition-all ${
                      activeTab === tab.key
                        ? "border-black font-medium"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content for Desktop */}
              <div className="hidden md:block py-4">
                {activeTab === "description" && (
                  <div>
                    <p className="text-sm mb-3">
                      {showMore
                        ? content.description
                        : `${content.description.substring(0, 150)}${
                            content.description.length > 150 ? "..." : ""
                          }`}
                    </p>
                    {content.description.length > 150 && (
                      <button
                        onClick={() => setShowMore(!showMore)}
                        className="text-sm underline hover:text-gray-600"
                      >
                        {showMore ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}
                {activeTab === "size" && (
                  <p className="text-sm">{content.size}</p>
                )}
                {activeTab === "contact" && (
                  <p className="text-sm">{content.contact}</p>
                )}
                {activeTab === "delivery" && (
                  <p className="text-sm">{content.delivery}</p>
                )}
              </div>

              {/* Accordion for Mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {tabs.map((tab) => (
                  <div key={tab.key} className="py-4">
                    <button
                      className="flex justify-between w-full items-center"
                      onClick={() =>
                        setActiveTab(activeTab === tab.key ? "" : tab.key)
                      }
                    >
                      <h3 className="font-medium text-sm">{tab.label}</h3>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform ${
                          activeTab === tab.key ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {activeTab === tab.key && (
                      <div className="mt-2 text-sm text-gray-700">
                        {tab.key === "description" ? (
                          <>
                            <p className="mb-2">
                              {showMore
                                ? content.description
                                : `${content.description.substring(0, 150)}${
                                    content.description.length > 150 ? "..." : ""
                                  }`}
                            </p>
                            {content.description.length > 150 && (
                              <button
                                onClick={() => setShowMore(!showMore)}
                                className="text-sm underline hover:text-gray-600"
                              >
                                {showMore ? "Show less" : "Read more"}
                              </button>
                            )}
                          </>
                        ) : (
                          <p>{content[tab.key]}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {showmodal && <ModalMain />}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;