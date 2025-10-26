import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";

export async function POST(request) {
  const dbActions = new DBFunctions();

  try {
    const body = await request.json();
    const { accessory_id } = body;

    if (!accessory_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory product ID is required.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
  

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

    // Delete product from database
    const deleteResult = await dbActions.deleteAccessoryProduct(accessory_id);

    if (!deleteResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete accessory product.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deleteResult.data,
        message: "Accessory product deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting accessory product:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 