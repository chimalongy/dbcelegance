import bcrypt from 'bcrypt';
import pool from './DBConnect';

class DBFunctions {
 
  async findAdminUser(email) {
    try {
      const result = await pool.query(
        `SELECT * FROM ${process.env.DATABASE_ADMIN_USERS_TABLE} WHERE email = $1`,
        [email]
      );

      if (result.rows.length > 0) {
        return {
          success: true,
          exists: true,
          data: result.rows[0]
        };
      }

      return {
        success: true,
        exists: false,
        data: null
      };
    } catch (error) {
      console.error('Error finding admin user:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  async registerAdminUser(userData) {
    const { first_name, last_name, email, password, role ,  status, accessiblePages } = userData;

    try {
      const userExists = await this.findAdminUser(email);
      if (!userExists.success) {
        return {
          success: false,
          error: 'Failed to check user existence'
        };
      }

      if (userExists.exists) {
        return {
          success: false,
          error: 'User already exists',
          data: userExists.data
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await pool.query(
        `INSERT INTO admin_users 
         (first_name, last_name, email, password, role, status,accessiblepages) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id, first_name, last_name, email, role, status, accessiblepages,created_at`,
        [first_name, last_name, email, hashedPassword, role, status, accessiblePages]
      );

      return {
        success: true,
        data: result.rows[0]
      };

    } catch (error) {
      console.error('Error registering admin user:', error);
      return {
        success: false,
        error: 'Failed to register user'
      };
    }
  }

  async updateUserData(userId, updateData) {
    try {
      const { first_name, last_name, email, role, status, accessiblepages } = updateData;

      const result = await pool.query(
        `UPDATE admin_users 
         SET first_name = $1, last_name = $2, email = $3, role = $4, status = $5, accessiblepages= $6
         WHERE id = $7
         RETURNING id, first_name, last_name, email, role, status,accessiblepages, created_at`,
        [first_name, last_name, email, role, status,accessiblepages, userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  async updateUserPassword(email, currentPassword, newPassword) {
    try {
      console.log(`
        NEW PASSWORD: ${newPassword}
        CURRENT PASSWORD: ${currentPassword}
        EMAIL: ${email}
        `)
    

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      await pool.query(
        'UPDATE admin_users SET password = $1 WHERE email = $2',
        [newHashedPassword, email]
      );

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }

  async deleteUser(userId) {
    try {
      const result = await pool.query(
        'DELETE FROM admin_users WHERE id = $1 RETURNING id, email',
        [userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  async getAllUsers() {
    try {
      const result = await pool.query(
        `SELECT * FROM ${process.env.DATABASE_ADMIN_USERS_TABLE}`
      );

      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: 'Failed to get users: ' + error };
    }
  }

  async updateAdminUserLoginInfo(userId, loginData) {
    try {
      const { last_login_ip, last_login_location } = loginData;

      const result = await pool.query(
        `UPDATE ${process.env.DATABASE_ADMIN_USERS_TABLE} 
         SET last_login = CURRENT_TIMESTAMP,
             last_login_ip = $1,
             last_login_location = $2
         WHERE id = $3
         RETURNING id, last_login, last_login_ip, last_login_location`,
        [last_login_ip, last_login_location, userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Error updating admin user login info:', error);
      return { success: false, error: 'Failed to update login info' };
    }
  }

  async createAuditLog(auditData) {
    try {
      const {
        user_id,
        user_email,
        action_type,
        action_category,
        resource_type,
        resource_id,
        resource_name,
        old_values,
        new_values,
        ip_address,
        user_agent,
        location,
        session_id,
        status = 'success',
        error_message,
        metadata
      } = auditData;

      const result = await pool.query(
        `INSERT INTO ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'} 
         (user_id, user_email, action_type, action_category, resource_type, resource_id, 
          resource_name, old_values, new_values, ip_address, user_agent, location, 
          session_id, status, error_message, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING audit_id`,
        [user_id, user_email, action_type, action_category, resource_type, resource_id,
         resource_name, old_values, new_values, ip_address, user_agent, location,
         session_id, status, error_message, metadata]
      );

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error creating audit log:', error);
      return {
        success: false,
        error: 'Failed to create audit log'
      };
    }
  }

  async getAuditLogs(filters = {}) {
    try {
      let query = `
        SELECT al.*, au.first_name, au.last_name, au.role
        FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'} al
        LEFT JOIN ${process.env.DATABASE_ADMIN_USERS_TABLE} au ON al.user_id = au.id
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;

      // Apply filters
      if (filters.user_email) {
        paramCount++;
        query += ` AND al.user_email ILIKE $${paramCount}`;
        params.push(`%${filters.user_email}%`);
      }

      if (filters.action_type) {
        paramCount++;
        query += ` AND al.action_type = $${paramCount}`;
        params.push(filters.action_type);
      }

      if (filters.action_category) {
        paramCount++;
        query += ` AND al.action_category = $${paramCount}`;
        params.push(filters.action_category);
      }

      if (filters.resource_type) {
        paramCount++;
        query += ` AND al.resource_type = $${paramCount}`;
        params.push(filters.resource_type);
      }

      if (filters.status) {
        paramCount++;
        query += ` AND al.status = $${paramCount}`;
        params.push(filters.status);
      }

      if (filters.start_date) {
        paramCount++;
        query += ` AND al.created_at >= $${paramCount}`;
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        paramCount++;
        query += ` AND al.created_at <= $${paramCount}`;
        params.push(filters.end_date);
      }

      // Add sorting
      query += ` ORDER BY al.created_at DESC`;

      // Add pagination
      if (filters.limit) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
      }

      if (filters.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
      }

      const result = await pool.query(query, params);

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return {
        success: false,
        error: 'Failed to get audit logs'
      };
    }
  }

  async getAuditLogById(auditId) {
    try {
      const result = await pool.query(
        `SELECT al.*, au.first_name, au.last_name, au.role
         FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'} al
         LEFT JOIN ${process.env.DATABASE_ADMIN_USERS_TABLE} au ON al.user_id = au.id
         WHERE al.audit_id = $1`,
        [auditId]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: 'Audit log not found'
        };
      }

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error getting audit log by ID:', error);
      return {
        success: false,
        error: 'Failed to get audit log'
      };
    }
  }

  async getAuditStats(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_logs,
          COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_actions,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as failed_actions,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT action_type) as unique_action_types,
          COUNT(DISTINCT resource_type) as unique_resource_types
        FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'}
        WHERE 1=1
      `;
      
      const params = [];
      let paramCount = 0;

      // Apply date filters
      if (filters.start_date) {
        paramCount++;
        query += ` AND created_at >= $${paramCount}`;
        params.push(filters.start_date);
      }

      if (filters.end_date) {
        paramCount++;
        query += ` AND created_at <= $${paramCount}`;
        params.push(filters.end_date);
      }

      const result = await pool.query(query, params);

      return {
        success: true,
        data: result.rows[0]
      };
    } catch (error) {
      console.error('Error getting audit stats:', error);
      return {
        success: false,
        error: 'Failed to get audit stats'
      };
    }
  }

  async getAuditLogsByUser(userId, limit = 50) {
    try {
      const result = await pool.query(
        `SELECT al.*, au.first_name, au.last_name, au.role
         FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'} al
         LEFT JOIN ${process.env.DATABASE_ADMIN_USERS_TABLE} au ON al.user_id = au.id
         WHERE al.user_id = $1
         ORDER BY al.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      return {
        success: true,
        data: result.rows
      };
    } catch (error) {
      console.error('Error getting audit logs by user:', error);
      return {
        success: false,
        error: 'Failed to get user audit logs'
      };
    }
  }




async  createCategory(category) {
  const query = `
    INSERT INTO ${process.env.DATABASE_CATEGORY_TABLE} (
      category_name,
      category_store,
      category_status,
      category_image
    ) VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    category.category_name,
    category.category_store,
    category.category_status,
    category.category_image || null, // optional image
  ];

  try {
    const result = await pool.query(query, values);
    console.log("✅ Category created:", result.rows[0]);
    return {success:true, data:result.rows[0]}
  } catch (error) {
    console.log("❌ Error creating category:", error.message);
    return {success:false, data:null}
  }
}
async getCategoryById(categoryId) {
  const query = `
    SELECT *
    FROM ${process.env.DATABASE_CATEGORY_TABLE}
    WHERE category_id = $1;
  `;

  try {
    const result = await pool.query(query, [categoryId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No category found with id: ${categoryId}`);
      return { success: false, data: null };
    }

   // console.log("✅ Category retrieved:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("❌ Error fetching category:", error.message);
    return { success: false, data: null };
  }
}
async getCategoryByName(category_name, category_store) {
  const query = `
    SELECT *
    FROM ${process.env.DATABASE_CATEGORY_TABLE}
    WHERE category_name = $1
    AND category_store = $2;
  `;

  try {
    const result = await pool.query(query, [category_name, category_store]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No category found with name "${category_name}" in store "${category_store}"`);
      return { success: false, data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("❌ Error fetching category:", error.message);
    return { success: false, data: null };
  }
}

async deleteCategory(categoryId) {
  const query = `
    DELETE FROM ${process.env.DATABASE_CATEGORY_TABLE}
    WHERE category_id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [categoryId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No category found with id: ${categoryId}`);
      return { success: false, data: null };
    }

    console.log("✅ Category deleted:", result.rows[0]);
    return { success: true, data: result.rows[0] }; // Return deleted row
  } catch (error) {
    console.log("❌ Error deleting category:", error.message);
    return { success: false, data: null };
  }
}
async updateCategoryFields(category_id, fields) {
  const allowedFields = [
    "category_name",
    "category_store",
    "category_status",
    "category_image"
  ];

  const keys = Object.keys(fields).filter(key => allowedFields.includes(key));

  if (keys.length === 0) {
    return { success: false, message: "No valid fields provided" };
  }

  // Build dynamic query
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map(key => fields[key]);
  values.push(category_id); // last param for WHERE

  const query = `
    UPDATE ${process.env.DATABASE_CATEGORY_TABLE}
    SET ${setClauses}
    WHERE category_id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return { success: false, message: "Category not found" };
    }
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error updating category:", error.message);
    return { success: false, message: error.message };
  }
}
async getAllStoreCategories(category_store) {
  const query = `SELECT * FROM ${process.env.DATABASE_CATEGORY_TABLE} WHERE category_store = $1;`;

  try {
    const result = await pool.query(query, [category_store]);
    console.log("✅ Fetched categories:", result.rows.length);
    return { success: true, data: result.rows };
  } catch (error) {
    console.log("❌ Error fetching categories:", error.message);
    return { success: false, data: [] };
  }
}


// ========================= PRODUCTS =========================
async createProduct(product) {
  const query = `
    INSERT INTO ${process.env.DATABASE_PRODUCTS_TABLE} (
      product_name,
      product_description,
      product_category,
      product_status,
      product_sizes,
      product_gallery,
      product_store
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    product.product_name,
    product.product_description || null,
    product.product_category,
    product.product_status,
    JSON.stringify(product.product_sizes || []), // store as JSONB
    JSON.stringify(product.product_gallery || []), // store as JSONB
    product.product_store
  ];

  try {
    const result = await pool.query(query, values);
    console.log("✅ Product created:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error creating product:", error.message);
    return { success: false, data: null };
  }
}

async getProductById(productId) {
  const query = `
    SELECT p.*, 
           p.product_sizes as sizes
    FROM ${process.env.DATABASE_PRODUCTS_TABLE} p
    WHERE p.product_id = $1;
  `;

  try {
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No product found with id: ${productId}`);
      return { success: false, data: null };
    }

    const product = result.rows[0];
    
    // Parse JSONB sizes if they exist
    this.parseProductSizes(product);

    return { success: true, data: product };
  } catch (error) {
    console.log("❌ Error fetching product:", error.message);
    return { success: false, data: null };
  }
}

async getProductByName(product_name, product_store) {
  const query = `
    SELECT *
    FROM ${process.env.DATABASE_PRODUCTS_TABLE}
    WHERE product_name = $1
    AND product_store = $2;
  `;

  try {
    const result = await pool.query(query, [product_name, product_store]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No product found with name "${product_name}" in store "${product_store}"`);
      return { success: false, data: null };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("❌ Error fetching product:", error.message);
    return { success: false, data: null };
  }
}

async deleteProduct(productId) {
  const query = `
    DELETE FROM ${process.env.DATABASE_PRODUCTS_TABLE}
    WHERE product_id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No product found with id: ${productId}`);
      return { success: false, data: null };
    }

    console.log("✅ Product deleted:", result.rows[0]);
    return { success: true, data: result.rows[0] }; // Return deleted row
  } catch (error) {
    console.log("❌ Error deleting product:", error.message);
    return { success: false, data: null };
  }
}

async updateProductFields(product_id, fields) {
  const allowedFields = [
    "product_name",
    "product_description",
    "product_category",
    "product_status",
    "product_gallery",
    "product_store",
    "product_sizes"
  ];

  const keys = Object.keys(fields).filter(key => allowedFields.includes(key));

  if (keys.length === 0) {
    return { success: false, message: "No valid fields provided" };
  }

  // Build dynamic query
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map(key => {
    if (key === "product_gallery" || key === "product_sizes") {
      return JSON.stringify(fields[key]);
    }
    return fields[key];
  });
  values.push(product_id); // last param for WHERE

  const query = `
    UPDATE ${process.env.DATABASE_PRODUCTS_TABLE}
    SET ${setClauses}
    WHERE product_id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return { success: false, message: "Product not found" };
    }
    
    const updatedProduct = result.rows[0];
    
    // Parse JSONB sizes if they exist
    this.parseProductSizes(updatedProduct);
    
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    return { success: false, message: error.message };
  }
}

  // Helper function to parse product sizes from JSONB
  parseProductSizes(product) {
    if (product.product_sizes) {
      try {
        product.sizes = typeof product.product_sizes === 'string' 
          ? JSON.parse(product.product_sizes) 
          : product.product_sizes;
      } catch (e) {
        console.warn("⚠️ Could not parse product sizes JSON:", e);
        product.sizes = [];
      }
    } else {
      product.sizes = [];
    }
    return product;
  }

  // Helper function to validate size data
  validateSizeData(size) {
    if (!size.size || !size.sku || !size.price || size.inventory === undefined) {
      return { valid: false, error: 'Each size must have size, SKU, price, and inventory' };
    }
    
    if (isNaN(size.price) || parseFloat(size.price) <= 0) {
      return { valid: false, error: 'Price must be a positive number' };
    }
    
    if (!Number.isInteger(size.inventory) || size.inventory < 0) {
      return { valid: false, error: 'Inventory must be a non-negative integer' };
    }
    
    return { valid: true };
  }

async getAllStoreProducts(product_store) {
  const query = `
    SELECT p.*, 
           p.product_sizes as sizes
    FROM ${process.env.DATABASE_PRODUCTS_TABLE} p
    WHERE p.product_store = $1
    ORDER BY p.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [product_store]);
    
    // Parse JSONB sizes for each product
    const products = result.rows.map(product => this.parseProductSizes(product));
    
    console.log("✅ Fetched products:", products.length);
    return { success: true, data: products };
  } catch (error) {
    console.log("❌ Error fetching products:", error.message);
    return { success: false, data: [] };
  }
}














// ========================= ACCESSORY CATEGORIES =========================
async createAccessoryCategory(category) {
  const query = `
    INSERT INTO ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE} (
      accessory_category_name,
      accessory_category_status,
      accessory_category_store,
      accessory_category_image
    ) VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [
    category.accessory_category_name,
    category.accessory_category_status,
    category.accessory_category_store,
    category.accessory_category_image
  ];

  try {
    const result = await pool.query(query, values);
    console.log("✅ Accessory category created:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error creating accessory category:", error.message);
    return { success: false, error: error.message };
  }
}

async getAccessoryCategoryById(categoryId) {
  const query = `
    SELECT * FROM ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}
    WHERE accessory_category_id = $1;
  `;

  try {
    const result = await pool.query(query, [categoryId]);
    
    if (result.rows.length === 0) {
      return { success: false, message: "Accessory category not found" };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error getting accessory category:", error.message);
    return { success: false, error: error.message };
  }
}

async getAccessoryCategoryByName(categoryName, categoryStore) {
  const query = `
    SELECT * FROM ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}
    WHERE accessory_category_name = $1 AND accessory_category_store = $2;
  `;

  try {
    const result = await pool.query(query, [categoryName, categoryStore]);
    
    if (result.rows.length === 0) {
      return { success: false, exists: false, data: null };
    }

    return { success: true, exists: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error getting accessory category by name:", error.message);
    return { success: false, error: error.message };
  }
}

async deleteAccessoryCategory(categoryId) {
  const query = `
    DELETE FROM ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}
    WHERE accessory_category_id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [categoryId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No accessory category found with id: ${categoryId}`);
      return { success: false, data: null };
    }

    console.log("✅ Accessory category deleted:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("❌ Error deleting accessory category:", error.message);
    return { success: false, data: null };
  }
}

async updateAccessoryCategoryFields(categoryId, fields) {
  const allowedFields = [
    "accessory_category_name",
    "accessory_category_status",
    "accessory_category_image"
  ];

  const keys = Object.keys(fields).filter(key => allowedFields.includes(key));

  if (keys.length === 0) {
    return { success: false, message: "No valid fields provided" };
  }

  // Build dynamic query
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map(key => fields[key]);
  values.push(categoryId); // last param for WHERE

  const query = `
    UPDATE ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}
    SET ${setClauses}
    WHERE accessory_category_id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return { success: false, message: "Accessory category not found" };
    }
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error updating accessory category:", error.message);
    return { success: false, message: error.message };
  }
}

async getAllStoreAccessoryCategories(categoryStore) {
  const query = `
    SELECT * FROM ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}
    WHERE accessory_category_store = $1
    ORDER BY created_at DESC;
  `;

  try {
    const result = await pool.query(query, [categoryStore]);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error("❌ Error getting store accessory categories:", error.message);
    return { success: false, error: error.message };
  }
}

// ========================= ACCESSORY PRODUCTS =========================
async createAccessoryProduct(product) {
  const query = `
    INSERT INTO ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE} (
      accessory_name,
      accessory_description,
      accessory_category,
      accessory_price,
      stock_quantity,
      sku,
      accessory_status,
      accessory_gallery,
      accessory_store
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;

  const values = [
    product.accessory_name,
    product.accessory_description || null,
    product.accessory_category,
    product.accessory_price,
    product.stock_quantity,
    product.sku || null,
    product.accessory_status,
    JSON.stringify(product.accessory_gallery || []), // store as JSONB
    product.accessory_store
  ];

  try {
    const result = await pool.query(query, values);
    console.log("✅ Accessory product created:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error creating accessory product:", error.message);
    return { success: false, error: error.message };
  }
}

async getAccessoryProductById(productId) {
  const query = `
    SELECT ap.*, ac.accessory_category_name
    FROM ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE} ap
    LEFT JOIN ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE} ac 
      ON ap.accessory_category = ac.accessory_category_id
    WHERE ap.accessory_id = $1;
  `;

  try {
    const result = await pool.query(query, [productId]);
    
    if (result.rows.length === 0) {
      return { success: false, message: "Accessory product not found" };
    }

    const product = result.rows[0];
    
    // Parse JSONB gallery if it exists
    if (product.accessory_gallery) {
      try {
        product.accessory_gallery = typeof product.accessory_gallery === 'string' 
          ? JSON.parse(product.accessory_gallery) 
          : product.accessory_gallery;
      } catch (e) {
        console.warn("⚠️ Could not parse accessory gallery JSON:", e);
        product.accessory_gallery = [];
      }
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("❌ Error getting accessory product:", error.message);
    return { success: false, error: error.message };
  }
}

async getAccessoryProductByName(productName, productStore) {
  const query = `
    SELECT * FROM ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE}
    WHERE accessory_name = $1 AND accessory_store = $2;
  `;

  try {
    const result = await pool.query(query, [productName, productStore]);
    
    if (result.rows.length === 0) {
      return { success: false, exists: false, data: null };
    }

    return { success: true, exists: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error getting accessory product by name:", error.message);
    return { success: false, error: error.message };
  }
}

async deleteAccessoryProduct(productId) {
  const query = `
    DELETE FROM ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE}
    WHERE accessory_id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      console.log(`⚠️ No accessory product found with id: ${productId}`);
      return { success: false, data: null };
    }

    console.log("✅ Accessory product deleted:", result.rows[0]);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.log("❌ Error deleting accessory product:", error.message);
    return { success: false, data: null };
  }
}

