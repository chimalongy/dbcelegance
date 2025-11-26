"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSelectedStorProductsGroups } from "../lib/store/productgroups/selectedstoreproductgroups";
import { useSelectedProductStore } from "../lib/store/selectedproductstore";
import { useSelectedAccessoryProductStore } from "../lib/store/selected_accessory_productstore";
import { useSelectedStoreCategories } from "@/app/lib/store/selectedstorecategoriesstore";
import { useSelectedStoreAccessoryCategories } from "../lib/store/selectedstoreaccessorycategoriesstore";


import { useUserSelectedGroup } from "../lib/store/productgroups/userselectedgroup";

export default function CompleteSilHoutte({ item }) {
  const router = useRouter();

  const { selectedstoreproductgroups } = useSelectedStorProductsGroups();
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


  const setUserSelectedGroup= useUserSelectedGroup((state)=>state.setUserSelectedGroup)



  const [itemGroups, setItemGroups] = useState([]);

  useEffect(() => {
    console.log("LOG FROM COMPLETE SILHOUTTE");
    console.log("Received item:", item);

    if (!selectedstoreproductgroups?.length) return;

    let matchedGroups = [];

    // Match based on product_id or accessory_id
    if (item.product_id) {
      matchedGroups = selectedstoreproductgroups.filter((group) => {
        try {
          const groupItems = JSON.parse(group.group_items);
          return groupItems.some(
            (groupItem) => groupItem.product_id === item.product_id
          );
        } catch (err) {
          console.error("Error parsing group_items:", err);
          return false;
        }
      });
    } else if (item.accessory_id) {
      matchedGroups = selectedstoreproductgroups.filter((group) => {
        try {
          const groupItems = JSON.parse(group.group_items);
          return groupItems.some(
            (groupItem) => groupItem.accessory_id === item.accessory_id
          );
        } catch (err) {
          console.error("Error parsing group_items:", err);
          return false;
        }
      });
    }

    console.log("Matched groups:", matchedGroups);
    setItemGroups(matchedGroups);
  }, [item, selectedstoreproductgroups]);

  if (itemGroups.length==0) {
    return <div></div>;
  }
  

  return (
    <div className="p-4 lg:px-[100px]">
      <h2 className="text-2xl font-light mb-6 text-center">
        To Complete Silhouette
      </h2>

      {itemGroups.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {itemGroups.map((group) => {
            const groupItems = JSON.parse(group.group_items);
            // Filter out the current product itself

            const otherItems = groupItems.filter(
              (gItem) =>
                gItem.product_id !== item.product_id &&
                gItem.accessory_id !== item.accessory_id
            );

            return (
              <div key={group.group_id} className="col-span-full">
                {/* <h3 className="text-lg font-semibold mb-3">
                  {group.group_name}
                </h3> */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {otherItems.map((gItem) => (
                  
                    <div
                      key={gItem.id}
                      className="cursor-pointer  shadow hover:shadow-md transition"
                      onClick={() => {
                        if (gItem.type === "product") {
                          //setSelectedProduct(gItem);
                          router.push(`/couture/groups/${group.group_name}`);
                        } else if (gItem.type === "accessory") {
                          //setSelectedAccessoryProduct(gItem);
                         router.push(`/couture/groups/${group.group_name}`);
                        }

                        setUserSelectedGroup(group)
                        console.log(JSON.parse(group.group_gallery)[0].url)
                      }}
                    >
                      <img
                        src={JSON.parse(group.group_gallery)[0].url}
                        alt={gItem.name}
                        className="w-full h-[550px] object-cover mb-2"
                      />
                      {/* <h4 className="text-sm font-medium text-center">
                        {gItem.name}
                      </h4>
                      {gItem.price && (
                        <p className="text-center text-gray-500 text-sm">
                          ${gItem.price}
                        </p>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No complementary items found.</p>
      )}
    </div>
  );
}
