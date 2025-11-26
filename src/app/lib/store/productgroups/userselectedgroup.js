// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserSelectedGroup = create(
  persist(
    (set) => ({
      userselectedgroup: null,
      setUserSelectedGroup: (userselectedgroup) => set({ userselectedgroup }),
      clearUserSelectedGroup: () => set({ userselectedgroup: null }),
    }),
    {
      name: 'user-selected-group-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
