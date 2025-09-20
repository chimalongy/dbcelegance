// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGeoDataStore = create(
  persist(
    (set) => ({
      geoData: null,
      setGeoData: (geoData) => set({ geoData }),
      clearGeoDataStore: () => set({ geoData: null }),
    }),
    {
      name: 'geo-data-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
