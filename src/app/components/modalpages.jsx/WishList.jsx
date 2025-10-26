"use client";
import { useState } from "react";
import Link from "next/link";
import { useUserWishList } from "@/app/lib/store/UserWishList";
import { FaTrashAlt, FaEye, FaEyeSlash, FaArrowRight, FaGoogle, FaFacebook } from "react-icons/fa";
import { useSelectedProductStore } from "@/app/lib/store/selectedproductstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { usePathname, useRouter } from "next/navigation";

const Wishlist = ({ setShowModal }) => {
    const wishlistItems = useUserWishList((state) => state.userwishlist) || [];
    const toggleWishList = useUserWishList((state) => state.toggleWishList);
    const setSelectedProduct = useSelectedProductStore((state) => state.setSelectedProduct)
    const selectedCategories = useSelectedStoreCategories((state) => state.selectedstorecategories)

    const pathname = usePathname();
    let gender = pathname == "/store/womensfashion" ? "women" : "men"
    const router = useRouter()
    
    // Login state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
    
    const isFormValid = email && password;

    const handleLogin = (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please enter both email and password.");
            return;
        }
        // Perform login (simulate or call backend)
        console.log("Logging in:", { email, password });
    };

    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
        // Integrate OAuth logic here
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto bg-white overflow-hidden">
                {/* Header Section */}
                <div className="p-8 lg:p-12 border-b border-gray-200 text-center flex flex-col gap-3">
                    <h1 className="text-2xl font-light tracking-wide">YOUR WISHLIST</h1>
                    <p className="text-gray-600 text-sm">Create a wishlist, access it any time from any device.</p>
                    
               
                </div>

                {/* Wishlist Items */}
                <div className="px-8 py-8 lg:px-12">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                        <h2 className="text-lg font-light text-gray-900 tracking-wide">YOUR SELECTED ITEMS</h2>
                        <span className="text-sm text-gray-600">
                            {wishlistItems.length} {wishlistItems.length === 1 ? "ITEM" : "ITEMS"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-6 mt-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex items-center border-b border-gray-200 pb-6"
                            >
                                <div className="lg:w-40 w-24 h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={item?.product_gallery?.[0]?.url || "/no-image.png"}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="font-light text-gray-900 tracking-wide">
                                        {item.product_name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        $ {item.sizes[0].price}
                                    </p>
                                    <div className="mt-4 flex space-x-6 items-center">
                                        <button
                                            onClick={() => {
                                                const selected_category = selectedCategories.find(
                                                    (category) => String(category.category_id) === String(item.product_category)
                                                );
                                                if (selected_category) {
                                                    setSelectedProduct(item)
                                                    router.push(
                                                        `/store/${item.product_store === "female" ? "women" : "mens"}/${selected_category.category_name.trim()}/${item.product_name.trim()}`
                                                    );
                                                    setShowModal(false)
                                                } else {
                                                    console.warn("No category found for item:", item);
                                                }
                                            }}
                                            className="text-sm font-medium border-b border-transparent hover:border-black transition-all"
                                        >
                                            VIEW PRODUCT
                                        </button>
                                        <button
                                            onClick={() => toggleWishList(item)}
                                            className="text-gray-500 hover:text-black transition-colors"
                                            aria-label="Remove from wishlist"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {wishlistItems.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-sm">YOUR WISHLIST IS EMPTY</p>
                            <Link
                                href="/store"
                                className="mt-4 inline-block text-sm text-gray-600 hover:text-black border-b border-transparent hover:border-black transition-all"
                            >
                                CONTINUE SHOPPING
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;