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
    const accessory_category_raw = formData.get("accessory_category");
    const accessory_price_raw = formData.get("accessory_price");
    const stock_quantity_raw = formData.get("stock_quantity");
    const sku = formData.get("sku");
    const accessory_status = formData.get("accessory_status");
    const accessory_store = formData.get("accessory_store");
    const accessory_sizes_raw = formData.get("accessory_sizes");

    // Extract all files (multiple uploads possible)
    const files = formData.getAll("accessory_gallery");

    // Basic requirement: we need an id to update something
    if (!accessory_id) {
      return NextResponse.json(
        { success: false, message: "accessory_id is required." },
        { status: 400 }
      );
    }

    // Create table if not exists
  

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

    // Conditionally validate category if provided
    let accessory_category;
    if (accessory_category_raw !== null && accessory_category_raw !== undefined && String(accessory_category_raw).trim() !== "") {
      accessory_category = parseInt(accessory_category_raw);
      if (Number.isNaN(accessory_category)) {
        return NextResponse.json(
          { success: false, message: "Invalid accessory_category." },
          { status: 400 }
        );
      }
      const category_exist_result = await dbActions.getAccessoryCategoryById(accessory_category);
      if (!category_exist_result.success) {
        return NextResponse.json(
          { success: false, message: "Accessory category does not exist." },
          { status: 400 }
        );
      }
    }

    // Prepare update fields
    const updateFields = {};
    if (accessory_name !== null && accessory_name !== undefined) updateFields.accessory_name = accessory_name;
    if (accessory_description !== null && accessory_description !== undefined) updateFields.accessory_description = accessory_description || "";
    if (accessory_category !== undefined) updateFields.accessory_category = accessory_category;

    if (accessory_price_raw !== null && accessory_price_raw !== undefined && String(accessory_price_raw).trim() !== "") {
      const accessory_price = parseFloat(accessory_price_raw);
      if (Number.isNaN(accessory_price)) {
        return NextResponse.json(
          { success: false, message: "Invalid accessory_price." },
          { status: 400 }
        );
      }
      updateFields.accessory_price = accessory_price;
    }

    if (stock_quantity_raw !== null && stock_quantity_raw !== undefined && String(stock_quantity_raw).trim() !== "") {
      const stock_quantity = parseInt(stock_quantity_raw);
      if (Number.isNaN(stock_quantity)) {
        return NextResponse.json(
          { success: false, message: "Invalid stock_quantity." },
          { status: 400 }
        );
      }
      updateFields.stock_quantity = stock_quantity;
    }

    if (sku !== null && sku !== undefined) updateFields.sku = sku || null;
    if (accessory_status !== null && accessory_status !== undefined) updateFields.accessory_status = accessory_status;

    // Parse and include accessory_sizes if provided
    if (accessory_sizes_raw !== null && accessory_sizes_raw !== undefined) {
      try {
        const sizesParsed = typeof accessory_sizes_raw === "string" ? JSON.parse(accessory_sizes_raw) : accessory_sizes_raw;
        if (!Array.isArray(sizesParsed)) {
          return NextResponse.json(
            { success: false, message: "accessory_sizes must be an array." },
            { status: 400 }
          );
        }
        updateFields.accessory_sizes = sizesParsed;
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid accessory_sizes format." },
          { status: 400 }
        );
      }
    }

    // Handle file uploads if provided
    if (files.length > 0) {
      if (!accessory_store) {
        return NextResponse.json(
          { success: false, message: "accessory_store is required when uploading files." },
          { status: 400 }
        );
      }
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

    // Ensure we have at least one field to update
    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update fields provided." },
        { status: 400 }
      );
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