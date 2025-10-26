import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData(); 

    const product_name = formData.get("product_name");
    const product_sizes = formData.get("product_sizes");
    const product_description = formData.get("product_description");
    const product_category = parseInt(formData.get("product_category"));
    const product_status = formData.get("product_status");
    const product_store = formData.get("product_store");
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    console.log("Product sizes received:", product_sizes);

    // Extract all files (multiple uploads possible)
    const files = formData.getAll("product_gallery");

    if (!product_name || !product_category || !product_status || !product_store || files.length === 0 ) {
      // Log failed product creation attempt - missing fields
      try {
        await auditHelper.logProductAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          product_name || 'unknown',
          {
            status: 'failure',
            error_message: 'Missing required fields for product creation',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_fields: {
                product_name: !product_name,
                product_category: !product_category,
                product_status: !product_status,
                product_store: !product_store,
                product_gallery: files.length === 0
              },
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed product creation:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "All fields and at least one media file are required." },
        { status: 400 }
      );
    }

    // Validate product_sizes
    if (!product_sizes) {
      // Log failed product creation attempt - missing sizes
      try {
        await auditHelper.logProductAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          product_name,
          {
            status: 'failure',
            error_message: 'Product sizes are required',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_field: 'product_sizes',
              product_name,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for missing sizes:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Product sizes are required." },
        { status: 400 }
      );
    }

    // Parse and validate sizes
    let sizes;
    try {
      sizes = JSON.parse(product_sizes);
      if (!Array.isArray(sizes) || sizes.length === 0) {
        return NextResponse.json(
          { success: false, message: "At least one size is required." },
          { status: 400 }
        );
      }
      
      // Validate each size
      for (const size of sizes) {
        if (!size.size || !size.sku || !size.price || size.inventory === undefined) {
          return NextResponse.json(
            { success: false, message: "Each size must have size, SKU, price, and inventory." },
            { status: 400 }
          );
        }
        
        // Validate price is a positive number
        if (isNaN(size.price) || parseFloat(size.price) <= 0) {
          return NextResponse.json(
            { success: false, message: "Price must be a positive number." },
            { status: 400 }
          );
        }
        
        // Validate inventory is a non-negative integer
        // if (!Number.isInteger(size.inventory) || size.inventory < 0) {
        //   return NextResponse.json(
        //     { success: false, message: "Inventory must be a non-negative integer." },
        //     { status: 400 }
        //   );
        // }
      }
    } catch (error) {
      console.error("Error parsing sizes data:", error);
      return NextResponse.json(
        { success: false, message: "Invalid sizes data format." },
        { status: 400 }
      );
    }
 
    // Create table if not exists
  

    let category_exist_result = await dbActions.getCategoryById(product_category)

    if (!category_exist_result.success){
       return NextResponse.json(
        {
          success: false,
          message: "Category does not exist.",
        },
        { status: 400 })
    }

    let product_exist_result = await dbActions.getProductByName(product_name, product_store)

    if (product_exist_result.success){
       return NextResponse.json(
        {
          success: false,
          message: "A product with similar name exist",
        },
        { status: 400 })
    }





    // Upload files and prepare gallery
    const folderPath = `store/${product_store}/products/`;
    let gallery = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const uploadResult = await storage.uploadFile(file, folderPath);
      if (!uploadResult || !uploadResult.path) {
        return NextResponse.json(
          { success: false, message: `Failed to upload file: ${file.name}` },
          { status: 500 }
        );
      }

      gallery.push({
        url: uploadResult.path,
        type: file.type.startsWith("image/") ? "image" : "video"
      });
    }

    // Insert into DB
    const product_data = await dbActions.createProduct({
      product_name,
      product_description,
      product_category,
      product_status,
      product_sizes: sizes, // Use the validated sizes
      product_gallery: gallery,
      product_store
    });

    if (!product_data.success) {
      // Rollback uploaded files if DB insert fails
      for (const g of gallery) {
        await storage.deleteFile(folderPath, g.url);
      }
      
      // Log failed product creation
      try {
        await auditHelper.logProductAction(
          'create',
          adminUserId,
          adminUserEmail,
          null, // productId - creation failed
          product_name,
          {
            status: 'failure',
            error_message: 'Product creation failed in database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              product_name,
              product_category,
              product_store,
              gallery_count: gallery.length,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed product creation:', auditError);
      }
      
      return NextResponse.json(
        { success: false, message: "Product creation failed." },
        { status: 400 }
      );
    }

    // Log successful product creation
    try {
      await auditHelper.logProductAction(
        'create',
        adminUserId,
        adminUserEmail,
        product_data.data.product_id,
        product_name,
        {
          status: 'success',
          new_values: {
            product_id: product_data.data.product_id,
            product_name,
            product_description,
            product_category,
            product_status,
            product_store,
            gallery_count: gallery.length
          },
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            product_store,
            category_id: product_category,
            files_uploaded: gallery.length,
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful product creation:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: product_data.data,
        message: "Product created successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Product creation error:", error);
    
    // Log system error during product creation
    try {
      await auditHelper.logProductAction(
        'create',
        adminUserId,
        adminUserEmail,
        null, // productId - creation failed
        product_name || 'unknown',
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            error_type: error.constructor.name,
            error_stack: error.stack,
            timestamp: new Date().toISOString(),
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for system error:', auditError);
    }
    
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
