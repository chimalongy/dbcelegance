// store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserCart = create(
  persist(
    (set) => ({
      usercart: [], // ✅ cart always starts as an empty array

      // ✅ Add a product to the cart
      addToCart: (product) =>
        set((state) => {
          const exists = state.usercart.some((item) =>
            item.product_id === product.product_id &&
            item.selected_sizes?.some(
              (s) => s.selected_size === product.selected_sizes?.[0]?.selected_size
            )
          );

          if (exists) {
            return state; // no change if same product + same size exists
          }

          return { usercart: [...state.usercart, product] };
        }),

      // ✅ Remove a product from the cart by product_id + size
      removeCartItem: (product) =>
        set((state) => ({
          usercart: state.usercart.filter(
            (item) =>
              !(
                item.product_id === product.product_id &&
                item.selected_sizes?.[0]?.selected_size === product.selected_sizes?.[0]?.selected_size
              )
          ),
        })),

      // ✅ Update product's size or quantity
      updateCartItem: (productId, selectedSize, update) =>
        set((state) => ({
          usercart: state.usercart.map((item) =>
            item.product_id === productId &&
            item.selected_sizes?.[0]?.selected_size === selectedSize
              ? {
                  ...item,
                  selected_sizes: [
                    {
                      selected_size: update.selected_size,
                      quantity: update.quantity,
                    },
                  ],
                }
              : item
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
