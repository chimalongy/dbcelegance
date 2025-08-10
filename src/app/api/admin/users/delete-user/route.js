import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';

export async function POST(request) {
    console.log("HITTING DELETE")
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const body = await request.json();
    const { id} = body;

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
      return NextResponse.json(
        { success: false, error: delete_result.error || 'user delete failed' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
