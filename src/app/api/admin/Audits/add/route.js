import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  
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
      status = 'success',
      error_message,
      metadata
    } = body;
    
    // Validate required fields
    if (!action_type || !action_category || !resource_type) {
      return NextResponse.json(
        { success: false, message: "action_type, action_category, and resource_type are required" },
        { status: 400 }
      );
    }
    
    // Insert audit log
    const insertQuery = `
      INSERT INTO ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'} (
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING audit_id, created_at
    `;
    
    const insertParams = [
      user_id || null,
      user_email || null,
      action_type,
      action_category,
      resource_type,
      resource_id || null,
      resource_name || null,
      old_values ? JSON.stringify(old_values) : null,
      new_values ? JSON.stringify(new_values) : null,
      ip_address || null,
      user_agent || null,
      location || null,
      session_id || null,
      status,
      error_message || null,
      metadata ? JSON.stringify(metadata) : null
    ];
    
    const result = await dbActions.pool.query(insertQuery, insertParams);
    
    return NextResponse.json({
      success: true,
      message: "Audit log created successfully",
      data: {
        audit_id: result.rows[0].audit_id,
        created_at: result.rows[0].created_at
      }
    });
    
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, message: "Failed to create audit log", error: error.message },
      { status: 500 }
    );
  }
}
