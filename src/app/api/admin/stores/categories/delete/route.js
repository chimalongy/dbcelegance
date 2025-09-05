import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const body = await request.json();
    const { category_id } = body;
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!category_id) {
      // Log failed category deletion attempt - missing category ID
      try {
        await auditHelper.logCategoryAction(
          'delete',
          adminUserId,
          adminUserEmail,
          null,
          'unknown',
          {
            status: 'failure',
            error_message: 'Category ID is required for deletion',
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

    // Get category details first
    const category_result = await dbActions.getCategoryById(category_id);
    if (!category_result.success) {
      // Log failed category deletion attempt - category not found
      try {
        await auditHelper.logCategoryAction(
          'delete',
          adminUserId,
          adminUserEmail,
          category_id,
          'unknown',
          {
            status: 'failure',
            error_message: 'Category not found for deletion',
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
        { status: 404 }
      );
    }

    const categoryData = category_result.data;

    // Delete image from storage if it exists
    if (categoryData.category_image) {
      const folderPath = `store/${categoryData.category_store}/categories/`;
      await storage.deleteFile(folderPath, categoryData.category_image);
    }

    // Delete category from DB
    const delete_result = await dbActions.deleteCategory(category_id);
    if (!delete_result.success) {
      // Log failed category deletion attempt - database failure
      try {
        await auditHelper.logCategoryAction(
          'delete',
          adminUserId,
          adminUserEmail,
          category_id,
          categoryData.category_name,
          {
            status: 'failure',
            error_message: 'Failed to delete category from database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'database_failure',
              category_id,
              category_name: categoryData.category_name,
              category_store: categoryData.category_store,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Failed to delete category." },
        { status: 400 }
      );
    }

    // Log successful category deletion
    try {
      await auditHelper.logCategoryAction(
        'delete',
        adminUserId,
        adminUserEmail,
        category_id,
        categoryData.category_name,
        {
          status: 'success',
          old_values: categoryData,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            category_id,
            category_name: categoryData.category_name,
            category_store: categoryData.category_store,
            image_deleted: !!categoryData.category_image,
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful category deletion:', auditError);
    }

    return NextResponse.json(
      { success: true, data: delete_result.data, message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category deletion error:", error);
    
    // Log system error during category deletion
    try {
      await auditHelper.logCategoryAction(
        'delete',
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
