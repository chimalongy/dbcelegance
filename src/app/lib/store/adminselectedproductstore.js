// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminSelectedProductStore = create(
  persist(
    (set) => ({
      adminselectedproduct: null,
      setadminselectedproduct: (adminselectedproduct) => set({ adminselectedproduct }),
      clearadminselectedproduct: () => set({ adminselectedproduct: null }),
    }),
    {
      name: 'admin-selected-product-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
