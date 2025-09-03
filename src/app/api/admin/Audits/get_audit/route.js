import { NextResponse } from "next/server";
import pool from "../../../../../../utils/DB/DBConnect";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get parameters from request body
    const page = parseInt(body.page) || 1;
    const limit = parseInt(body.limit) || 50;
    const offset = (page - 1) * limit;
    
    // Filter parameters
    const actionType = body.action_type;
    const actionCategory = body.action_category;
    const resourceType = body.resource_type;
    const userId = body.user_id;
    const status = body.status;
    const searchTerm = body.search;
    const startDate = body.start_date;
    const endDate = body.end_date;
    
    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;
    
    if (actionType && actionType !== 'all') {
      paramCount++;
      whereConditions.push(`action_type = $${paramCount}`);
      queryParams.push(actionType);
    }
    
    if (actionCategory && actionCategory !== 'all') {
      paramCount++;
      whereConditions.push(`action_category = $${paramCount}`);
      queryParams.push(actionCategory);
    }
    
    if (resourceType && resourceType !== 'all') {
      paramCount++;
      whereConditions.push(`resource_type = $${paramCount}`);
      queryParams.push(resourceType);
    }
    
    if (userId && userId !== 'all') {
      paramCount++;
      whereConditions.push(`user_id = $${paramCount}`);
      queryParams.push(userId);
    }
    
    if (status && status !== 'all') {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      queryParams.push(status);
    }
    
    if (startDate) {
      paramCount++;
      whereConditions.push(`created_at >= $${paramCount}`);
      queryParams.push(startDate);
    }
    
    if (endDate) {
      paramCount++;
      whereConditions.push(`created_at <= $${paramCount}`);
      queryParams.push(endDate);
    }
    
    if (searchTerm) {
      paramCount++;
      whereConditions.push(`(
        user_email ILIKE $${paramCount} OR 
        resource_name ILIKE $${paramCount} OR 
        action_type ILIKE $${paramCount} OR
        resource_type ILIKE $${paramCount}
      )`);
      queryParams.push(`%${searchTerm}%`);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'}
      ${whereClause}
    `;
    
    const countResult = await pool.query(countQuery, queryParams);
    const totalCount = parseInt(countResult.rows[0].total);
    
    // Get audit logs with pagination
    const logsQuery = `
      SELECT 
        audit_id,
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
        metadata,
        created_at
      FROM ${process.env.DATABASE_AUDIT_LOGS_TABLE || 'audit_logs'}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    const logsParams = [...queryParams, limit, offset];
    const logsResult = await pool.query(logsQuery, logsParams);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data: logsResult.rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit: limit,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch audit logs", error: error.message },
      { status: 500 }
    );
  }
}
