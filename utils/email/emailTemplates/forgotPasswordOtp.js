// emailTemplates/ForgotPasswordOtpTemplate.js
import { EmailStyles } from "../emailStyles";

export class ForgotPasswordOTP {
  constructor({
    otp = "123456",
    name = "Customer",
    expiresInMinutes = 30,
  } = {}) {
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
  <title>Password Reset Code</title>
  <style>
    ${EmailStyles}
  </style>
</head>
<body style="margin:0; padding:0; background:#fff; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111;">
  <!-- Hidden preview text -->
  <span style="display:none!important; visibility:hidden; mso-hide:all; font-size:1px; color:#fff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    Your password reset code is ${this.otp}. It expires in ${this.expiresInMinutes} minutes.
  </span>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 16px 0;">
              <div style="font-weight:700; font-size:28px; letter-spacing:2px;">
                DBC Elegance
              </div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <h2 style="margin:0; font-size:20px; font-weight:600;">Password Reset Request</h2>
              <p style="margin:16px 0; font-size:14px; color:#444; line-height:1.6;">
                Dear ${this.name},<br/><br/>
                We received a request to reset your password.  
                Use the one-time passcode below to securely reset your password:
              </p>
              <!-- OTP Box -->
              <div style="font-size:26px; font-weight:700; letter-spacing:6px; padding:16px 28px; border:1px dashed #d6d6d6; border-radius:12px; background:#fafafa; color:#111; display:inline-block;">
                ${this.otp}
              </div>
              <p style="margin:16px 0 0; font-size:12px; color:#888;">
                This code expires in <strong>${this.expiresInMinutes} minutes</strong>.<br/>
                If you didn’t request a password reset, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="margin:0; font-size:12px; color:#999;">
                © ${new Date().getFullYear()} DBC Elegance. All rights reserved.<br/>
                Need help? Contact us at 
                <a href="mailto:support@dbcelegance.com" style="color:#999; text-decoration:underline;">support@dbcelegance.com</a>.
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
    return `DBC Elegance — Password Reset

Hi ${this.name},

Your password reset code is: ${this.otp}
This code expires in ${this.expiresInMinutes} minutes.

If you didn’t request this, please ignore this email.
Support: support@dbcelegance.com`;
  }
}
