import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../utils/DB/TableCreator";
import bcrypt from "bcrypt";

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const body = await request.json();
    const {  email,
        oldPassword, // using the initial login password as old password
        newPassword} = body;

    // Validate input
    if (!email || !oldPassword ||!newPassword) {
      return NextResponse.json(
        { success: false, error_message: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error_message: "Invalid email format" },
        { status: 400 }
      );
    }

      const update_result = await dbActions.updateUserPassword(email,oldPassword,newPassword)

      if (!update_result.success){
        return NextResponse.json(
        { success: false, error_message: update_result.error },
        { status: 400 }
      );
      }



    return NextResponse.json(
      {
        success: true,
        
        message: "Your password has been updated. Please login.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Admin Password Update Error:", error);
    return NextResponse.json(
      { success: false, error_message: "Internal server error" },
      { status: 500 }
    );
  }
}
