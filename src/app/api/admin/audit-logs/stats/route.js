import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../utils/DB/TableCreator";

export async function GET(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const filters = {
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date')
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await dbActions.getAuditStats(filters);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Audit statistics retrieved successfully"
    });

  } catch (error) {
    console.error("Error getting audit stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

