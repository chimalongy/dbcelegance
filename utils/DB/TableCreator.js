import pool from "./DBConnect";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.IMAGE_STORAGE_DB_URL, process.env.IMAGE_STORAGE_DB_CONNECTION_KEY)


const bucketName = 'dbc_elegance_store'

const folders = [
  'store/male/categories/',
  'store/male/products/',
  'store/male/accessories/',
  'store/female/categories/',
  'store/female/products/',
  'store/female/accessories/',
]

async function createBucketAndFolders() {
  // 1. Check if bucket exists
  const { data: listData, error: listError } = await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Error listing buckets:', listError.message)
    return
  }

  const bucketExists = listData?.some(b => b.name === bucketName)

  // 2. Create bucket if it doesn't exist
  if (!bucketExists) {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true // make it private; change to true if you want public access
    })

    if (createError) {
      console.error('❌ Failed to create bucket:', createError.message)
      return
    }

    console.log(`✅ Created bucket: ${bucketName}`)
  } else {
    console.log(`ℹ️ Bucket already exists: ${bucketName}`)
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
      accessiblepages VARCHAR(1000) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
   // const client = await pool.connect();
    await pool.query(createTableQuery);
    console.log('Admin users table created successfully');
  } catch (error) {
    console.error('Error creating admin users table:', error);
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
    console.log('Admin category table created successfully');
  } catch (error) {
    console.error('Error creating admin category table:', error);
    throw error;
  } 
}

async function createProductsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_PRODUCTS_TABLE} (
      product_id SERIAL PRIMARY KEY,
      product_name VARCHAR(255) NOT NULL,
      product_description TEXT,
      product_category INT NOT NULL REFERENCES ${process.env.DATABASE_CATEGORY_TABLE}(category_id) ON DELETE CASCADE,
      product_status VARCHAR(20) NOT NULL CHECK (product_status IN ('active', 'inactive')),
      product_gallery JSONB, -- Array of objects {url, type}
      product_store VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Products table created successfully');
  } catch (error) {
    console.error('Error creating products table:', error);
    throw error;
  }
}

async function createProductVariantTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${process.env.DATABASE_PRODUCT_VARIANT_TABLE} (
      variant_id SERIAL PRIMARY KEY,
      product_id INT NOT NULL REFERENCES ${process.env.DATABASE_PRODUCTS_TABLE}(product_id) ON DELETE CASCADE,
      product_store VARCHAR(255),
      sku VARCHAR(255) NOT NULL,
      variant_status VARCHAR(20) NOT NULL CHECK (variant_status IN ('active', 'inactive')),
      variant_price NUMERIC(10, 2) NOT NULL,
      stock_quantity INT DEFAULT 0,
      variant_gallery JSONB, -- Array of objects {url, type}
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_variant_product_id 
    ON ${process.env.DATABASE_PRODUCT_VARIANT_TABLE}(product_id);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Product variant table created successfully');
  } catch (error) {
    console.error('Error creating product variant table:', error);
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
    console.log('Accessory category table created successfully');
  } catch (error) {
    console.error('Error creating accessory category table:', error);
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
    console.log('Accessory products table created successfully');
  } catch (error) {
    console.error('Error creating accessory products table:', error);
    throw error;
  }
}

export async function TableCreator(){
   const placeholderFile = Buffer.from('placeholder')

  for (const folder of folders) {
    const filePath = `${folder}.placeholder`

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, placeholderFile, {
        contentType: 'text/plain',
        upsert: false, // don't overwrite if it already exists
      })

    if (uploadError) {
      if (uploadError.message.includes('The resource already exists')) {
        console.log(`🔁 Folder already exists: ${folder}`)
      } else {
        console.error(`❌ Failed to create folder "${folder}":`, uploadError.message)
      }
    } else {
      console.log(`✅ Created folder: ${folder}`)
    }
  }
  await createBucketAndFolders();
    await createAdminUsersTable();
    await createCategoryTable();
    await createProductsTable()
    await createProductVariantTable();
    await createAccessoryCategoryTable();
    await createAccessoryProductsTable();
}