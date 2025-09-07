import nodemailer from "nodemailer";
import { smtp_settings } from "./smtp_setup.js";

export async function sendEmail({ to, subject, text, html }) {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport(smtp_settings);

    // 2. Define email options
  const mailOptions = {
  from: `"${"DBC ELEGANCE"}" <${smtp_settings.auth.user}>`,
  to, // Recipient address
  subject,
  text, // Plain text body
  html, // HTML body
};

    // 3. Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
}
