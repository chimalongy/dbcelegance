import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const body = await request.json();
    const { accessory_id, media_url, media_index } = body;

    if (!accessory_id || media_url === undefined || media_index === undefined) {
      return NextResponse.json(
        { success: false, message: "Accessory ID, media URL, and media index are required." },
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

    const currentGallery = accessoryExists.data.accessory_gallery || [];
    
    // Check if media index is valid
    if (media_index < 0 || media_index >= currentGallery.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid media index.",
        },
        { status: 400 }
      );
    }

    // Remove the item from gallery array
    const updatedGallery = currentGallery.filter((_, index) => index !== media_index);

    // Delete file from storage
    try {
      await storage.deleteFile(media_url);
    } catch (deleteError) {
      console.warn("Failed to delete file from storage:", deleteError);
      // Continue with database update even if file deletion fails
    }

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
        message: "Gallery item deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

