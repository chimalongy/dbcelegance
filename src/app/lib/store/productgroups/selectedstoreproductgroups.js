// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useSelectedStorProductsGroups = create(
  persist(
    (set) => ({
      selectedstoreproductgroups: null,
      setSelectedStoreProductGroups: (selectedstoreproductgroups) => set({ selectedstoreproductgroups }),
      clearSelectedProductGroups: () => set({ selectedstoreproductgroups: null }),
    }),
    {
      name: 'selected-store-product-groups-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
