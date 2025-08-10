import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";

export async function POST(request) {
  const dbActions = new DBFunctions();

  try {
    const body = await request.json();
    const { accessory_category_id } = body;

    if (!accessory_category_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory category ID is required.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

    // Check if category exists
    const categoryExists = await dbActions.getAccessoryCategoryById(accessory_category_id);
    if (!categoryExists.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Accessory category not found.",
        },
        { status: 404 }
      );
    }

    // Delete category from database
    const deleteResult = await dbActions.deleteAccessoryCategory(accessory_category_id);

    if (!deleteResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete accessory category.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deleteResult.data,
        message: "Accessory category deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting accessory category:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 