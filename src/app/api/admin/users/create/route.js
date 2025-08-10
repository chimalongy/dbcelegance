import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const body = await request.json();
    const { first_name, last_name, email, role,status,accessiblePages  } = body;
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
      return NextResponse.json(
        { success: false, error: registrationResult.error || 'Registration failed' },
        { status: 400 }
      );
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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
