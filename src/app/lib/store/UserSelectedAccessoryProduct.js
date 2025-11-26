// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserSelectedAccessoryProduct = create(
  persist(
    (set) => ({
      userselectedstoreaccessoryproduct: null,
      setUserSelectedStoreAccessoryProduct: (userselectedstoreaccessoryproduct) => set({ userselectedstoreaccessoryproduct }),
      clearUserSelectedStoreAccessoryProduct: () => set({ userselectedstoreaccessoryproduct: null }),
    }),
    {
      name: 'user-selected-store-accessory-product-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
 