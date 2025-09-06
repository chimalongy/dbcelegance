// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserViewedProducts = create(
  persist(
    (set, get) => ({
      userviewedproducts: [],

      // Replace entire array
      setUserViewedproducts: (userviewedproducts) => set({ userviewedproducts }),

      // Push a single product into the array
      addUserViewedProduct: (product) =>
        set((state) => ({
          userviewedproducts: [...state.userviewedproducts, product],
        })),

      // Optionally prevent duplicates
      addUniqueUserViewedProduct: (product) =>
        set((state) => {
          const exists = state.userviewedproducts.some(
            (p) => p?.product_id === product.product_id // adjust key if needed
          );
          return exists
            ? state
            : { userviewedproducts: [...state.userviewedproducts, product] };
        }),

      // Clear array
      clearUserViewedProducts: () => set({ userviewedproducts: [] }),
    }),
    {
      name: 'user-viewed-store-products-storage',
      getStorage: () => localStorage,
    }
  )
);
