import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const accessory_category_id = formData.get("accessory_category_id");
    const accessory_category_name = formData.get("accessory_category_name");
    const accessory_category_status = formData.get("accessory_category_status");
    const accessory_category_store = formData.get("accessory_category_store");
    const file = formData.get("accessory_category_image");

    if (
      !accessory_category_id ||
      !accessory_category_name ||
      !accessory_category_status ||
      !accessory_category_store
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are missing.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
  

    // Check if category exists
    const categoryExists = await dbActions.getAccessoryCategoryById(accessory_category_id);
    if (!categoryExists.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory category not found.",
        },
        { status: 404 }
      );
    }

    // Prepare update fields
    const updateFields = {
      accessory_category_name,
      accessory_category_status,
    };

    // Handle image upload if provided
    if (file && file instanceof File) {
      const folderPath = `store/${accessory_category_store}/accessories/categories/`;
      const uploadResult = await storage.uploadFile(file, folderPath);

      if (!uploadResult || !uploadResult.path) {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to upload image.",
          },
          { status: 500 }
        );
      }

      updateFields.accessory_category_image = uploadResult.path;
    }

    // Update category in database
    const updateResult = await dbActions.updateAccessoryCategoryFields(accessory_category_id, updateFields);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update accessory category.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updateResult.data,
        message: "Accessory category updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating accessory category:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 