import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";

export async function POST(request) {

  
  try {
    const body = await request.json();
    const { accessory_store } = body;

    if (!accessory_store) {
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
    const products = await dbActions.getAllStoreAccessoryProducts(accessory_store);

    if (!products.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch accessory products.",
          data: [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: products.data,
        message: "Accessory products retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching accessory products:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 