import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const body = await request.json();
    console.log(body)
    const { id, first_name, last_name, email, role, status,accessiblePages } = body;

  
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
      return NextResponse.json(
        { success: false, error_message: update_result.error || 'User update failed' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error_message: 'Internal server error' },
      { status: 500 }
    );
  }
}
