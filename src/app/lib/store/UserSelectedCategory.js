// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserSelectedCategory = create(
  persist(
    (set) => ({
      userselectedstorecategory: null,
      setUserSelectedStoreCategory: (userselectedstorecategory) => set({ userselectedstorecategory }),
      clearUserSelectedStoreCategory: () => set({ userselectedstorecategory: null }),
    }),
    {
      name: 'user-selected-store-category-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
