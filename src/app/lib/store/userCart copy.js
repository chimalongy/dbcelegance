// store/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserCart = create(
  persist(
    (set) => ({
      usercart: [], // ✅ cart always starts as an empty array

      // ✅ Add a product to the cart (no duplicates)
      addToCart: (product) =>
        set((state) => {
          console.log(product);
          const exists = state.usercart.some(
            (item) =>
              item.product_id === product.product_id &&
              item.selected_size.user_selected_size ===
                product.selected_size.user_selected_size
          );
          if (exists) {
            return state; // no change if product already exists
          }
          return { usercart: [...state.usercart, product] };
        }),

      removeCartItem: (product) =>
        set((state) => {
          console.log("Removing product:", product);

          return {
            usercart: state.usercart.filter(
              (item) =>
                JSON.stringify(item) !== JSON.stringify(product)
               
            ),
          };
        }),

      // ✅ Update product's size or quantity
      updateCartItem: (productId, update) =>
        set((state) => ({
          usercart: state.usercart.map((item) =>
            item.product_id === productId
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
      name: "user-cart-storage", // localStorage key
      getStorage: () => localStorage,
    }
  )
);
