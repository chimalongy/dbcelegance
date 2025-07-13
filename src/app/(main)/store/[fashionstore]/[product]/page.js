"use client";
import Navbar from "@/app/components/Nav";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { useNavStore } from '../../../../lib/store/navmodalstore';
import ModalMain from "@/app/components/modalpages.jsx/ModalMain";

const ProductPage = () => {
   const { selectednavtab, setSelectedNavTab, clearSelectedNavTab, showmodal,setShowModal } = useNavStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [showMore, setShowMore] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // Track selected size
  const [sizeError, setSizeError] = useState(false); // For size selection validation

  const tabs = [
    { key: "description", label: "Description" },
    { key: "size", label: "Size & Fit" },
    { key: "contact", label: "Contact & In-Store Availability" },
    { key: "delivery", label: "Delivery & returns" },
  ];

  const content = {
    description: `The zipped shirt is part of the exclusive DIOR AND LEWIS HAMILTON capsule. Crafted in multicolor technical fabric with a gradient effect, it showcases the DIOR AND LEWIS HAMILTON embroidery, with the House signature revisited in a graphic style, as well as the collaboration's logo on the back. A chevron pan...`,
    size: "Model is 6'1\" and wears size M.",
    contact: "Available in select stores. Please contact customer service.",
    delivery: "Standard delivery in 3-5 business days. Free returns within 30 days.",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gender = "mensfashion";
  const imagePrefix = `/images/products/${gender === "mensfashion" ? "M" : "F"}`;
  const images = Array.from(
    { length: 3 },
    (_, j) => `${imagePrefix}${j + 1}.jpg`
  );

  const productSizes = ['S', 'M', 'L', 'XL'];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false); // Reset error when a size is selected
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    // Here you would typically add the product to cart with the selected size
    console.log(`Added to cart: Size ${selectedSize}`);
    // You might want to redirect to cart or show a success message
  };

  return (
    <div>
      <Navbar />

      <div className="flex flex-col lg:py-24 lg:flex-row lg:px-32 gap-10">
        {/* Image Carousel */}
        <div className="flex-1 flex flex-col items-center">
          <div className="relative w-full h-[70vh] lg:h-[85vh]">
            <Image
              src={images[currentIndex]}
              alt={`Product image ${currentIndex}`}
              className="object-fill lg:object-contain border-gray-200"
              fill
              sizes="100vw"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={handlePrev}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 space-y-6 px-6 justify-end mb-6">
          {/* PRODUCT DETAILS SECTION */}
          <div className="">
            <h1 className="text-2xl font-semibold">DBC Track Pants</h1>
            <p className="text-sm text-gray-600">Multicolor Technical Fabric</p>
            <p className="text-xs text-gray-500">
              Reference: 513C127B4501_C482
            </p>

            {/* Size Selector */}
            <div className="mt-4">
              <label htmlFor="size" className="block mb-1 text-sm font-medium">
                Select your size
              </label>
              <div className="flex gap-2">
                {productSizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => handleSizeSelect(size)}
                    className={`border w-[40px] h-[40px] flex items-center justify-center text-sm
                      ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="mt-2 text-sm text-red-600">Please select a size</p>
              )}
              <div className="flex justify-between mt-2 text-sm text-blue-600">
                <button className="hover:underline">Size recommendation</button>
                <button className="hover:underline">Size Chart</button>
              </div>
            </div>

            {/* Price & Button */}
            <div className="mt-6">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
              >
                Add to cart - 2,300.00 €
              </button>
              <button
                className="w-full mt-2 border border-gray-300 text-gray-500 py-3 rounded cursor-not-allowed"
                disabled
              >
                Express payment
              </button>
            </div>

            {/* Rest of the content remains the same */}
            <div className="font-sans text-gray-800">
              {/* Tabs for Desktop */}
              <div className="hidden md:flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm border-b-2 transition-all ${
                      activeTab === tab.key
                        ? "border-black font-medium"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content for Desktop */}
              <div className="hidden md:block p-4">
                {activeTab === "description" && (
                  <div>
                    <p className="text-sm mb-3">
                      {showMore
                        ? content.description
                        : content.description.slice(0, 150) + "..."}
                    </p>
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="text-sm underline"
                    >
                      {showMore ? "See less" : "See more"}
                    </button>
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
                                : content.description.slice(0, 150) + "..."}
                            </p>
                            <button
                              onClick={() => setShowMore(!showMore)}
                              className="text-sm underline"
                            >
                              {showMore ? "See less" : "See more"}
                            </button>
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
         {showmodal && <ModalMain/>}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;