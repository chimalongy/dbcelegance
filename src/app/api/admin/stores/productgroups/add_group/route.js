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

    const group_name = formData.get("group_name");
    const group_description = formData.get("group_description");
    const group_status = formData.get("group_status");
    const group_store = formData.get("group_store");
    const group_items = formData.get("group_items");
    
    // Get admin user details from request headers
    const adminUserId = request.headers.get('x-admin-user-id');
    const adminUserEmail = request.headers.get('x-admin-user-email');
    const adminUserName = request.headers.get('x-admin-user-name');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Extract all gallery files
    const files = formData.getAll("group_gallery");

    if (!group_name || !group_store) {
    

      return NextResponse.json(
        { success: false, message: "Group name and store are required." },
        { status: 400 }
      );
    }

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

    // Upload gallery files and prepare gallery array
    const folderPath = `store/${group_store}/groups/`;
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
    const group_data = await dbActions.createProductGroup({
      group_name,
      group_description: group_description || "",
      group_status: group_status || "active",
      group_store,
      group_items: items,
      group_gallery: gallery
    });

    if (!group_data.success) {
      // Rollback uploaded files if DB insert fails
      for (const g of gallery) {
        await storage.deleteFile(folderPath, g.url);
      }
      
      // Log failed group creation
     
      return NextResponse.json(
        { success: false, message: "Group creation failed." },
        { status: 400 }
      );
    }

 
    return NextResponse.json(
      {
        success: true,
        data: group_data.data,
        message: "Product group created successfully."
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Group creation error:", error);
    
  
    
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}