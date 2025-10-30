import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { group_id } = body;

    if (!group_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Group ID is required",
        },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();
    const result = await dbActions.deleteProductGroup(group_id);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to delete product group",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product group deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product group:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error."
      },
      { status: 500 }
    );
  }
}