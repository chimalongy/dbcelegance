// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminUserStore = create(
  persist(
    (set) => ({
      adminuser: null,
      setAdminUser: (adminuser) => set({ adminuser }),
      clearAdminUser: () => set({ adminuser: null }),
    }),
    {
      name: 'admin-user-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
