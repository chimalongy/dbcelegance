import { NextResponse } from "next/server";
import DBFunctions from "../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../utils/DB/TableCreator";
import bcrypt from "bcrypt";





export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const body = await request.json();
    const { email, password, last_login_ip, last_login_location ,} = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error_message: "All fields are required" },
        { status: 400 }
      );
    }
    if (!last_login_ip || !last_login_location) {
      return NextResponse.json(
        { success: false, error_message: "Could not retrive your location details." },
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

    const usersearchresult = await dbActions.findAdminUser(email);

    console.log(JSON.stringify(usersearchresult))

    if (!usersearchresult.success || !usersearchresult.data) {
      return NextResponse.json(
        { success: false, error_message: "Invalid email or password." },
        { status: 400 }
      );
    }

    const userdata = usersearchresult.data;

    const isPasswordValid = await bcrypt.compare(password, userdata.password);
    if (!isPasswordValid) {
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
    }

    // Check if it's a default password
    userdata.is_new_user = password === process.env.NEW_ADMIN_DEFAULT_PASSWORD;

    delete userdata.password
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
    return NextResponse.json(
      { success: false, error_message: "Internal server error" },
      { status: 500 }
    );
  }
}
