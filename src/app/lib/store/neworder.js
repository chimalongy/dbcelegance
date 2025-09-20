// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNewOrderStorage = create(
  persist(
    (set) => ({
      newOrder: null,
      setNewOrder: (newOrder) => set({ newOrder }),
      clearNewOrder: () => set({ newOrder: null }),
    }),
    {
      name: 'user-new-order-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
