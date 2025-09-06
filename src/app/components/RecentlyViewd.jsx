import React from "react";
import { useUserViewedProducts } from "../lib/store/UserViewedProducts";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useRouter } from "next/navigation";

export default function RecentlyViewd() {
  const { userviewedproducts } = useUserViewedProducts();
  const router = useRouter();
  const setSelectedProduct = useSelectedProductStore(
    (state) => state.setSelectedProduct
  );
  const selectedCategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );

  return (
    <div className="p-4 lg:px-[100px]">
      {userviewedproducts.filter((product) => product !== null).length > 0 && (
        <h2 className="text-2xl font-light mb-2 text-center pb-12">
          Recently Viewed
        </h2>
      )}

      {userviewedproducts.filter((product) => product !== null).length === 0 ? (
        <p className="text-gray-500">No products viewed yet.</p>
      ) : (
        <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide">
          {userviewedproducts.map((product, index) =>
            product ? (
              <div
                key={product.product_id || index}
                className="flex-shrink-0 w-[350px] h-[400px] cursor-pointer shadow-sm flex items-center justify-center bg-white"
                onClick={() => {
                  const selected_category = selectedCategories.find(
                    (category) =>
                      String(category.category_id) ===
                      String(product.product_category)
                  );
                  console.log(selected_category);
                  if (selected_category) {
                    setSelectedProduct(product);
                    router.push(
                      `/store/${product.product_store === "female" ? "women" : "mens"
                      }/${selected_category.category_name.trim()}/${product.product_name.trim()}`
                    );
                  } else {
                    console.warn("No category found for item:", product);
                  }
                }}
              >
                <img
                  src={product.product_gallery[0].url}
                  alt={`${product.product_name} image ${index + 1}`}
                  className="object-fill w-full h-full "
                />
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
