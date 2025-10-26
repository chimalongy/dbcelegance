// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserSelectedAccessoryCategory = create(
  persist(
    (set) => ({
      userselectedstoreaccessorycategory: null,
      setUserSelectedStoreAccessoryCategory: (userselectedstoreaccessorycategory) => set({ userselectedstoreaccessorycategory }),
      clearUserSelectedStoreAccessoryCategory: () => set({ userselectedstoreaccessorycategory: null }),
    }),
    {
      name: 'user-selected-store-accessory-category-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
