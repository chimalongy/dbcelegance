// store/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserViewedProducts = create(
  persist(
    (set, get) => ({
      userviewedproducts: [],

      // Replace entire array
      setUserViewedproducts: (userviewedproducts) => set({ userviewedproducts }),

      // Add any item (product or accessory)
      addUserViewedProduct: (item) =>
        set((state) => ({
          userviewedproducts: [...state.userviewedproducts, item],
        })),

      // Add unique item (detects product_id or accessory_id)
      addUniqueUserViewedProduct: (item) =>
        set((state) => {
          const key =
            item.product_id !== undefined
              ? "product_id"
              : item.accessory_id !== undefined
              ? "accessory_id"
              : null;

          if (!key) return state; // Ignore unknown structure

          const exists = state.userviewedproducts.some(
            (p) => p[key] === item[key]
          );

          return exists
            ? state
            : { userviewedproducts: [...state.userviewedproducts, item] };
        }),

      // Clear array
      clearUserViewedProducts: () => set({ userviewedproducts: [] }),
    }),
    {
      name: "user-viewed-store-products-storage",
      getStorage: () => localStorage,
    }
  )
);
