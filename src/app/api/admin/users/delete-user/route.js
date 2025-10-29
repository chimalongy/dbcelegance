import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';
import { auditHelper } from '@/app/lib/auditHelper';

export async function POST(request) {
    console.log("HITTING DELETE")
  const dbActions = new DBFunctions();


  try {
    const body = await request.json();
    const { id, admin_user, user_to_delete } = body;

    // Hardcoded password for now
    const password = 'dbc.new.user';

    console.log(`
      ID: ${id}
    
    `);

    // Validate input
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const delete_result = await dbActions.deleteUser(id);

    if (!delete_result.success) {
      // Log failed user deletion
      try {
        await auditHelper.logUserAction(
          'delete',
          admin_user?.id || null,
          admin_user?.email || null,
          'user',
          id,
          `User deletion attempt: ${user_to_delete?.first_name || 'Unknown'} ${user_to_delete?.last_name || 'User'}`,
          {
            status: 'failure',
            error_message: delete_result.error || 'User delete failed',
            old_values: user_to_delete || null,
            metadata: {
              attempt_type: 'user_deletion',
              target_user_id: id,
              target_user_email: user_to_delete?.email || null,
              target_user_role: user_to_delete?.role || null
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed user deletion:', auditError);
      }

      return NextResponse.json(
        { success: false, error: delete_result.error || 'user delete failed' },
        { status: 400 }
      );
    }

    // Log successful user deletion
    try {
      await auditHelper.logUserAction(
        'delete',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        id,
        `User deleted: ${user_to_delete?.first_name || 'Unknown'} ${user_to_delete?.last_name || 'User'}`,
        {
          status: 'success',
          old_values: user_to_delete || null,
          metadata: {
            deleted_user_id: id,
            deleted_user_email: user_to_delete?.email || null,
            deleted_user_role: user_to_delete?.role || null,
            deletion_timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful user deletion:', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        data: delete_result.data,
        message: 'Admin user deleted successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('admin user delete error:', error);
    
    // Log system error during user deletion
    try {
      await auditHelper.logUserAction(
        'delete',
        admin_user?.id || null,
        admin_user?.email || null,
        'user',
        id,
        `User deletion attempt: ${user_to_delete?.first_name || 'Unknown'} ${user_to_delete?.last_name || 'User'}`,
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          old_values: user_to_delete || null,
          metadata: {
            error_type: error.constructor.name,
            error_stack: error.stack,
            attempt_type: 'user_deletion',
            target_user_id: id,
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
