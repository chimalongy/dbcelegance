// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNavStore = create(
  persist(
    (set) => ({
      selectednavtab: null,
      showmodal:false,
      setShowModal:(val)=>set({ showmodal:val}),
      setSelectedNavTab: (tab) => set({ selectednavtab: tab }),
      clearSelectedNavTab: () => set({ selectednavtab: null }),
    }),
    {
      name: 'selectednavtab', // Key in localStorage
      getStorage: () => localStorage,
    }
  )
);
