import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';
import { auditHelper } from '@/app/lib/auditHelper';

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const body = await request.json();
    console.log(body)
    const { id, first_name, last_name, email, role, status, accessiblePages, admin_user, old_user_data } = body;

  
    console.log(`
      FIRSTNAME: ${first_name}
      LASTNAME: ${last_name}
      EMAIL: ${email}
      ROLE: ${role}
      STATUS:${status}
    `);

    // Validate input
    if (id,!first_name || !last_name || !email || !role || !status ||!accessiblePages) {
      return NextResponse.json(
        { success: false, error_message: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error_message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const update_result = await dbActions.updateUserData(id,{
      first_name,
      last_name,
      email,
      role,
      status,
      accessiblepages:JSON.stringify(accessiblePages)
    
    });

    if (!update_result.success) {
      // Log failed user update
      try {
        await auditHelper.logUserAction(
          'update',
          admin_user?.id || null,
          admin_user?.email || null,
          'user',
          id,
          `User update attempt: ${first_name} ${last_name}`,
          {
            status: 'failure',
            error_message: update_result.error || 'User update failed',
            old_values: old_user_data || null,
            new_values: {
              first_name,
              last_name,
              email,
              role,
              status,
              accessiblePages
            },
            metadata: {
              attempt_type: 'user_update',
              target_user_id: id,
              target_user_email: email,
              target_user_role: role
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed user update:', auditError);
      }

      return NextResponse.json(
        { success: false, error_message: update_result.error || 'User update failed' },
        { status: 400 }
      );
    }

    // Log successful user update
    try {
      await auditHelper.logUserAction(
        'update',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        id,
        `User updated: ${first_name} ${last_name}`,
        {
          status: 'success',
          old_values: old_user_data || null,
          new_values: {
            first_name,
            last_name,
            email,
            role,
            status,
            accessiblePages
          },
          metadata: {
            updated_user_id: id,
            updated_user_email: email,
            updated_user_role: role,
            update_timestamp: new Date().toISOString(),
            changes_made: {
              first_name: old_user_data?.first_name !== first_name,
              last_name: old_user_data?.last_name !== last_name,
              email: old_user_data?.email !== email,
              role: old_user_data?.role !== role,
              status: old_user_data?.status !== status,
              accessiblePages: JSON.stringify(old_user_data?.accessiblePages) !== JSON.stringify(accessiblePages)
            }
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful user update:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: update_result.data,
        message: 'User updated successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.log('User Update Error:', error);
    
    // Log system error during user update
    try {
      await auditHelper.logUserAction(
        'update',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        id,
        `User update attempt: ${first_name || 'Unknown'} ${last_name || 'User'}`,
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          old_values: old_user_data || null,
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
            attempt_type: 'user_update',
            target_user_id: id,
            timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for system error:', auditError);
    }
    
    return NextResponse.json(
      { success: false, error_message: 'Internal server error' },
      { status: 500 }
    );
  }
}
