import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // Get product details first
    const product_result = await dbActions.getProductById(product_id);
    if (!product_result.success) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const productData = product_result.data;

    // Delete product gallery images from storage if they exist
    if (productData.product_gallery && Array.isArray(productData.product_gallery)) {
      const folderPath = `store/${productData.product_store}/products/`;
      for (const galleryitem of productData.product_gallery) {
        await storage.deleteFile(folderPath, galleryitem.url);
      }
    }

    // Delete product from DB
    const delete_result = await dbActions.deleteProduct(product_id);
    if (!delete_result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete product." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: delete_result.data, message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
