import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';
import { auditHelper } from '@/app/lib/auditHelper';

export async function GET(request) {
  const dbActions = new DBFunctions();


  try {
    // Extract admin user info from query parameters
    const { searchParams } = new URL(request.url);
    const admin_user_id = searchParams.get('admin_user_id');
    const admin_user_email = searchParams.get('admin_user_email');
    
    const result = await dbActions.getAllUsers();

    if (!result.success) {
      // Log failed user list retrieval
      try {
        await auditHelper.logUserAction(
          'view',
          admin_user_id || null,
          admin_user_email || null,
          'user',
          null, // No specific user resource
          'User list retrieval attempt',
          {
            status: 'failure',
            error_message: result.error || 'Failed to retrieve users',
            metadata: {
              attempt_type: 'user_list_retrieval',
              timestamp: new Date().toISOString()
            }
          }
        );
      } catch (auditError) {
        console.error('Failed to create audit log for failed user list retrieval:', auditError);
      }

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Log successful user list retrieval
    try {
      await auditHelper.logUserAction(
        'view',
        admin_user_id || null,
        admin_user_email || null,
        'user',
        null, // No specific user resource
        'User list retrieved successfully',
        {
          status: 'success',
          metadata: {
            users_count: result.data.length,
            retrieval_timestamp: new Date().toISOString()
          }
        }
      );
    } catch (auditError) {
      console.error('Failed to create audit log for successful user list retrieval:', auditError);
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    
    // Log system error during user list retrieval
    try {
      await auditHelper.logUserAction(
        'view',
        admin_user_id || null,
        admin_user_email || null,
        'user',
        null, // No specific user resource
        'User list retrieval attempt',
        {
          status: 'failure',
          error_message: `System error: ${error.message}`,
          metadata: {
            error_type: error.constructor.name,
            error_stack: error.stack,
            attempt_type: 'user_list_retrieval',
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