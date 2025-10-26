// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedStoreAccessoryCategories = create(
  persist(
    (set) => ({
      selectedstoreaccessorycategories: [],
      setSelectedStoreAccessoryCategories: (selectedstoreaccessorycategories) => set({ selectedstoreaccessorycategories }),
      clearSelectedStoreAccessoryCategories: () => set({ selectedstoreaccessorycategories: [] }),
    }),
    {
      name: 'selected-store-accessory-categories-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
