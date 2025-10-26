import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";

export async function POST(request) {
  
    
  const dbactions = new DBFunctions();

  try {
    const allorders = await dbactions.getAllOrders();

    if (allorders.success) {
      return NextResponse.json(
        {
          success: true,
          data: allorders.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: allorders.error || "Failed to fetch orders",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Error in orders POST route:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
