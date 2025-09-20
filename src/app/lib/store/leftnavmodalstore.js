// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLeftNavStore = create(
  persist(
    (set) => ({
      selectedleftnavtab: null,
      showLeftNavModal:false,
      setShowLeftNavModal:(val)=>set({ showLeftNavModal:val}),
      setSelectedLeftNavTab: (tab) => set({ selectedleftnavtab: tab }),
      //clearSelectedNavTab: () => set({ selectednavtab: null }),
    }),
    {
      name: 'LeftNavStore', // Key in localStorage
      getStorage: () => localStorage,
    }
  )
);
