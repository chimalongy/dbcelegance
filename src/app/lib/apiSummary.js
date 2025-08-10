export const apiSummary = {
  admin: {
    login: "/api/admin/login",
    change_password: "/api/admin/change-password",
    users: {
      add_new_user: "/api/admin/users/create",
      delete_user: "/api/admin/users/delete-user",
      get_all_users: "/api/admin/users/get-all-users",
      update_user_data: "/api/admin/users/update-user-data",
    },
    stores: {
      categories: {
        add_category:"/api/admin/stores/categories/add",
        get_all_categories:"/api/admin/stores/categories/get-all-categories",
        update_category:"/api/admin/stores/categories/update",
        delete_category:"/api/admin/stores/categories/delete",
      },
      products:{
         add_product:"/api/admin/stores/products/add",
        get_all_products:"/api/admin/stores/products/get-all-products",
        update_product:"/api/admin/stores/products/update",
        delete_product:"/api/admin/stores/products/delete",
        // Variant endpoints
        add_variant:"/api/admin/stores/products/variants/add",
        update_variant:"/api/admin/stores/products/variants/update",
        delete_variant:"/api/admin/stores/products/variants/delete",
        get_variants:"/api/admin/stores/products/variants/get",
      },
      accessories: {
        // Accessory Category endpoints
        add_category:"/api/admin/stores/accessories/categories/add",
        get_all_categories:"/api/admin/stores/accessories/categories/get-all-categories",
        update_category:"/api/admin/stores/accessories/categories/update",
        delete_category:"/api/admin/stores/accessories/categories/delete",
        // Accessory Product endpoints
        add_product:"/api/admin/stores/accessories/products/add",
        get_all_products:"/api/admin/stores/accessories/products/get-all-products",
        update_product:"/api/admin/stores/accessories/products/update",
        delete_product:"/api/admin/stores/accessories/products/delete",
      }
    },
  },
};
 