import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";
import { extractAdminUserInfo, logFailedAdminAction, logSuccessfulAdminAction } from "@/app/lib/adminAuthHelper";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const accessory_category_name = formData.get("accessory_category_name");
    const accessory_category_status = formData.get("accessory_category_status");
    const accessory_category_store = formData.get("accessory_category_store");
    const file = formData.get("accessory_category_image");
    
    // Get admin user details from request headers
    const userInfo = extractAdminUserInfo(request);

    if (
      !accessory_category_name ||
      !accessory_category_status ||
      !accessory_category_store ||
      !file ||
      !(file instanceof File)
    ) {
      // Log failed accessory category creation attempt - missing fields
      try {
        await logFailedAdminAction(
          'create',
          'accessory_category',
          userInfo,
          'Missing required fields for accessory category creation',
          {
            resource_type: 'accessory_category',
            missing_fields: {
              accessory_category_name: !accessory_category_name,
              accessory_category_status: !accessory_category_status,
              accessory_category_store: !accessory_category_store,
              accessory_category_image: !file
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed accessory category creation:', auditError);
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
  

    // Check if category exists
    let category_exist_result = await dbActions.getAccessoryCategoryByName(accessory_category_name, accessory_category_store);

    if (category_exist_result.success && category_exist_result.exists) {
      // Log failed accessory category creation attempt - duplicate name
      try {
        await logFailedAdminAction(
          'create',
          'accessory_category',
          userInfo,
          'Accessory category with same name already exists',
          {
            resource_type: 'accessory_category',
            attempt_type: 'duplicate_name',
            existing_category_id: category_exist_result.data.accessory_category_id,
            accessory_category_store
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for duplicate accessory category:', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "An accessory category with the same name already exists.",
        },
        { status: 400 }
      );
    }

    // Upload image
    const folderPath = `store/${accessory_category_store}/accessories/categories/`;
    const uploadResult = await storage.uploadFile(file, folderPath);

    if (!uploadResult || !uploadResult.path) {
      // Log failed accessory category creation attempt - image upload failure
      try {
        await logFailedAdminAction(
          'create',
          'accessory_category',
          userInfo,
          'Failed to upload accessory category image',
          {
            resource_type: 'accessory_category',
            attempt_type: 'image_upload_failure',
            accessory_category_name,
            accessory_category_store,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type
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

    // Create category in database
    const category_data = await dbActions.createAccessoryCategory({
      accessory_category_name,
      accessory_category_status,
      accessory_category_store,
      accessory_category_image: uploadResult.path,
    });

    if (!category_data.success) {
      // Rollback uploaded image if DB insert fails
      await storage.deleteFile(folderPath, uploadResult.path);
      
      // Log failed accessory category creation attempt - database failure
      try {
        await logFailedAdminAction(
          'create',
          'accessory_category',
          userInfo,
          'Accessory category creation failed in database',
          {
            resource_type: 'accessory_category',
            attempt_type: 'database_failure',
            accessory_category_name,
            accessory_category_store,
            accessory_category_status,
            image_path: uploadResult.path
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to create accessory category.",
        },
        { status: 500 }
      );
    }

    // Log successful accessory category creation
    try {
      await logSuccessfulAdminAction(
        'create',
        'accessory_category',
        userInfo,
        {
          new_values: {
            accessory_category_id: category_data.data.accessory_category_id,
            accessory_category_name,
            accessory_category_status,
            accessory_category_store,
            accessory_category_image: uploadResult.path
          }
        },
        {
          resource_type: 'accessory_category',
          accessory_category_store,
          image_path: uploadResult.path,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful accessory category creation:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: category_data.data,
        message: "Accessory category created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating accessory category:", error);
    
    // Log system error during accessory category creation
    try {
      const userInfo = extractAdminUserInfo(request);
      await logFailedAdminAction(
        'create',
        'accessory_category',
        userInfo,
        `System error: ${error.message}`,
        {
          resource_type: 'accessory_category',
          attempt_type: 'system_error',
          error_type: error.constructor.name,
          error_stack: error.stack,
          timestamp: new Date().toISOString()
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