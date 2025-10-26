import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";

// Optional for dynamic routing behavior
export const dynamic = 'force-dynamic';

export async function POST(request) {

  try {
    const body = await request.json();
    const { product_store } = body;
      console.log(product_store)
    if (!product_store) {
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
    const products = await dbActions.getAllStoreProducts(product_store);

    if (!products.success) {
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
        data: products.data,
        message: "Products retrieved successfully.",
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
