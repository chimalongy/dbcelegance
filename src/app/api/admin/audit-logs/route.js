import { NextResponse } from "next/server";
import DBFunctions from "../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../utils/DB/TableCreator";

export async function GET(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const filters = {
      user_email: searchParams.get('user_email'),
      action_type: searchParams.get('action_type'),
      action_category: searchParams.get('action_category'),
      resource_type: searchParams.get('resource_type'),
      status: searchParams.get('status'),
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      limit: parseInt(searchParams.get('limit')) || 50,
      offset: parseInt(searchParams.get('offset')) || 0
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === '') {
        delete filters[key];
      }
    });

    const result = await dbActions.getAuditLogs(filters);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Audit logs retrieved successfully"
    });

  } catch (error) {
    console.error("Error getting audit logs:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const body = await request.json();
    const {
      user_id,
      user_email,
      action_type,
      action_category,
      resource_type,
      resource_id,
      resource_name,
      old_values,
      new_values,
      ip_address,
      user_agent,
      location,
      session_id,
      status,
      error_message,
      metadata
    } = body;

    // Validate required fields
    if (!action_type || !action_category || !resource_type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const auditData = {
      user_id,
      user_email,
      action_type,
      action_category,
      resource_type,
      resource_id,
      resource_name,
      old_values,
      new_values,
      ip_address,
      user_agent,
      location,
      session_id,
      status: status || 'success',
      error_message,
      metadata
    };

    const result = await dbActions.createAuditLog(auditData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "Audit log created successfully"
    });

  } catch (error) {
    console.error("Error creating audit log:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

