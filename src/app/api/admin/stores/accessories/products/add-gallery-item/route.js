import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const accessory_id = formData.get("accessory_id");
    const file = formData.get("accessory_gallery");

    if (!accessory_id || !file) {
      return NextResponse.json(
        { success: false, message: "Accessory ID and file are required." },
        { status: 400 }
      );
    }

    // Create table if not exists
  

    // Check if accessory exists
    const accessoryExists = await dbActions.getAccessoryProductById(accessory_id);
    if (!accessoryExists.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory product not found.",
        },
        { status: 404 }
      );
    }

    // Upload file
    const folderPath = `store/${accessoryExists.data.accessory_store}/accessories/products/`;
    const uploadResult = await storage.uploadFile(file, folderPath);
    
    if (!uploadResult || !uploadResult.path) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload file.",
        },
        { status: 500 }
      );
    }

    // Add to gallery
    const newGalleryItem = {
      url: uploadResult.path,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    };

    const currentGallery = accessoryExists.data.accessory_gallery || [];
    const updatedGallery = [...currentGallery, newGalleryItem];

    // Update accessory with new gallery
    const updateResult = await dbActions.updateAccessoryGallery(accessory_id, updatedGallery);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update accessory gallery.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { gallery: updatedGallery },
        message: "Gallery item added successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding gallery item:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

