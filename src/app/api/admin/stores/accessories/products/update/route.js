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
    const accessory_name = formData.get("accessory_name");
    const accessory_description = formData.get("accessory_description");
    const accessory_category = parseInt(formData.get("accessory_category"));
    const accessory_price = parseFloat(formData.get("accessory_price"));
    const stock_quantity = parseInt(formData.get("stock_quantity"));
    const sku = formData.get("sku");
    const accessory_status = formData.get("accessory_status");
    const accessory_store = formData.get("accessory_store");

    // Extract all files (multiple uploads possible)
    const files = formData.getAll("accessory_gallery");

    if (!accessory_id || !accessory_name || !accessory_category || !accessory_price || !stock_quantity || !accessory_status || !accessory_store) {
      return NextResponse.json(
        { success: false, message: "All required fields are required." },
        { status: 400 }
      );
    }

    // Create table if not exists
    await TableCreator();

    // Check if product exists
    const productExists = await dbActions.getAccessoryProductById(accessory_id);
    if (!productExists.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory product not found.",
        },
        { status: 404 }
      );
    }

    // Check if accessory category exists
    let category_exist_result = await dbActions.getAccessoryCategoryById(accessory_category);

    if (!category_exist_result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory category does not exist.",
        },
        { status: 400 }
      );
    }

    // Prepare update fields
    const updateFields = {
      accessory_name,
      accessory_description: accessory_description || "",
      accessory_category,
      accessory_price,
      stock_quantity,
      sku: sku || null,
      accessory_status,
    };

    // Handle file uploads if provided
    if (files.length > 0) {
      const folderPath = `store/${accessory_store}/accessories/products/`;
      let gallery = [];

      for (const file of files) {
        if (file instanceof File) {
          const uploadResult = await storage.uploadFile(file, folderPath);
          if (uploadResult && uploadResult.path) {
            gallery.push({
              url: uploadResult.path,
              type: file.type.startsWith('video/') ? 'video' : 'image'
            });
          }
        }
      }

      if (gallery.length > 0) {
        updateFields.accessory_gallery = gallery;
      }
    }

    // Update product in database
    const updateResult = await dbActions.updateAccessoryProductFields(accessory_id, updateFields);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update accessory product.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updateResult.data,
        message: "Accessory product updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating accessory product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 