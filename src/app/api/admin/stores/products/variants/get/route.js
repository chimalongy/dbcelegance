import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";

export async function GET(request) {
  const dbActions = new DBFunctions();


  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get("product_id");

    if (!product_id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // Get variants for the specified product
    const variantsResult = await dbActions.getProductVariants(product_id);
    
    return NextResponse.json(
      {
        success: true,
        data: variantsResult.data,
        message: "Variants fetched successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching variants:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 