import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";
import { sendEmail } from "../../../../../../utils/email/send_mail";
import { RegistrationOTP } from "../../../../../../utils/email/emailTemplates/registrationOtp";

export async function POST(request) {
  const dbActions = new DBFunctions();
  await TableCreator();

  try {
    const body = await request.json();
    const { firstName, duration, email, section, otp } = body;

    console.log("📥 Incoming Registration:", body);

    // ✅ Validate required fields
    if (!email || !section || !otp) {
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
        { success: false, error: "This email is registered." },
        { status: 400 }
      );
    }







    //let registrationOTP = new RegistrationOTP(otp, firstName, duration);
    const registrationOTP = new RegistrationOTP({
  otp: otp,
  name: firstName,
  expiresInMinutes: 15,
});

    let htmlTemplate = registrationOTP.getHtml();
    let textTemplate = registrationOTP.getText();
    console.log(textTemplate);
    let subject = "Welcome " + firstName;
    let payload = {
      to: email,
      subject,
      text: textTemplate,
      html: htmlTemplate,
    };
    let otpResult = await sendEmail(payload);

    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: "email not sent" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: otpResult?.data,
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
