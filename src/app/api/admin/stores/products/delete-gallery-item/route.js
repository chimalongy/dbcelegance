// app/api/admin/stores/products/delete_product_gallery_item/route.js
import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const body = await request.json();
    const { product_id, media_url } = body;

    if (!product_id || !media_url) {
      return NextResponse.json(
        { success: false, message: "Missing product_id or media_url" },
        { status: 400 }
      );
    }

    // Fetch product
    let product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const productData = product_result.data;

    // 1. Delete from storage
    const folderPath = `store/${productData.product_store}/products/`;
    const deletedFromStorage = await storage.deleteFile(folderPath, media_url);

    if (!deletedFromStorage.success) {
      return NextResponse.json(
        {
          success: false,
          message: deletedFromStorage.message,
        },
        { status: 400 }
      );
    }

    // 2. Update gallery field in DB
    let product_gallery = productData.product_gallery || [];
    let newproductgallery = product_gallery.filter(
      (gallery_item) => gallery_item.url !== media_url
    );

    let updateData = { product_gallery: newproductgallery };
    const result = await dbActions.updateProductFields(product_id, updateData);

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
        message: "Product updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product gallery item:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
