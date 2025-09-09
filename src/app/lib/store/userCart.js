// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserCart = create(
  persist(
    (set) => ({
      usercart: [], // ✅ cart always starts as an empty array

      // ✅ Add a product to the cart (no duplicates)
      addToCart: (product) =>
        set((state) => {
          const exists = state.usercart.some(
            (item) => item.product_id === product.product_id
          );
          if (exists) {
            return state; // no change if product already exists
          }
          return { usercart: [...state.usercart, product] };
        }),

      // ✅ Remove a product from the cart by product_id
      removeCartItem: (product) =>
        set((state) => ({
          usercart: state.usercart.filter(
            (item) => item.product_id !== product.product_id
          ),
        })),

      // ✅ Clear all items from cart
      clearCart: () => set({ usercart: [] }),
    }),
    {
      name: 'user-cart-storage', // localStorage key
      getStorage: () => localStorage,
    }
  )
);
