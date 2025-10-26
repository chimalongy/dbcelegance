import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";




export async function POST(request) {

  try {
    const body = await request.json();
    const { store_name } = body;

    if (!store_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Please specify the store.",
          data: [],
        },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();
    const accessory_categories = await dbActions.getAllStoreAccessoryCategories(store_name);
  //  console.log("accessory_categories",accessory_categories);

    if (!accessory_categories.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch categories.",
          data: [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: accessory_categories.data,
        message: "Categories retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
