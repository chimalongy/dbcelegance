// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useSelectedStoreAccessoryProducts = create(
  persist(
    (set) => ({
      selectedstoreaccessoryproducts: null,
      setSelectedStoreAccessoryProducts: (selectedstoreaccessoryproducts) => set({ selectedstoreaccessoryproducts }),
      clearSelectedStoreAccessoryProducts: () => set({ selectedstoreaccessoryproducts: null }),
    }),
    {
      name: 'selected-store-accessory-products-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
