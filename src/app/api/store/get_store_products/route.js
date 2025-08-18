import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../utils/DB/TableCreator";



export async function POST(request) {
  await TableCreator()
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
    const categories = await dbActions.getAllStoreProducts(store_name);

    if (!categories.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch products.",
          data: [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: categories.data,
        message: "products retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
