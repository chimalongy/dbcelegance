import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import jwt from "jsonwebtoken"; // install: npm install jsonwebtoken
import bcrypt from "bcrypt";
export async function POST(request) {
  const dbActions = new DBFunctions();

  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("📥 Incoming Login:", email);

    // ✅ Validate fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
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

    // ✅ Find customer
    const customerresult = await dbActions.findCustomerByEmail(email);
    if (!customerresult.success || !customerresult.customer) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Compare password (⚠️ Hashing recommended in production)

    let customer = customerresult.customer


    let ismatch = await bcrypt.compare(password,customer.password_hash)

    if (!ismatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: customer.customer_id, email:customer.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        token,
        customer: {
          id: customer.customer_id,
          firstName: customer.first_name,
          lastName: customer.last_name,
          email: customer.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
