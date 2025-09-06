// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserViewedProducts = create(
  persist(
    (set) => ({
      userviewedproducts: [],
      setUserViewedproducts: (userviewedproducts) => set({ userviewedproducts }),
      clearUserViewedProducts: () => set({ userviewedproducts: [] }),
    }),
    {
      name: 'user-viewed-store-products-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