async updateAccessoryProductFields(productId, fields) {
  const allowedFields = [
    "accessory_name",
    "accessory_description",
    "accessory_category",
    "accessory_price",
    "stock_quantity",
    "sku",
    "accessory_status",
    "accessory_gallery"
  ];

  const keys = Object.keys(fields).filter(key => allowedFields.includes(key));

  if (keys.length === 0) {
    return { success: false, message: "No valid fields provided" };
  }

  // Build dynamic query
  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map(key => 
    key === "accessory_gallery" ? JSON.stringify(fields[key]) : fields[key]
  );
  values.push(productId); // last param for WHERE

  const query = `
    UPDATE ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE}
    SET ${setClauses}
    WHERE accessory_id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return { success: false, message: "Accessory product not found" };
    }
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("❌ Error updating accessory product:", error.message);
    return { success: false, message: error.message };
  }
}

async getAllStoreAccessoryProducts(productStore) {
  const query = `
    SELECT ap.*, ac.accessory_category_name
    FROM ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE} ap
    LEFT JOIN ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE} ac 
      ON ap.accessory_category = ac.accessory_category_id
    WHERE ap.accessory_store = $1
    ORDER BY ap.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [productStore]);
    
    // Parse JSONB galleries for all products
    const products = result.rows.map(product => {
      if (product.accessory_gallery) {
        try {
          product.accessory_gallery = typeof product.accessory_gallery === 'string' 
            ? JSON.parse(product.accessory_gallery) 
            : product.accessory_gallery;
        } catch (e) {
          console.warn("⚠️ Could not parse accessory gallery JSON:", e);
          product.accessory_gallery = [];
        }
      }
      return product;
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("❌ Error getting store accessory products:", error.message);
    return { success: false, error: error.message };
  }
}

}

export default DBFunctions;
