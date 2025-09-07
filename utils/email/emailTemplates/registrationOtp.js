// emailTemplates/OtpTemplate.js
import { EmailStyles } from "../emailStyles";

export class RegistrationOTP {
  constructor({ otp = "123456", name = "Customer", expiresInMinutes = 30 } = {}) {
    this.otp = otp;
    this.name = name || "Customer";
    this.expiresInMinutes = expiresInMinutes;
  }

  getHtml() {
    return `<!DOCTYPE html>
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your DBC Elegance OTP</title>
  <style>
    ${EmailStyles}
  </style>
</head>
<body style="margin:0; padding:0; background:#f6f7f9; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111;">
  <!-- Hidden preview text -->
  <span style="display:none!important; visibility:hidden; mso-hide:all; font-size:1px; color:#fff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    Your DBC Elegance verification code is ${this.otp}. It expires in ${this.expiresInMinutes} minutes.
  </span>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="wrapper" style="background:#f6f7f9; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; margin:0 auto;">
          <!-- Logo/brand -->
          <tr>
            <td align="center" style="padding: 8px 20px 20px 20px;">
              <div style="font-weight:700; letter-spacing:0.5px; font-size:20px;">
                <span style="display:inline-block; padding:8px 12px; border:1px solid #222; border-radius:999px;">DBC&nbsp;Elegance</span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="card" style="background:#ffffff; border:1px solid #eee; border-radius:14px; overflow:hidden;">
                <tr>
                  <td style="padding:28px 24px 8px 24px;">
                    <h1 style="margin:0 0 8px 0; font-size:22px; line-height:1.3;">Verify your email</h1>
                    <p style="margin:0; font-size:14px; color:#555;">
                      Hi ${this.name}, use the code below to complete your sign-in with <strong>DBC Elegance</strong>.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 16px 24px 6px 24px;">
                    <div style="
                      font-size:28px; font-weight:700; letter-spacing:6px;
                      padding:16px 20px; border:1px dashed #d6d6d6;
                      border-radius:12px; background:#fafafa; color:#111; display:inline-block;">
                      ${this.otp}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding: 6px 24px 16px 24px;">
                    <p style="margin:8px 0 0 0; font-size:13px; color:#666;">
                      This code expires in <strong>${this.expiresInMinutes} minutes</strong>.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 8px 24px 24px 24px;">
                    <p style="margin:0; font-size:13px; color:#666; line-height:1.6;">
                      Didn’t request this? You can safely ignore this email. For help, contact
                      <a href="mailto:support@dbcelegance.com" style="color:#111; text-decoration:underline;">support@dbcelegance.com</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:0 20px;">
              <p style="margin:0; font-size:12px; color:#8a8a8a;">
                © ${new Date().getFullYear()} DBC Elegance. All rights reserved.
              </p>
              <p style="margin:6px 0 0 0; font-size:12px; color:#9a9a9a;">
                If you’re having trouble, try entering the code manually in the app.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  getText() {
    return `DBC Elegance — Email Verification

Hi ${this.name},

Your verification code is: ${this.otp}
This code expires in ${this.expiresInMinutes} minutes.

If you didn’t request this, ignore this email.
Support: support@dbcelegance.com`;
  }
}
