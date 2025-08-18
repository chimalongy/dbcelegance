// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedStoreProducts = create(
  persist(
    (set) => ({
      selectedstoreproducts: null,
      setSelectedStoreProducts: (selectedstoreproducts) => set({ selectedstoreproducts }),
      clearSelectedStoreProducts: () => set({ selectedstoreproducts: null }),
    }),
    {
      name: 'selected-store-products-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
