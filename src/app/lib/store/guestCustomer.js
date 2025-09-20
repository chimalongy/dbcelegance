// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGuestCustomerStore = create(
  persist(
    (set) => ({
      guestCustomer: "",
      setGuestCustomer: (guestCustomer) => set({ guestCustomer }),
      clearGuestCustomer: () => set({ guestCustomer: null }),
    }),
    {
      name: 'guest-customer-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
