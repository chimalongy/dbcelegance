import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { group_id, group_name, group_description, group_status, group_items } = body;

    if (!group_id || !group_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Group ID and name are required",
          data: null,
        },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();
    const result = await dbActions.updateProductGroup(group_id, {
      group_name,
      group_description: group_description || "",
      group_status: group_status || "active",
      group_items: group_items || []
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to update product group",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Product group updated successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product group:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error.",
        data: null 
      },
      { status: 500 }
    );
  }
}