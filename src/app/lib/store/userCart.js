// store/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserCart = create(
  persist(
    (set) => ({
      usercart: [], // ✅ cart always starts empty

      // ✅ Add a product or accessory (no duplicates)
      addToCart: (item) =>
        set((state) => {
          const isAccessory = !!item.accessory_id;
          const idKey = isAccessory ? "accessory_id" : "product_id";

          const exists = state.usercart.some(
            (cartItem) =>
              cartItem[idKey] === item[idKey] &&
              cartItem.selected_size?.user_selected_size ===
                item.selected_size?.user_selected_size
          );

          if (exists) {
            return state; // Don't add duplicates
          }

          return { usercart: [...state.usercart, item] };
        }),

      // ✅ Remove a product or accessory
      removeCartItem: (itemToRemove) =>
        set((state) => {
          const isAccessory = !!itemToRemove.accessory_id;
          const idKey = isAccessory ? "accessory_id" : "product_id";

          console.log("Removing item:", itemToRemove);

          return {
            usercart: state.usercart.filter(
              (cartItem) =>
                !(
                  cartItem[idKey] === itemToRemove[idKey] &&
                  cartItem.selected_size?.user_selected_size ===
                    itemToRemove.selected_size?.user_selected_size
                )
            ),
          };
        }),

      // ✅ Update quantity for both product and accessory
      updateCartItem: (itemId, userSelectedSize, update, isAccessory = false) =>
        set((state) => {
          const idKey = isAccessory ? "accessory_id" : "product_id";

          return {
            usercart: state.usercart.map((cartItem) => {
              const matches =
                cartItem[idKey] === itemId &&
                cartItem.selected_size?.user_selected_size === userSelectedSize;

              if (!matches) return cartItem;

              return {
                ...cartItem,
                selected_size: {
                  ...cartItem.selected_size,
                  quantity: update.quantity,
                },
              };
            }),
          };
        }),

      // ✅ Clear the entire cart
      clearCart: () => set({ usercart: [] }),
    }),
    {
      name: "user-cart-storage",
      getStorage: () => localStorage,
    }
  )
);
