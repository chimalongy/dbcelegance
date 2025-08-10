import { NextResponse } from 'next/server';
import DBFunctions from '../../../../../../utils/DB/DBFunctions';
import { TableCreator } from '../../../../../../utils/DB/TableCreator';

export async function GET(request) {
  const dbActions = new DBFunctions();
  await TableCreator()

  try {
    const result = await dbActions.getAllUsers();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}