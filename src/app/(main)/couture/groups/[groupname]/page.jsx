"use client";
import Navbar from "@/app/components/Nav";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";
import { useNavStore } from "../../../../lib/store/navmodalstore";
import ModalMain from "@/app/components/modalpages.jsx/ModalMain";
import { useUserViewedProducts } from "@/app/lib/store/UserViewedProducts";
import RecentlyViewd from "@/app/components/RecentlyViewd";
import { useUserCart } from "@/app/lib/store/userCart";
import { FaTrashAlt } from "react-icons/fa";
import { useLeftNavStore } from "@/app/lib/store/leftnavmodalstore";
import NavLeftModal from "@/app/components/NavLeftModal";
import { useGeoDataStore } from "@/app/lib/store/geoDataStore";
import CompleteSilHoutte from "@/app/components/CompleteSilHoutte";
import { useParams } from "next/navigation";
import { useUserSelectedGroup } from "@/app/lib/store/productgroups/userselectedgroup";
import CategoryLoader from "@/app/components/CategoryLoader";
import { useRouter } from "next/navigation";


import { useSelectedStoreProducts } from "@/app/lib/store/selectedstoreproductsstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";

import { useSelectedStoreAccessoryProducts } from "@/app/lib/store/selectedstoreaccessoryproductsstore";
import { useSelectedStoreAccessoryCategories } from "@/app/lib/store/selectedstoreaccessorycategoriesstore";


import { useSelectedProductStore } from "@/app/lib/store/selectedproductstore";
import { useSelectedAccessoryProductStore } from "@/app/lib/store/selected_accessory_productstore";




