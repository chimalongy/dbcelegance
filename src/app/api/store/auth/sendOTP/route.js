import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";
import { sendEmail } from "../../../../../../utils/email/send_mail";
import { RegistrationOTP } from "../../../../../../utils/email/emailTemplates/registrationOtp";
import { ForgotPasswordOTP } from "../../../../../../utils/email/emailTemplates/forgotPasswordOtp";

export async function POST(request) {
  const dbActions = new DBFunctions();
  //await TableCreator();

  try {
    const body = await request.json();
    let { firstName, duration, email, section, otp } = body;

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

    let usercheck = await dbActions.findCustomerByEmail(email);

    if (section == "register" && usercheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is registered.",
          email_registered: true,
        },
        { status: 400 }
      );
    }
    if (section == "forgot-password" && !usercheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is not registered.",
          email_registered: true,
        },
        { status: 400 }
      );
    }

    let user = usercheck?.customer;
    firstName = user.first_name;

    //let registrationOTP = new RegistrationOTP(otp, firstName, duration);
    const registrationOTP = new RegistrationOTP({
      otp: otp,
      name: firstName,
      expiresInMinutes: duration,
    });

    let htmlTemplate;
    let textTemplate;

    let subject = "";

    let recent_products = await dbActions.getAllProducts();

    if (!recent_products.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not send email. Try again.",
          email_registered: true,
        },
        { status: 400 }
      );
    }

    const firstThree = recent_products.data.slice(0, 3);
    //console.log(firstThree)

    switch (section) {
      case "register":
        subject = "Welcome " + firstName;
        htmlTemplate = registrationOTP.getHtml(firstThree);
        textTemplate = registrationOTP.getText();

        break;

      case "forgot-password":
        subject = "Retrieve your Password.";
        let forgotPasswordOtp = new ForgotPasswordOTP(
         {
           otp : otp,
          name : firstName,
          expiresInMinutes : duration
         }
        );

        htmlTemplate = forgotPasswordOtp.getHtml(firstThree);
        textTemplate = forgotPasswordOtp.getText();
        break;
    }

    console.log(htmlTemplate);

    // if (section == "register") {
    //   htmlTemplate = RegistrationOTPHTML({
    //     otp: otp,
    //     name: firstName,
    //     expiresInMinutes: duration,
    //     recent_products: firstThree,
    //   });

    //   textTemplate = RegistrationOTPTEXT({
    //     name: firstName,
    //     otp,
    //     expiresInMinutes: duration,
    //   });
    // } else if (section == "forgot-password") {
    //   htmlTemplate = RegistrationOTPHTML({
    //     otp: otp,
    //     name: firstName,
    //     expiresInMinutes: duration,
    //     recent_products: firstThree,
    //   });

    //   textTemplate = RegistrationOTPTEXT({
    //     name: firstName,
    //     otp,
    //     expiresInMinutes: duration,
    //   });
    // }

    console.log("The subject is :" + subject);

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
