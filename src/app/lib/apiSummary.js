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
    audit: {
      get_logs: "/api/admin/Audits/get_audit",
      create_log: "/api/admin/Audits/add",
      get_stats: "/api/admin/Audits/get_audit",
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
        delete_product_gallery_item:"/api/admin/stores/products/delete-gallery-item",
        add_product_gallery_item:"/api/admin/stores/products/add-gallery-item"
        
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
  store:{
    get_store_categories:"/api/store/get_store_categories",
    get_store_products:"/api/store/get_store_products",
    

    auth:{
      register:"/api/store/auth/register",
      login:"",
      sendOtp:"/api/store/auth/sendOTP"
        }

  }
};
 