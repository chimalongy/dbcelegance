import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../utils/DB/TableCreator";

// Optional for dynamic routing behavior
export const dynamic = 'force-dynamic';

export async function POST(request) {
//await TableCreator()
  try {
    const body = await request.json();
    const { store_name } = body;
    
    console.log("Fetching product groups for store:", store_name);

    if (!store_name) {
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
    const groups = await dbActions.getAllStoreProductGroups(store_name);

    if (!groups.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch product groups.",
          data: [],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: groups.data,
        message: "Product groups retrieved successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product groups:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error.",
        data: [] 
      },
      { status: 500 }
    );
  }
}