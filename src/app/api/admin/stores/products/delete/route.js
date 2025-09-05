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
    const { product_id } = body;
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!product_id) {
      // Log failed product deletion attempt - missing product ID
      try {
        await auditHelper.logProductAction(
          'delete',
          adminUserId,
          adminUserEmail,
          null,
          'unknown',
          {
            status: 'failure',
            error_message: 'Product ID is required for deletion',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_field: 'product_id',
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for missing product ID:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // Get product details first
    const product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      // Log failed product deletion attempt - product not found
      try {
        await auditHelper.logProductAction(
          'delete',
          adminUserId,
          adminUserEmail,
          product_id,
          'unknown',
          {
            status: 'failure',
            error_message: 'Product not found for deletion',
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

    const productData = product_result.data;

    // Delete product gallery images from storage if they exist
    if (productData.product_gallery && Array.isArray(productData.product_gallery)) {
      const folderPath = `store/${productData.product_store}/products/`;
      for (const galleryitem of productData.product_gallery) {
        await storage.deleteFile(folderPath, galleryitem.url);
      }
    }

    // Delete product from DB
    const delete_result = await dbActions.deleteProduct(product_id);
    if (!delete_result.success) {
      // Log failed product deletion attempt - database failure
      try {
        await auditHelper.logProductAction(
          'delete',
          adminUserId,
          adminUserEmail,
          product_id,
          productData.product_name,
          {
            status: 'failure',
            error_message: 'Failed to delete product from database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'database_failure',
              product_id,
              product_name: productData.product_name,
              product_store: productData.product_store,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for database failure:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Failed to delete product." },
        { status: 400 }
      );
    }

    // Log successful product deletion
    try {
      await auditHelper.logProductAction(
        'delete',
        adminUserId,
        adminUserEmail,
        product_id,
        productData.product_name,
        {
          status: 'success',
          old_values: productData,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            product_id,
            product_name: productData.product_name,
            product_store: productData.product_store,
            gallery_items_deleted: productData.product_gallery ? productData.product_gallery.length : 0,
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful product deletion:', auditError);
    }

    return NextResponse.json(
      { success: true, data: delete_result.data, message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product deletion error:", error);
    
    // Log system error during product deletion
    try {
      await auditHelper.logProductAction(
        'delete',
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
