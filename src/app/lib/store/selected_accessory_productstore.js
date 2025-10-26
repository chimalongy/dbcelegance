// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedAccessoryProductStore = create(
  persist(
    (set) => ({
      selected_accessory_product: null,
      setSelected_accessory_product: (selected_accessory_product) => set({ selected_accessory_product}),
      clearSelected_accessory_product: () => set({ selected_accessory_product: null }),
    }),
    {
      name: 'selected_accessory_product_storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
