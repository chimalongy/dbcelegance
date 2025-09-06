// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserWishList = create(
  persist(
    (set) => ({
      userwishlist: [], // ✅ always start as empty array

      // ✅ Accept direct array OR functional update
      setWishList: (updater) =>
        set((state) => ({
          userwishlist:
            typeof updater === 'function'
              ? updater(state.userwishlist) // functional update
              : updater, // direct replacement
        })),

      clearWishList: () => set({ userwishlist: [] }),

      // ✅ Convenience method to toggle wishlist items
      toggleWishList: (product) =>
        set((state) => {
          const exists = state.userwishlist.some(
            (item) => item.product_id === product.product_id
          );
          return {
            userwishlist: exists
              ? state.userwishlist.filter((item) => item.product_id !== product.product_id)
              : [...state.userwishlist, product],
          };
        }),
    }),
    {
      name: 'user-wishlist-storage', // localStorage key
      getStorage: () => localStorage,
    }
  )
);
