import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log("Hitting update")
  const dbActions = new DBFunctions();

  try {
    const formData = await request.formData();
    const product_id = formData.get("product_id");
    const product_store = formData.get("product_store");
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!product_id || !product_store) {
      // Log failed product update attempt - missing required fields
      try {
        await auditHelper.logProductAction(
          'update',
          adminUserId,
          adminUserEmail,
          product_id || null,
          'unknown',
          {
            status: 'failure',
            error_message: 'Product ID and store are required for update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_fields: {
                product_id: !product_id,
                product_store: !product_store
              },
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for missing fields:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Product ID and store are required." },
        { status: 400 }
      );
    }

    // Get current product
    let product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      // Log failed product update attempt - product not found
      try {
        await auditHelper.logProductAction(
          'update',
          adminUserId,
          adminUserEmail,
          product_id,
          'unknown',
          {
            status: 'failure',
            error_message: 'Product not found for update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'product_not_found',
              product_id,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for product not found:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const originalProductData = { ...product_result.data };
    const updateData = {};

    // Collect all fields except product_id and gallery fields
    for (const [key, value] of formData.entries()) {
      if (["product_id", "product_gallery", "replace_gallery"].includes(key)) continue;
      updateData[key] = value;
    }

  

    const result = await dbActions.updateProductFields(product_id, updateData);

    if (!result.success) {
      // Log failed product update attempt - database failure
      try {
        await auditHelper.logProductAction(
          'update',
          adminUserId,
          adminUserEmail,
          product_id,
          originalProductData.product_name,
          {
            status: 'failure',
            error_message: result.message || 'Product update failed in database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'database_failure',
              product_id,
              update_data: updateData,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        { success: false, message: result.message || "Product update failed." },
        { status: 400 }
      );
    }

    // Log successful product update
    try {
      await auditHelper.logProductAction(
        'update',
        adminUserId,
        adminUserEmail,
        product_id,
        originalProductData.product_name,
        {
          status: 'success',
          old_values: originalProductData,
          new_values: result.data,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            product_id,
            updated_fields: Object.keys(updateData),
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful product update:', auditError);
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "Product updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Product update error:", error);
    
    // Log system error during product update
    try {
      await auditHelper.logProductAction(
        'update',
        adminUserId,
        adminUserEmail,
        product_id || null,
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
