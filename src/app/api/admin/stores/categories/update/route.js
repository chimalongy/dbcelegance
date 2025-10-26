import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  try {

    const formData = await request.formData();
    const category_id = formData.get("category_id");
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!category_id) {
      // Log failed category update attempt - missing category ID
      try {
        await auditHelper.logCategoryAction(
          'update',
          adminUserId,
          adminUserEmail,
          null,
          'unknown',
          {
            status: 'failure',
            error_message: 'Category ID is required for update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_field: 'category_id',
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for missing category ID:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Category ID is required." },
        { status: 400 }
      );
    }

    let category_result = await dbActions.getCategoryById(category_id)
    if (!category_result.success){
      // Log failed category update attempt - category not found
      try {
        await auditHelper.logCategoryAction(
          'update',
          adminUserId,
          adminUserEmail,
          category_id,
          'unknown',
          {
            status: 'failure',
            error_message: 'Category not found for update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'category_not_found',
              category_id,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for category not found:', auditError);
      }

       return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 400 }
      );
    }

    
//console.log(category_result)
 let previousImageUrl = category_result.data.category_image
    const originalCategoryData = { ...category_result.data };

    const storage = new StorageFunctions();
    const updateData = {};

    // Handle normal fields
    for (const [key, value] of formData.entries()) {
      if (key === "category_id") continue;

      if (key === "category_image" && value instanceof File) {
       
        console.log("previous image url: "+ previousImageUrl)
        const folderPath = `store/${formData.get("category_store")}/categories/`;
        const delete_current_image_result = await storage.deleteFile(folderPath, previousImageUrl)
        console.log(delete_current_image_result)
        const uploadResult = await storage.uploadFile(value, folderPath);
        if (!uploadResult?.path) {
          return NextResponse.json(
            { success: false, message: "Failed to upload image." },
            { status: 500 }
          );
        }
        updateData[key] = uploadResult.path;
      } else {
        updateData[key] = value;
      }
    }

  

    
    const result = await dbActions.updateCategoryFields(category_id, updateData);

    if (!result.success) {
      // Log failed category update attempt - database failure
      try {
        await auditHelper.logCategoryAction(
          'update',
          adminUserId,
          adminUserEmail,
          category_id,
          originalCategoryData.category_name,
          {
            status: 'failure',
            error_message: result.message || 'Category update failed in database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'database_failure',
              category_id,
              update_data: updateData,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        { success: false, message: result.message || "Category update failed." },
        { status: 400 }
      );
    }

    // Log successful category update
    try {
      await auditHelper.logCategoryAction(
        'update',
        adminUserId,
        adminUserEmail,
        category_id,
        originalCategoryData.category_name,
        {
          status: 'success',
          old_values: originalCategoryData,
          new_values: result.data,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            category_id,
            updated_fields: Object.keys(updateData),
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful category update:', auditError);
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "Category updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category update error:", error);
    
    // Log system error during category update
    try {
      await auditHelper.logCategoryAction(
        'update',
        adminUserId,
        adminUserEmail,
        category_id || null,
        'unknown',
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
