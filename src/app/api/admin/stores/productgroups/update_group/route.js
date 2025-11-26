import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";
import { auditHelper } from "@/app/lib/auditHelper";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const group_id = formData.get("group_id");
    const group_name = formData.get("group_name");
    const group_description = formData.get("group_description");
    const group_status = formData.get("group_status");
    const group_store = formData.get("group_store");
    const group_items = formData.get("group_items");
    const replace_gallery = formData.get("replace_gallery"); // Optional flag to replace gallery
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!group_id || !group_name || !group_store) {
      // Log failed group update attempt
      try {
        await auditHelper.logProductGroupAction(
          'update',
          adminUserId,
          adminUserEmail,
          group_id || null,
          group_name || 'unknown',
          {
            status: 'failure',
            error_message: 'Missing required fields for group update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'validation_failure',
              missing_fields: {
                group_id: !group_id,
                group_name: !group_name,
                group_store: !group_store
              },
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed group update:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Group ID, name, and store are required." },
        { status: 400 }
      );
    }

    // Get current group data
    let group_result = await dbActions.getProductGroupById(group_id);
    if (!group_result.success) {
      // Log failed group update attempt - group not found
      try {
        await auditHelper.logProductGroupAction(
          'update',
          adminUserId,
          adminUserEmail,
          group_id,
          group_name || 'unknown',
          {
            status: 'failure',
            error_message: 'Group not found for update',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              attempt_type: 'group_not_found',
              group_id,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for group not found:', auditError);
      }

      return NextResponse.json(
        { success: false, message: "Group not found." },
        { status: 404 }
      );
    }

    const originalGroupData = { ...group_result.data };

    // Parse and validate group items
    let items = [];
    if (group_items) {
      try {
        items = JSON.parse(group_items);
        if (!Array.isArray(items)) {
          return NextResponse.json(
            { success: false, message: "Invalid group items format." },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("Error parsing group items:", error);
        return NextResponse.json(
          { success: false, message: "Invalid group items data format." },
          { status: 400 }
        );
      }
    }

    // Handle gallery files
    const files = formData.getAll("group_gallery");
    let gallery = [...(originalGroupData.group_gallery || [])];

    // If replace_gallery flag is set, clear existing gallery
    if (replace_gallery === 'true') {
      // Delete existing gallery files from storage
      for (const file of originalGroupData.group_gallery || []) {
        if (file.url) {
          await storage.deleteFile(`store/${group_store}/groups/`, file.url);
        }
      }
      gallery = [];
    }

    // Upload new gallery files
    const folderPath = `store/${group_store}/groups/`;
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

    // Update group in database
    const updateData = {
      group_name,
      group_description: group_description || "",
      group_status: group_status || "active",
      group_items: items,
      group_gallery: gallery
    };

    const result = await dbActions.updateProductGroup(group_id, updateData);

    if (!result.success) {
      // Rollback uploaded files if DB update fails
      for (const file of files) {
        if (file instanceof File) {
          await storage.deleteFile(folderPath, file.name);
        }
      }
      
      // Log failed group update
      try {
        await auditHelper.logProductGroupAction(
          'update',
          adminUserId,
          adminUserEmail,
          group_id,
          group_name,
          {
            status: 'failure',
            error_message: result.message || 'Group update failed in database',
            ip_address: ipAddress,
            user_agent: userAgent,
            metadata: {
              group_id,
              group_name,
              gallery_count: gallery.length,
              items_count: items.length,
              admin_user_name: adminUserName
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed group update:', auditError);
      }
      
      return NextResponse.json(
        { success: false, message: result.message || "Group update failed." },
        { status: 400 }
      );
    }

    // Log successful group update
    try {
      await auditHelper.logProductGroupAction(
        'update',
        adminUserId,
        adminUserEmail,
        group_id,
        group_name,
        {
          status: 'success',
          old_values: originalGroupData,
          new_values: result.data,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            group_id,
            updated_fields: Object.keys(updateData),
            gallery_files_added: files.length,
            admin_user_name: adminUserName
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful group update:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Product group updated successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Group update error:", error);
    
    // Log system error during group update
    try {
      await auditHelper.logProductGroupAction(
        'update',
        adminUserId,
        adminUserEmail,
        group_id || null,
        group_name || 'unknown',
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