import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";

import bcrypt from "bcrypt";

// Helper function to create audit logs using DBFunctions
async function createAuditLog(auditData, dbActions) {
  try {
    // Prepare the data for DBFunctions.createAuditLog
    const auditLogData = {
      ...auditData,
      old_values: auditData.old_values ? JSON.stringify(auditData.old_values) : null,
      new_values: auditData.new_values ? JSON.stringify(auditData.new_values) : null,
      metadata: auditData.metadata ? JSON.stringify(auditData.metadata) : null
    };
    
    const result = await dbActions.createAuditLog(auditLogData);
    return result;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request) {
 
  const dbActions = new DBFunctions();

  try {
    const body = await request.json();
    const { email, password, last_login_ip, last_login_location, user_agent } = body;

    // Validate input
    if (!email || !password) {
      // Log failed login attempt - missing fields
      await createAuditLog({
        user_email: email || 'unknown',
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_name: 'Login attempt',
        status: 'failure',
        error_message: 'Missing required fields (email or password)',
        ip_address: last_login_ip || 'unknown',
        location: last_login_location || 'unknown',
        user_agent: user_agent || 'unknown',
        metadata: { 
          attempt_type: 'validation_failure',
          missing_fields: {
            email: !email,
            password: !password
          }
        }
      }, dbActions);

      return NextResponse.json(
        { success: false, error_message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!last_login_ip || !last_login_location) {
      // Log failed login attempt - missing location details
      await createAuditLog({
        user_email: email,
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_name: 'Login attempt',
        status: 'failure',
        error_message: 'Could not retrieve location details',
        ip_address: last_login_ip || 'unknown',
        location: last_login_location || 'unknown',
        user_agent: user_agent || 'unknown',
        metadata: { 
          attempt_type: 'location_failure',
          missing_location: {
            ip: !last_login_ip,
            location: !last_login_location
          }
        }
      }, dbActions);

      return NextResponse.json(
        { success: false, error_message: "Could not retrive your location details." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Log failed login attempt - invalid email format
      await createAuditLog({
        user_email: email,
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_name: 'Login attempt',
        status: 'failure',
        error_message: 'Invalid email format',
        ip_address: last_login_ip,
        location: last_login_location,
        user_agent: user_agent || 'unknown',
        metadata: { 
          attempt_type: 'validation_failure',
          validation_error: 'invalid_email_format',
          email_provided: email
        }
      }, dbActions);

      return NextResponse.json(
        { success: false, error_message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log login attempt start
    await createAuditLog({
      user_email: email,
      action_type: 'login',
      action_category: 'system_management',
      resource_type: 'user',
      resource_name: 'Login attempt',
      status: 'success',
      ip_address: last_login_ip,
      location: last_login_location,
      user_agent: user_agent || 'unknown',
      metadata: { 
        attempt_type: 'started',
        timestamp: new Date().toISOString()
      }
    }, dbActions);

    const usersearchresult = await dbActions.findAdminUser(email);

    if (!usersearchresult.success || !usersearchresult.data) {
      // Log failed login attempt - user not found
      await createAuditLog({
        user_email: email,
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_name: 'Login attempt',
        status: 'failure',
        error_message: 'User not found',
        ip_address: last_login_ip,
        location: last_login_location,
        user_agent: user_agent || 'unknown',
        metadata: { 
          attempt_type: 'user_not_found',
          email_searched: email,
          search_result: usersearchresult
        }
      }, dbActions);

      return NextResponse.json(
        { success: false, error_message: "Invalid email or password." },
        { status: 400 }
      );
    }

    const userdata = usersearchresult.data;

    const isPasswordValid = await bcrypt.compare(password, userdata.password);
    if (!isPasswordValid) {
      // Log failed login attempt - invalid password
      await createAuditLog({
        user_id: userdata.id,
        user_email: email,
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_id: userdata.id,
        resource_name: `Login attempt for user: ${userdata.first_name} ${userdata.last_name}`,
        status: 'failure',
        error_message: 'Invalid password',
        ip_address: last_login_ip,
        location: last_login_location,
        user_agent: user_agent || 'unknown',
        metadata: { 
          attempt_type: 'invalid_password',
          user_id: userdata.id,
          user_name: `${userdata.first_name} ${userdata.last_name}`,
          user_role: userdata.role
        }
      }, dbActions);

      return NextResponse.json(
        { success: false, error_message: "Invalid email or password." },
        { status: 400 }
      );
    }

    // Update login information in database
    const loginUpdateResult = await dbActions.updateAdminUserLoginInfo(userdata.id, {
      last_login_ip: last_login_ip,
      last_login_location: last_login_location
    });

    if (!loginUpdateResult.success) {
      console.error("Failed to update login info:", loginUpdateResult.error);
      
      // Log the update failure but don't block the login
      await createAuditLog({
        user_id: userdata.id,
        user_email: email,
        action_type: 'update',
        action_category: 'system_management',
        resource_type: 'user',
        resource_id: userdata.id,
        resource_name: `Login info update for user: ${userdata.first_name} ${userdata.last_name}`,
        status: 'failure',
        error_message: `Failed to update login info: ${loginUpdateResult.error}`,
        ip_address: last_login_ip,
        location: last_login_location,
        user_agent: user_agent || 'unknown',
        metadata: { 
          update_type: 'login_info',
          error: loginUpdateResult.error,
          user_id: userdata.id,
          user_name: `${userdata.first_name} ${userdata.last_name}`
        }
      }, dbActions);
    }

    // Check if it's a default password
    const isDefaultPassword = password === process.env.NEW_ADMIN_DEFAULT_PASSWORD;
    userdata.is_new_user = isDefaultPassword;

    // Log successful login
    await createAuditLog({
      user_id: userdata.id,
      user_email: email,
      action_type: 'login',
      action_category: 'system_management',
      resource_type: 'user',
      resource_id: userdata.id,
      resource_name: `Successful login for user: ${userdata.first_name} ${userdata.last_name}`,
      status: 'success',
      ip_address: last_login_ip,
      location: last_login_location,
      user_agent: user_agent || 'unknown',
      metadata: { 
        attempt_type: 'successful',
        user_id: userdata.id,
        user_name: `${userdata.first_name} ${userdata.last_name}`,
        user_role: userdata.role,
        is_default_password: isDefaultPassword,
        login_timestamp: new Date().toISOString()
      }
    }, dbActions);

    delete userdata.password;
    return NextResponse.json(
      {
        success: true,
        data: userdata,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("User Login Error:", error);
    
    // Log system error during login
    try {
      const body = await request.json().catch(() => ({}));
      await createAuditLog({
        user_email: body.email || 'unknown',
        action_type: 'login',
        action_category: 'system_management',
        resource_type: 'user',
        resource_name: 'Login attempt',
        status: 'failure',
        error_message: `System error: ${error.message}`,
        ip_address: body.last_login_ip || 'unknown',
        location: body.last_login_location || 'unknown',
        user_agent: body.user_agent || 'unknown',
        metadata: { 
          attempt_type: 'system_error',
          error_type: error.constructor.name,
          error_stack: error.stack,
          timestamp: new Date().toISOString()
        }
      }, dbActions);
    } catch (auditError) {
      console.error('Failed to create audit log for system error:', auditError);
    }

    return NextResponse.json(
      { success: false, error_message: "Internal server error" },
      { status: 500 }
    );
  }
}
