// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedStoreCategories = create(
  persist(
    (set) => ({
      selectedstorecategories: [],
      setSelectedStoreCategories: (selectedstorecategories) => set({ selectedstorecategories }),
      clearSelectedStoreCategories: () => set({ selectedstorecategories: [] }),
    }),
    {
      name: 'selected-store-categories-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
