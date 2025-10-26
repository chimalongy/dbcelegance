import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const accessory_name = formData.get("accessory_name");
    const accessory_description = formData.get("accessory_description");
    const accessory_category = parseInt(formData.get("accessory_category"));
    const accessory_sizes = formData.get("accessory_sizes");
    const accessory_status = formData.get("accessory_status");
    const accessory_store = formData.get("accessory_store");

    // Extract all files (multiple uploads possible)
    const files = formData.getAll("accessory_gallery");

    if (!accessory_name || !accessory_category || !accessory_status || !accessory_store) {
      return NextResponse.json(
        { success: false, message: "All required fields are required." },
        { status: 400 }
      );
    }

    // Parse sizes data
    let sizes = [];
    if (accessory_sizes) {
      try {
        sizes = JSON.parse(accessory_sizes);
        if (!Array.isArray(sizes)) {
          throw new Error("Sizes must be an array");
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Invalid sizes data format." },
          { status: 400 }
        );
      }
    }

    // Create table if not exists
  

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

    // Check if product with same name exists
    let product_exist_result = await dbActions.getAccessoryProductByName(accessory_name, accessory_store);

    if (product_exist_result.success && product_exist_result.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "An accessory product with the same name already exists.",
        },
        { status: 400 }
      );
    }

    // Upload files and prepare gallery
    const folderPath = `store/${accessory_store}/accessories/products/`;
    let gallery = [];

    if (files.length > 0) {
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
    }

    // Create product in database
    const product_data = await dbActions.createAccessoryProduct({
      accessory_name,
      accessory_description: accessory_description || "",
      accessory_category,
      accessory_sizes: sizes,
      accessory_status,
      accessory_gallery: gallery,
      accessory_store,
    });

    if (!product_data.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create accessory product.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product_data.data,
        message: "Accessory product created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating accessory product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 