// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const UserSelectedProducts = create(
  persist(
    (set) => ({
      userselectedproducts: null,
      setUserSelectedproducts: (userselectedproducts) => set({ userselectedproducts }),
      clearUserSelectedProducts: () => set({ userselectedproducts: null }),
    }),
    {
      name: 'user-selected-store-products-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
