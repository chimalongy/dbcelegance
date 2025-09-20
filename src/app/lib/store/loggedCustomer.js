// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoggedCustomerStore = create(
  persist(
    (set) => ({
      loggedCustomer: null,
      setLoggedCustomer: (loggedCustomer) => set({ loggedCustomer }),
      clearloggedCustomer: () => set({ loggedCustomer: null }),
    }),
    {
      name: 'logged-customer-storage', // Key in localStorage
      getStorage: () => localStorage, // Use sessionStorage if preferred
    }
  )
);
