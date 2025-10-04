import pool from "./DBConnect";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.IMAGE_STORAGE_DB_URL,
  process.env.IMAGE_STORAGE_DB_CONNECTION_KEY
);

const bucketName = "dbc_elegance_store";

const folders = [
  "store/male/categories/",
  "store/male/products/",
  "store/male/accessories/",
  "store/female/categories/",
  "store/female/products/",
  "store/female/accessories/",
];

async function createBucketAndFolders() {
  // 1. Check if bucket exists
  const { data: listData, error: listError } =
    await supabase.storage.listBuckets();

  if (listError) {
    console.error("❌ Error listing buckets:", listError.message);
    return;
  }

  const bucketExists = listData?.some((b) => b.name === bucketName);

  // 2. Create bucket if it doesn't exist
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(
      bucketName,
      {
        public: true, // make it private; change to true if you want public access
      }
    );

    if (createError) {
      console.error("❌ Failed to create bucket:", createError.message);
      return;
    }

    console.log(`✅ Created bucket: ${bucketName}`);
  } else {
    console.log(`ℹ️ Bucket already exists: ${bucketName}`);
  }
}

async function createAdminUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_ADMIN_USERS_TABLE} (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role VARCHAR(100) NOT NULL,
      password VARCHAR(500) NOT NULL,
      status VARCHAR(255) NOT NULL,
      last_login VARCHAR(500),
      last_logout VARCHAR(500),
      last_login_ip VARCHAR(255) DEFAULT 'Unknown',
      last_login_location VARCHAR(255) DEFAULT 'Unknown',
      accessiblepages VARCHAR(1000) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // const client = await pool.connect();
    await pool.query(createTableQuery);
    console.log("Admin users table created successfully");
  } catch (error) {
    console.error("Error creating admin users table:", error);
    throw error;
  }
}

async function createCategoryTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_CATEGORY_TABLE} (
      category_id SERIAL PRIMARY KEY,
      category_name VARCHAR(255) NOT NULL,
      category_status VARCHAR(255) NOT NULL,
      category_store VARCHAR(255),
       category_image  VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    //const client = await pool.connect();
    await pool.query(createTableQuery);
    console.log("Admin category table created successfully");
  } catch (error) {
    console.error("Error creating admin category table:", error);
    throw error;
  }
}

async function createProductsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_PRODUCTS_TABLE} (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      product_description TEXT,
      product_sizes JSONB, -- Array of objects {size, sku, price, inventory}
      product_category INT NOT NULL REFERENCES ${process.env.DATABASE_CATEGORY_TABLE}(category_id) ON DELETE CASCADE,
      product_status VARCHAR(20) NOT NULL CHECK (product_status IN ('active', 'inactive')),
      product_gallery JSONB, -- Array of objects {url, type}
      product_store VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_products_store 
    ON ${process.env.DATABASE_PRODUCTS_TABLE}(product_store);
    
    CREATE INDEX IF NOT EXISTS idx_products_category 
    ON ${process.env.DATABASE_PRODUCTS_TABLE}(product_category);
    
    CREATE INDEX IF NOT EXISTS idx_products_status 
    ON ${process.env.DATABASE_PRODUCTS_TABLE}(product_status);
    
    CREATE INDEX IF NOT EXISTS idx_products_sizes 
    ON ${process.env.DATABASE_PRODUCTS_TABLE} USING GIN (product_sizes);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Products table created successfully");
  } catch (error) {
    console.error("Error creating products table:", error);
    throw error;
  }
}

async function createAccessoryCategoryTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE} (
      accessory_category_id SERIAL PRIMARY KEY,
      accessory_category_name VARCHAR(255) NOT NULL,
      accessory_category_status VARCHAR(20) NOT NULL CHECK (accessory_category_status IN ('active', 'inactive')),
      accessory_category_store VARCHAR(255),
      accessory_category_image VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Accessory category table created successfully");
  } catch (error) {
    console.error("Error creating accessory category table:", error);
    throw error;
  }
}

async function createAccessoryProductsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE} (
      accessory_id SERIAL PRIMARY KEY,
      accessory_name VARCHAR(255) NOT NULL,
      accessory_description TEXT,
      accessory_category INT NOT NULL REFERENCES ${process.env.DATABASE_ACCESSORY_CATEGORY_TABLE}(accessory_category_id) ON DELETE CASCADE,
      accessory_price NUMERIC(10, 2) NOT NULL,
      stock_quantity INT DEFAULT 0,
      sku VARCHAR(255),
      accessory_status VARCHAR(20) NOT NULL CHECK (accessory_status IN ('active', 'inactive')),
      accessory_gallery JSONB, -- Array of objects {url, type}
      accessory_store VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_accessory_category 
    ON ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE}(accessory_category);
    
    CREATE INDEX IF NOT EXISTS idx_accessory_store 
    ON ${process.env.DATABASE_ACCESSORY_PRODUCTS_TABLE}(accessory_store);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Accessory products table created successfully");
  } catch (error) {
    console.error("Error creating accessory products table:", error);
    throw error;
  }
}

