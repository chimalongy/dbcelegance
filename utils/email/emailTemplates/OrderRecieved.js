// emailTemplates/OrderReceived.js
import { EmailStyles } from "../emailStyles";

export class OrderReceived {
  getHtml(order) {
    // console.log("recent_products");
    // console.log(order);
    const productCards = JSON.parse(order.cart)
      .map((p) => {
        let product_type = p.product_id ? "product" : "accessory";
        const imageUrl =
          product_type == "product"
            ? p.product_gallery?.[0]?.url
            : p.accessory_gallery?.[0]?.url || "";
        const name =
          product_type == "product"
            ? p.product_name
            : p.accessory_name || "Untitled Product";
        return `
      <td align="center" style="padding: 0 8px;">
        <a href="#" style="text-decoration:none; color:#111;">
          <img src="${imageUrl}" alt="${name}" width="160" style="width:100%; max-width:160px; height:"200"; border:1px solid #eee;  display:block;"/>
          <p style="margin:8px 0 0 0; font-size:14px; color:#111; font-weight:500;">${name}</p>
        </a>
      </td>
    `;
      })
      .join("");

    return `<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your DBC Elegance Order</title>
  <style>
    ${EmailStyles}
  </style>
</head>
<body style="margin:0; padding:0; background:#fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color:#111;">

  <!-- Hidden preview text -->
  <span style="display:none!important; visibility:hidden; mso-hide:all; font-size:1px; color:#fff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    Your order has been received and is being prepared with care.
  </span>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#fff; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; margin:0 auto;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <div style="font-weight:700; font-size:30px; letter-spacing:2px; text-transform:uppercase; color:#000;">
                DBC Elegance
              </div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <h2 style="margin:0; font-size:22px; font-weight:600; text-transform:uppercase;">Your Order Has Been Received</h2>
              <p style="margin:16px 0; font-size:14px; color:#444; line-height:1.8;">
                Dear ${order.shipping_address.firstName},<br/><br/>
                Thank you for choosing <strong>DBC Elegance</strong>. Your order has been received and is now being carefully prepared. 
                <br/><br/>
                We appreciate your trust in our craftsmanship. Below you’ll find a summary of your selected items.
              </p>
              
              <!-- Order ID Box -->
              <div style="font-size:24px; font-weight:700; letter-spacing:4px; padding:14px 26px; border:1px dashed #d6d6d6; border-radius:12px; background:#fafafa; color:#111; display:inline-block; margin-top:12px;">
                Order #${order.order_id}
              </div>
            </td>
          </tr>

          <!-- Products Section -->
          <tr>
            <td align="center" style="padding: 32px 20px 20px 20px; border-top:1px solid #eee;">
              <h3 style="margin:0 0 12px 0; font-size:18px; font-weight:600;">Your Selected Pieces</h3>
              <p style="margin:0 0 20px 0; font-size:13px; color:#666;">An elegant selection curated for you:</p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  ${productCards}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Closing Message -->
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                Once your order is shipped, you’ll receive a confirmation email with tracking details.<br/>
                We look forward to delighting you with your DBC Elegance experience.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 20px;">
              <p style="margin:0; font-size:12px; color:#999;">
                © ${new Date().getFullYear()} DBC Elegance. All Rights Reserved.<br/>
                For assistance, please contact us at 
                <a href="mailto:${
                  process.env.BUSSINESS_SUPPORT_EMAIL
                }" style="color:#999; text-decoration:underline;">
                  ${process.env.BUSSINESS_SUPPORT_EMAIL}
                </a>.
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

  getText(order) {
    return `DBC Elegance — Order Confirmation

Dear ${order.shipping_address.firstName},

Thank you for your purchase. Your order (#${order.order_id}) has been received and is being prepared with utmost care.

You’ll receive another email as soon as your order ships.

For assistance, contact us at ${process.env.BUSSINESS_SUPPORT_EMAIL}.

Warm regards,  
The DBC Elegance Team`;
  }
}
