import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log("Hitting update")
  const dbActions = new DBFunctions();

  try {
    const formData = await request.formData();
    const product_id = formData.get("product_id");
    const product_store = formData.get("product_store");

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

    const updateData = {};

    // Collect all fields except product_id and gallery fields
    for (const [key, value] of formData.entries()) {
      if (["product_id", "product_gallery", "replace_gallery"].includes(key)) continue;
      updateData[key] = value;
    }

    await TableCreator();

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