async function createAuditLogsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    } (
      audit_id SERIAL PRIMARY KEY,
      user_id INT REFERENCES ${
        process.env.DATABASE_ADMIN_USERS_TABLE
      }(id) ON DELETE SET NULL,
      user_email VARCHAR(255),
      action_type VARCHAR(100) NOT NULL,
      action_category VARCHAR(100) NOT NULL,
      resource_type VARCHAR(100) NOT NULL,
      resource_id VARCHAR(255),
      resource_name VARCHAR(500),
      old_values JSONB,
      new_values JSONB,
      ip_address VARCHAR(255),
      user_agent TEXT,
      location VARCHAR(500),
      session_id VARCHAR(255),
      status VARCHAR(50) DEFAULT 'success',
      error_message TEXT,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_audit_user_id ON ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    }(user_id);
    CREATE INDEX IF NOT EXISTS idx_audit_action_type ON ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    }(action_type);
    CREATE INDEX IF NOT EXISTS idx_audit_resource_type ON ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    }(resource_type);
    CREATE INDEX IF NOT EXISTS idx_audit_created_at ON ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    }(created_at);
    CREATE INDEX IF NOT EXISTS idx_audit_user_email ON ${
      process.env.DATABASE_AUDIT_LOGS_TABLE || "audit_logs"
    }(user_email);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Audit logs table created successfully");
  } catch (error) {
    console.error("Error creating audit logs table:", error);
    throw error;
  }
}

async function migrateAdminUsersTable() {
  try {
    // Check if the new columns exist
    const checkColumnsQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND column_name IN ('last_login_ip', 'last_login_location')
    `;

    const result = await pool.query(checkColumnsQuery, [
      process.env.DATABASE_ADMIN_USERS_TABLE,
    ]);

    // If columns don't exist, add them
    if (result.rows.length < 2) {
      const addColumnsQuery = `
        ALTER TABLE ${process.env.DATABASE_ADMIN_USERS_TABLE} 
        ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(255) DEFAULT 'Unknown',
        ADD COLUMN IF NOT EXISTS last_login_location VARCHAR(255) DEFAULT 'Unknown'
      `;

      await pool.query(addColumnsQuery);
      console.log(
        "Migration: Added login tracking columns to admin_users table"
      );
    }
  } catch (error) {
    console.error("Error during migration:", error);
  }
}

async function createCustomerTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_USERS_TABLE} (
      customer_id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      title VARCHAR(10) CHECK (title IN ('Mr', 'Mrs', 'Ms', 'Dr')),
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      fashion_news BOOLEAN DEFAULT false,
      share_preferences BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email 
    ON ${process.env.DATABASE_USERS_TABLE}(email);

    CREATE INDEX IF NOT EXISTS idx_users_phone 
    ON ${process.env.DATABASE_USERS_TABLE}(phone);

    CREATE INDEX IF NOT EXISTS idx_users_share_preferences 
    ON ${process.env.DATABASE_USERS_TABLE}(share_preferences);

    CREATE INDEX IF NOT EXISTS idx_users_fashion_news 
    ON ${process.env.DATABASE_USERS_TABLE}(fashion_news);
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}

async function createOrdersTable() {
  const tableName = process.env.DATABASE_ORDERS_TABLE || "orders";

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      order_id SERIAL PRIMARY KEY,
      customer_email VARCHAR(255) NOT NULL,

      -- Core order details
      cart TEXT NOT NULL,                -- stores the cart items array
      packaging JSONB NOT NULL,          -- packaging info (signature, gift options, etc.)
      shipping_address JSONB NOT NULL,
      billing_address JSONB NOT NULL,
      geo_data JSONB,                    -- IP, location, currency, etc.

      sub_total NUMERIC(12, 2) NOT NULL,
      total NUMERIC(12, 2) NOT NULL,
      use_shipping_address BOOLEAN NOT NULL,


      -- Payment tracking
      payment_status VARCHAR(20) DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
      order_status VARCHAR(255) DEFAULT 'pending',
      tracking_number VARCHAR(255),
      use_tracking_number VARCHAR(255),
      shipping_agency VARCHAR(255),
      side_note Text,  

      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIndexes = [
    `CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON ${tableName}(customer_email)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON ${tableName}(payment_status)`,
    `CREATE INDEX IF NOT EXISTS idx_orders_created_at ON ${tableName}(created_at)`,
  ];

  try {
    await pool.query(createTableQuery);
    for (const query of createIndexes) {
      await pool.query(query);
    }
    console.log("Orders table and indexes created successfully ✅");
  } catch (error) {
    console.error("Error creating orders table:", error);
    throw error;
  }
}

export async function TableCreator() {
  const placeholderFile = Buffer.from("placeholder");

  for (const folder of folders) {
    const filePath = `${folder}.placeholder`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, placeholderFile, {
        contentType: "text/plain",
        upsert: false, // don't overwrite if it already exists
      });

    if (uploadError) {
      if (uploadError.message.includes("The resource already exists")) {
        console.log(`🔁 Folder already exists: ${folder}`);
      } else {
        console.error(
          `❌ Failed to create folder "${folder}":`,
          uploadError.message
        );
      }
    } else {
      console.log(`✅ Created folder: ${folder}`);
    }
  }
  await createBucketAndFolders();
  await createAdminUsersTable();
  await createCategoryTable();
  await createProductsTable();

  await createAccessoryCategoryTable();
  await createAccessoryProductsTable();
  await createAuditLogsTable();
  await migrateAdminUsersTable();
  await createCustomerTable();
  await createOrdersTable();
}
