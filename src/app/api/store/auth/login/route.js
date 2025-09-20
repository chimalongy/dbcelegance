import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import jwt from "jsonwebtoken"; // install: npm install jsonwebtoken
import bcrypt from "bcrypt";
import { createSession } from "../../../../../../utils/sessions";
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

    let customer = customerresult.customer;

    let ismatch = await bcrypt.compare(password, customer.password_hash);

    if (!ismatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    delete customer.password_hash
    let token = await createSession(customer.customer_id, customer.email);
    const response = NextResponse.json(
      { success: true, customer: customer },
      { status: 200 }
    );
    response.cookies.set("session", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60,
    });
    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
