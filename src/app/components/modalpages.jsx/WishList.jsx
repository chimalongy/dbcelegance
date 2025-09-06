"use client";
import Link from "next/link";
import { useUserWishList } from "@/app/lib/store/UserWishList";
import { FaTrashAlt } from "react-icons/fa";
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


    return (
        <div className="min-h-screen">
            <div className="mx-auto bg-white overflow-hidden">
                {/* Header Section */}
                <div className="p-8 lg:p-12 bg-white border-b border-gray-200 text-center flex flex-col gap-3">
                         
                         <p className="text-xl">Log in to save your wishlist</p>
                         <p className="text-gray-500">Create a wishlist, access it any time from any device.</p>
                         <p className="">Login or create an account</p>


                </div>

                {/* Wishlist Items */}
                <div className="">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-xl font-light text-gray-900">Your Wishlist</h1>
                        <h2 className="text-lg font-light text-gray-700">
                            {wishlistItems.length}{" "}
                            {wishlistItems.length === 1 ? "item" : "items"}
                        </h2>
                    </div>

                    <div className="flex flex-col lg:gap-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="flex items-center border-gray-200 border "
                            >
                                <img
                                    src={item?.product_gallery?.[0]?.url || "/no-image.png"}
                                    alt={item.product_name}
                                    className="lg:w-[200px]  w-20 h-full object-fill"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="font-medium text-gray-700">
                                        {item.product_name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        $ {item.sizes[0].price}
                                    </p>
                                    <div className="mt-2 flex space-x-4 items-center">
                                        <p
                                            onClick={() => {
                                                // console.log(item)

                                                // console.log(selectedCategories)
                                                const selected_category = selectedCategories.find(
                                                    (category) => String(category.category_id) === String(item.product_category)
                                                );
                                                console.log(selected_category)
                                                if (selected_category) {
                                                    setSelectedProduct(item)
                                                    router.push(
                                                        `/store/${item.product_store === "female" ? "women" : "mens"}/${selected_category.category_name.trim()}/${item.product_name.trim()}`
                                                    );
                                                    setShowModal(false)
                                                } else {
                                                    console.warn("No category found for item:", item);
                                                }



                                                // console.log(selected_category)

                                                router.push(`/store/${item.product_store == "female" ? "women" : "mens"}/${selected_category.category_name.trim()}/${item.product_name.trim()}`)
                                            }}
                                            className="text-sm font-medium"
                                        >
                                            Choose
                                        </p>
                                        <button
                                            onClick={() => toggleWishList(item)}
                                            className="text-gray-600 hover:text-gray-800"
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
                        <div className="text-center py-8">
                            <p className="text-gray-500">Your wishlist is empty</p>
                            <Link
                                href="/store"
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;