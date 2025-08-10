import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const accessory_category_name = formData.get("accessory_category_name");
    const accessory_category_status = formData.get("accessory_category_status");
    const accessory_category_store = formData.get("accessory_category_store");
    const file = formData.get("accessory_category_image");

    if (
      !accessory_category_name ||
      !accessory_category_status ||
      !accessory_category_store ||
      !file ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields including a valid image file are required.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    // Check if category exists
    let category_exist_result = await dbActions.getAccessoryCategoryByName(accessory_category_name, accessory_category_store);

    if (category_exist_result.success && category_exist_result.exists) {
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
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create accessory category.",
        },
        { status: 500 }
      );
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
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 