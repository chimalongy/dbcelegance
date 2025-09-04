// app/api/admin/stores/products/add_product_gallery_item/route.js
import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();
    const product_id = formData.get("product_id");
    const file = formData.get("product_gallery");

    if (!product_id || !file) {
      return NextResponse.json(
        { success: false, message: "Missing product_id or file" },
        { status: 400 }
      );
    }

    // Fetch product
    const product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const productData = product_result.data;

    // Upload file
    const folderPath = `store/${productData.product_store}/products/`;
    const uploadResult = await storage.uploadFile(file, folderPath);

    if (!uploadResult || !uploadResult.path) {
      return NextResponse.json(
        { success: false, message: `Failed to upload file: ${file.name}` },
        { status: 500 }
      );
    }

    console.log ("FILE UPLOADED :"+ uploadResult.path)

    // Update gallery in DB
    const product_gallery = productData.product_gallery || [];
    console.log("OLD PRODUCT GALLERY")
    console.log(productData)
    product_gallery.push({
      url: uploadResult.path,
      type: file.type.startsWith("image/") ? "image" : "video",
    });

    console.log("NEW PRODUCT GALLERY")
console.log(productData)

    const result = await dbActions.updateProductFields(product_id, {
      product_gallery,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Product update failed." },
        { status: 400 }
      );
    }


    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Product gallery updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product gallery item:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
