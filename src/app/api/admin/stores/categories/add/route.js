import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

// Enable edge-compatible file type if using middleware (only for clarification, not code)
export const dynamic = 'force-dynamic'; // Optional: only if caching becomes an issue

export async function POST(request) {
   const dbActions = new DBFunctions();
  try {
    const formData = await request.formData();

    const category_name = formData.get("category_name");
    const category_status = formData.get("category_status");
    const category_store = formData.get("category_store");
    const file = formData.get("category_image");
    
    // Get admin user details from request headers (you'll need to implement this)
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (
      !category_name ||
      !category_status ||
      !category_store ||
      !file ||
      !(file instanceof File)
    ) {
      // Log failed category creation attempt - missing fields
      try {
        await auditHelper.logCategoryAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          category_name || 'unknown',
          {
            status: 'failure',
            error_message: 'Missing required fields for category creation',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_fields: {
                category_name: !category_name,
                category_status: !category_status,
                category_store: !category_store,
                category_image: !file
              },
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed category creation:', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "All fields including a valid image file are required.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

  //check if category exist

    let category_exist_result = await dbActions.getCategoryByName(category_name, category_store)

    if (category_exist_result.success){
      // Log failed category creation attempt - duplicate name
      try {
        await auditHelper.logCategoryAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          category_name,
          {
            status: 'failure',
            error_message: 'Category with same name already exists',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'duplicate_name',
              existing_category_id: category_exist_result.data.category_id,
              category_store,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for duplicate category:', auditError);
      }

       return NextResponse.json(
        {
          success: false,
          message: "A category with same name exist.",
        },
        { status: 400 })
    }






    const folderPath = `store/${category_store}/categories/`;
    const storage = new StorageFunctions();
    const uploadResult = await storage.uploadFile(file, folderPath);

    if (!uploadResult || !uploadResult.path) {
      // Log failed category creation attempt - image upload failure
      try {
        await auditHelper.logCategoryAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          category_name,
          {
            status: 'failure',
            error_message: 'Failed to upload category image',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'image_upload_failure',
              category_name,
              category_store,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for image upload failure:', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image.",
        },
        { status: 500 }
      );
    }

   
    const category_data = await dbActions.createCategory({
      category_name,
      category_status,
      category_store,
      category_image: uploadResult.path,
    });

    if (!category_data.success) {
      // Rollback uploaded image if DB insert fails
      await storage.deleteFile(folderPath, uploadResult.path);
      
      // Log failed category creation attempt - database failure
      try {
        await auditHelper.logCategoryAction(
          'create',
          adminUserId,
          adminUserEmail,
          null,
          category_name,
          {
            status: 'failure',
            error_message: 'Category creation failed in database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'database_failure',
              category_name,
              category_store,
              category_status,
              image_path: uploadResult.path,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Category registration failed.",
        },
        { status: 400 }
      );
    }

    // Log successful category creation
    try {
      await auditHelper.logCategoryAction(
        'create',
        adminUserId,
        adminUserEmail,
        category_data.data.category_id,
        category_name,
        {
          status: 'success',
          new_values: {
            category_id: category_data.data.category_id,
            category_name,
            category_status,
            category_store,
            category_image: uploadResult.path
          },
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            category_store,
            image_path: uploadResult.path,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful category creation:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: category_data.data,
        message: "Category registered successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category registration error:", error);
    
    // Log system error during category creation
    try {
      await auditHelper.logCategoryAction(
        'create',
        adminUserId,
        adminUserEmail,
        null,
        category_name || 'unknown',
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            attempt_type: 'system_error',
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
