import React from "react";
import { useUserViewedProducts } from "../lib/store/UserViewedProducts";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { useSelectedAccessoryProductStore } from "../lib/store/selected_accessory_productstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useSelectedStoreAccessoryCategories } from "../lib/store/selectedstoreaccessorycategoriesstore";
import { useRouter } from "next/navigation";

export default function RecentlyViewd() {
  const { userviewedproducts } = useUserViewedProducts();
  const router = useRouter();

  const setSelectedProduct = useSelectedProductStore(
    (state) => state.setSelectedProduct
  );
  const setSelectedAccessoryProduct = useSelectedAccessoryProductStore(
    (state) => state.setSelected_accessory_product
  );

  const selectedCategories = useSelectedStoreCategories(
    (state) => state.selectedstorecategories
  );
  const selectedAccessoryCategories = useSelectedStoreAccessoryCategories(
    (state) => state.selectedstoreaccessorycategories
  );

  const viewedItems = userviewedproducts.filter((item) => item !== null);

  return (
    <div className="p-4 lg:px-[100px]">
      {viewedItems.length > 0 && (
        <h2 className="text-2xl font-light mb-2 text-center pb-12">
          Recently Viewed
        </h2>
      )}

      {viewedItems.length === 0 ? (
        <p className="text-gray-500 text-center">No items viewed yet.</p>
      ) : (
        <div className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide">
          {viewedItems.map((item, index) => {
            const isProduct = !!item.product_id;
            const isAccessory = !!item.accessory_id;

            const image = isProduct
              ? item.product_gallery?.[0]?.url
              : item.accessory_gallery?.[0]?.url;

            const name = isProduct
              ? item.product_name
              : item.accessory_name || "Unnamed";

            // Match category correctly
            const category = isProduct
              ? selectedCategories.find(
                  (cat) =>
                    String(cat.category_id) ===
                    String(item.product_category)
                )
              : selectedAccessoryCategories.find(
                  (ass_cat) =>
                    String(ass_cat.accessory_category_id) ===
                    String(item.accessory_category)
                );

            return (
              <div
                key={item.product_id || item.accessory_id || index}
                className="flex-shrink-0 w-[350px] h-[400px] cursor-pointer shadow-sm flex items-center justify-center bg-white rounded-lg overflow-hidden"
                onClick={() => {
                  if (isProduct) {
                    setSelectedProduct(item);

                    if (category) {
                      router.push(
                        `/store/${
                          item.product_store === "female" ? "women" : "mens"
                        }/${category.category_name.trim()}/${item.product_name.trim()}`
                      );
                    } else {
                      console.warn("No category found for product:", item);
                    }
                  } else if (isAccessory) {
                    setSelectedAccessoryProduct(item);

                    if (category) {
                      router.push(
                        `/store/${
                          item.accessory_store === "female" ? "women" : "mens"
                        }/accessories/categories/${category.accessory_category_name.trim()}/${item.accessory_name.trim()}`
                      );
                    } else {
                      console.warn("No accessory category found for item:", item);
                    }
                  }
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
