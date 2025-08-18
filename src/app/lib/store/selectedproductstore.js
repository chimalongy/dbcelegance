// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSelectedProductStore = create(
  persist(
    (set) => ({
      selectedproduct: null,
      setSelectedProduct: (selectedproduct) => set({ selectedproduct }),
      clearSelectedProduct: () => set({ selectedproduct: null }),
    }),
    {
      name: 'selected-product-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