const GroupsPage = () => {

  let selectedstoreaccessoryproducts = useSelectedStoreAccessoryProducts((state) => state.selectedstoreaccessoryproducts)
  let selectedstoreaccessorycategories = useSelectedStoreAccessoryCategories((state) => state.selectedstoreaccessorycategories)
  let selectedstorecategories = useSelectedStoreCategories((state) => state.selectedstorecategories)
  let selectedstoreproducts = useSelectedStoreProducts((state) => state.selectedstoreproducts)
 

  let  setSelectedProduct= useSelectedProductStore((state)=>state.setSelectedProduct)
  let setSelected_accessory_product= useSelectedAccessoryProductStore((state)=>state.setSelected_accessory_product)


  const router = useRouter();
  const params = useParams();
  const groupName = params.groupname;

  let geoData = useGeoDataStore((state) => state.geoData);
  const { showLeftNavModal } = useLeftNavStore();

  // CORRECTED: Use the proper store property name
  const selectedGroup = useUserSelectedGroup((state) => state.userselectedgroup);

  const addUniqueUserViewedProduct = useUserViewedProducts(
    (state) => state.addUniqueUserViewedProduct
  );

  const CartItems = useUserCart((state) => state.usercart);
  const addToCart = useUserCart((state) => state.addToCart);
  const removeCartItem = useUserCart((state) => state.removeCartItem);

  const {
    selectednavtab,
    setSelectedNavTab,
    clearSelectedNavTab,
    showmodal,
    setShowModal,
  } = useNavStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeTab, setActiveTab] = useState("items"); // Default to items tab

  // Parse group gallery
  const parseGroupGallery = (galleryString) => {
    try {
      if (!galleryString) return [];
      if (typeof galleryString === 'object') return galleryString;
      return JSON.parse(galleryString);
    } catch (error) {
      console.warn("Failed to parse group gallery:", error);
      return [];
    }
  };

  // Parse group items
  const parseGroupItems = (itemsString) => {
    try {
      if (!itemsString) return [];
      if (typeof itemsString === 'object') return itemsString;
      return JSON.parse(itemsString);
    } catch (error) {
      console.warn("Failed to parse group items:", error);
      return [];
    }
  };

  // store refs for all videos
  const videoRefs = useRef([]);

  const tabs = [
    { key: "items", label: "Collection Items" },
  ];

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
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  const groupGallery = parseGroupGallery(selectedGroup?.group_gallery) || [];
  const groupItems = parseGroupItems(selectedGroup?.group_items) || [];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % groupGallery.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + groupGallery.length) % groupGallery.length);
  };

  const renderMedia = (mediaItem, index) => {
    if (mediaItem.type === "video") {
      return (
        <div
          key={index}
          className="relative w-full h-[55vh] lg:h-[85vh] bg-black"
        >
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
        <div
          key={index}
          className="relative w-full h-[55vh] lg:h-[85vh] bg-white"
        >
          <Image
            src={mediaItem.url}
            alt={`${selectedGroup?.group_name} image ${index + 1}`}
            className="lg:object-contain object-fill"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      );
    }
  };

  // Render group items (products and accessories)
  const renderGroupItems = () => {
    if (groupItems.length === 0) {
      return <p className="text-sm text-gray-700">No items available in this collection.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {groupItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-[3/4] bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="font-light text-sm mb-2">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-2 capitalize">{item.type}</p>
              <button
                onClick={() => {
                  // Handle navigation to product/accessory detail page

                  if (item.product_id) {
                    //console.log(item)

                    let product_category = selectedstorecategories.filter((cat) => cat.category_id === item.category)
                    let product = selectedstoreproducts.filter((prod) => prod.product_id === item.product_id)
                    console.log(selectedstoreproducts)
                    product_category = product_category[0]
                    product=product[0]
                    console.log("CATEGORY")
                    console.log(product_category)
                    console.log("PRODUCT")
                    console.log(product)
                    console.log("ITEM")
                    console.log(item)

                    setSelectedProduct(product)

                    router.push(
                      `/store/${item.product_store === "female" ? "women" : "mens"
                      }/${product_category.category_name?.trim()}/${product.product_name?.trim()}`
                    );
                  }
                  if (item.accessory_id) {
                    
                    console.log("ITEM")
                    console.log(item)
                    console.log("Category List")
                    console.log(selectedstoreaccessorycategories)
                    let accessory_category = selectedstoreaccessorycategories.filter((cat) => cat.accessory_category_id == item.category)
                    accessory_category=accessory_category[0]
                    console.log("SELECTED ACESSORY CATEGORY")
                    console.log(accessory_category)
                    
                    let accessories_product = selectedstoreaccessoryproducts.filter((access_prod)=>access_prod.accessory_id==item.accessory_id)
                    accessories_product=accessories_product[0]
                    console.log("SELECTED ACESSORY PRODUCT")
                    console.log(accessories_product)
                    
                    setSelected_accessory_product(accessories_product)
                    router.push(
                      `/store/${item.accessory_store === "female" ? "women" : "mens"
                      }/accessories/categories/${accessory_category.accessory_category_name.trim()}/${accessories_product.accessory_name.trim()}`
                    );
                  }


                  console.log("Navigate to:", item);
                }}
                className="w-full border border-black text-black py-2 text-xs tracking-wide hover:bg-black hover:text-white transition-colors duration-200"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // CORRECTED: Check for userselectedgroup instead of selectedgroup
  if (!selectedGroup?.group_id) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          {/* <p>No group selected</p> */}
          <CategoryLoader />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar />

      <div className="pt-[61px] flex flex-col lg:py-24 lg:flex-row lg:px-16 xl:px-32 gap-8 lg:gap-16">
        {/* Group Gallery Carousel */}
        <div className="flex-1 flex flex-col items-center lg:sticky lg:top-24 lg:self-start">
          {groupGallery.length > 0 && (
            <>
              {renderMedia(groupGallery[currentIndex], currentIndex)}

              {/* Navigation Arrows - Only show if more than one media item */}
              {groupGallery.length > 1 && (
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
              {groupGallery.length > 1 && (
                <div className="w-full mt-4 px-4 max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide px-2">
                      {groupGallery.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`flex-shrink-0 relative rounded overflow-hidden transition-all duration-200 ${currentIndex === index
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

        {/* GROUP DETAILS */}
        <div className="flex flex-col w-full lg:w-[45%] space-y-8 px-6 lg:px-0 justify-end mb-8 lg:sticky lg:top-24 lg:self-start">
          <div className="max-w-2xl mx-auto w-full">
            {/* Group Header */}
            <div className="border-b border-gray-200 pb-6">
              <h1 className="text-2xl lg:text-3xl font-light tracking-wide text-gray-900">
                {selectedGroup.group_name}
              </h1>
              <p className="text-xs text-gray-500 mt-2 tracking-wide">
                COLLECTION: {groupItems.length} ITEMS
              </p>
            </div>

            {/* Group Items */}
            <div className="mt-10 text-gray-800 border-gray-200 pt-8">
              {/* Tabs for Desktop - Only show if there are multiple tabs */}
              {tabs.length > 1 && (
                <div className="hidden md:flex  border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-3 text-xs tracking-wide border-b-2 transition-all ${activeTab === tab.key
                          ? "border-black font-medium"
                          : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Content for Desktop */}
              <div className="hidden md:block py-6">
                {activeTab === "items" && renderGroupItems()}
              </div>

              {/* Accordion for Mobile */}
              <div className="md:hidden divide-y divide-gray-200">
                {tabs.map((tab) => (
                  <div key={tab.key} className="py-5">
                    <button
                      className="flex justify-between w-full items-center"
                      onClick={() =>
                        setActiveTab(activeTab === tab.key ? "" : tab.key)
                      }
                    >
                      <h3 className="font-light text-sm tracking-wide text-gray-900">
                        {tab.label}
                      </h3>
                      <svg
                        className={`w-4 h-4 text-gray-500 transform transition-transform ${activeTab === tab.key ? "rotate-180" : ""
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
                      <div className="mt-4 text-sm text-gray-700">
                        {tab.key === "items" && renderGroupItems()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showmodal && <ModalMain />}
        {showLeftNavModal && <NavLeftModal />}
      </div>

      <RecentlyViewd />
      <Footer />
    </div>
  );
};

export default GroupsPage;