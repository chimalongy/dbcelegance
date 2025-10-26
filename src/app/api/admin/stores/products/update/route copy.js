import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();
    const product_id = formData.get("product_id");
    const product_store = formData.get("product_store");
    const replaceGallery = formData.get("replace_gallery") === "true"; // boolean flag

    if (!product_id || !product_store) {
      return NextResponse.json(
        { success: false, message: "Product ID and store are required." },
        { status: 400 }
      );
    }

    // Get current product
    let product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    let previousGallery = [];
    try {
      previousGallery = JSON.parse(product_result.data.product_gallery || "[]");
    } catch {
      previousGallery = [];
    }

    const updateData = {};
    const files = formData.getAll("product_gallery"); // multiple uploads possible
    const folderPath = `store/${product_store}/products/`;

    let updatedGallery = [];

    if (replaceGallery && files.length > 0) {
      // Replace mode → delete old files, start fresh
      for (const oldFile of previousGallery) {
        await storage.deleteFile(folderPath, oldFile.url);
      }
      updatedGallery = [];
    } else {
      // Add mode → start with old gallery
      updatedGallery = [...previousGallery];
    }

    // Upload new files (if any)
    if (files.length > 0) {
      for (const file of files) {
        if (!(file instanceof File)) continue;

        const uploadResult = await storage.uploadFile(file, folderPath);
        if (!uploadResult?.path) {
          return NextResponse.json(
            { success: false, message: `Failed to upload file: ${file.name}` },
            { status: 500 }
          );
        }

        updatedGallery.push({
          url: uploadResult.path,
          type: file.type.startsWith("image/") ? "image" : "video"
        });
      }
    }

    // Always save updated gallery
    updateData.product_gallery = updatedGallery;

    // Update other fields
    for (const [key, value] of formData.entries()) {
      if (["product_id", "product_gallery", "replace_gallery"].includes(key)) continue;
      updateData[key] = value;
    }

  

    const result = await dbActions.updateProductFields(product_id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Product update failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "Product updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
