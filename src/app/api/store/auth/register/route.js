import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      title,
      phone,
      fashionNews,
      // sharePreferences,
    } = body;

    console.log("📥 Incoming Registration:", body.userData);

    // ✅ Validate required fields
    if (!firstName || !lastName || !email || !password || !title || !phone) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // ✅ Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    let usercheck = await dbActions.findCustomerByEmail(email)

    if (usercheck.success){
         return NextResponse.json(
        { success: false, error: "user alrealy exist" },
        { status: 400 }
      );
    }


    // ✅ Password validation (same rules as frontend)
    const passwordValid =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@#$%^&*]/.test(password);

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Password does not meet requirements" },
        { status: 400 }
      );
    }

    // ✅ Store user in DB
    const registrationResult = await dbActions.registerCustomer({
      firstName,
      lastName,
      email,
      password, // ⚠️ In production: hash before storing
      title,
      phone,
      fashionNews,
      sharePreferences:false,
    });

    console.log(registrationResult)

    if (!registrationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: registrationResult.error || "Registration failed",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: registrationResult.data,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
