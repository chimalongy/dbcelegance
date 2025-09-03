import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';
import { auditHelper } from '@/app/lib/auditHelper';

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const body = await request.json();
    const { first_name, last_name, email, role, status, accessiblePages, admin_user } = body;
    console.log(body)

    

    // console.log(`
    //   FIRSTNAME: ${first_name}
    //   LASTNAME: ${last_name}
    //   EMAIL: ${email}
    //   ROLE: ${role}
    // `);

    // Validate input
    if (!first_name || !last_name || !email || !role || !status |!accessiblePages) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
// Hardcoded password for now
    const password = process.env.NEW_ADMIN_DEFAULT_PASSWORD;
    const registrationResult = await dbActions.registerAdminUser({
      first_name,
      last_name,
      email,
      role,
      password,
      status,
      accessiblePages: JSON.stringify(accessiblePages)
    });

    if (!registrationResult.success) {
      // Log failed user creation
      try {
        await auditHelper.logUserAction(
          'create',
          admin_user?.id || null,
          admin_user?.email || null,
          'user',
          null, // No resource ID since creation failed
          'Admin user creation attempt',
          {
            status: 'failure',
            error_message: registrationResult.error || 'Registration failed',
            new_values: {
              first_name,
              last_name,
              email,
              role,
              status,
              accessiblePages
            },
            metadata: {
              attempt_type: 'admin_user_creation',
              target_role: role,
              target_status: status
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed user creation:', auditError);
      }

      return NextResponse.json(
        { success: false, error: registrationResult.error || 'Registration failed' },
        { status: 400 }
      );
    }

    // Log successful user creation
    try {
      await auditHelper.logUserAction(
        'create',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        registrationResult.data.id,
        `Admin user created: ${first_name} ${last_name}`,
        {
          status: 'success',
          new_values: {
            first_name,
            last_name,
            email,
            role,
            status,
            accessiblePages
          },
          metadata: {
            created_user_id: registrationResult.data.id,
            created_user_email: email,
            target_role: role,
            target_status: status,
            creation_timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful user creation:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: registrationResult.data,
        message: 'Admin user registered successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Log system error during user creation
    try {
      await auditHelper.logUserAction(
        'create',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        null, // No resource ID since creation failed
        'Admin user creation attempt',
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          new_values: {
            first_name,
            last_name,
            email,
            role,
            status,
            accessiblePages
          },
          metadata: {
            error_type: error.constructor.name,
            error_stack: error.stack,
            attempt_type: 'admin_user_creation',
            timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for system error:', auditError);
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
