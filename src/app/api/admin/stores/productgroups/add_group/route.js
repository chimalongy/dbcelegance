import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { group_name, group_description, group_status, group_store, group_items } = body;

    if (!group_name || !group_store) {
      return NextResponse.json(
        {
          success: false,
          message: "Group name and store are required",
          data: null,
        },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();
    const result = await dbActions.createProductGroup({
      group_name,
      group_description: group_description || "",
      group_status: group_status || "active",
      group_store,
      group_items: group_items || []
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create product group",
          data: null,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Product group created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product group:", error);
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