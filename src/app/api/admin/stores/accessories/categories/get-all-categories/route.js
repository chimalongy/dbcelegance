import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";

export async function POST(request) {

  
  try {
    const body = await request.json();
    const { accessory_category_store } = body;

    if (!accessory_category_store) {
      return NextResponse.json(
        {
          success: false,
          message: "Please specify the store",
          data: [],
        },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();
    const categories = await dbActions.getAllStoreAccessoryCategories(accessory_category_store);

    if (!categories.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch accessory categories.",
          data: [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: categories.data,
        message: "Accessory categories retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching accessory categories:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 