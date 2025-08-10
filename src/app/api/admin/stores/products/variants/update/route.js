import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();
  await TableCreator();

  try {
    const formData = await request.formData();
    const variant_id = formData.get("variant_id");
    const product_id = formData.get("product_id");
    const product_store = formData.get("product_store");
    const sku = formData.get("sku");
    const variant_status = formData.get("variant_status");
    const replace_gallery = formData.get("replace_gallery") === "true";

    // Validate required fields
    if (!variant_id || !product_id || !product_store) {
      return NextResponse.json(
        { success: false, message: "Variant ID, product ID, and store are required." },
        { status: 400 }
      );
    }

    // Check if variant exists
    const variantResult = await dbActions.getVariantById(variant_id);
    if (!variantResult.success) {
      return NextResponse.json(
        { success: false, message: "Variant not found." },
        { status: 404 }
      );
    }

    const currentVariant = variantResult.data;

    // Check if SKU already exists for this product (excluding current variant)
    if (sku && sku !== currentVariant.sku) {
      const skuCheck = await dbActions.checkVariantSkuExists(sku, product_id, variant_id);
      if (skuCheck.success && skuCheck.exists) {
        return NextResponse.json(
          { success: false, message: "SKU already exists for this product." },
          { status: 400 }
        );
      }
    }

    // Handle file uploads for variant gallery
    const files = formData.getAll("variant_gallery");
    const folderPath = `store/${product_store}/variants/`;
    let updatedGallery = [];

    if (replace_gallery && files.length > 0) {
      // Replace mode: delete old files and upload new ones
      if (currentVariant.variant_gallery) {
        try {
          const oldGallery = JSON.parse(currentVariant.variant_gallery);
          for (const oldFile of oldGallery) {
            await storage.deleteFile(folderPath, oldFile.url);
          }
        } catch (e) {
          console.warn("Could not parse old gallery:", e);
        }
      }
      updatedGallery = [];
    } else {
      // Add mode: start with existing gallery
      try {
        updatedGallery = currentVariant.variant_gallery ? JSON.parse(currentVariant.variant_gallery) : [];
      } catch (e) {
        updatedGallery = [];
      }
    }

    // Upload new files
    for (const file of files) {
      if (!(file instanceof File)) continue;

      const uploadResult = await storage.uploadFile(file, folderPath);
      if (!uploadResult || !uploadResult.path) {
        return NextResponse.json(
          { success: false, message: `Failed to upload file: ${file.name}` },
          { status: 500 }
        );
      }

      updatedGallery.push({
        url: uploadResult.path,
        type: file.type.startsWith("image/") ? "image" : "video",
        name: file.name,
        size: file.size
      });
    }

    // Prepare update data
    const updateData = {};
    if (sku) updateData.sku = sku.trim();
    if (variant_status) updateData.variant_status = variant_status;
    if (files.length > 0 || replace_gallery) updateData.variant_gallery = updatedGallery;

    // Update variant in database
    const updateResult = await dbActions.updateVariant(variant_id, updateData);
    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, message: updateResult.message || "Failed to update variant." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updateResult.data,
        message: "Variant updated successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Variant update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 