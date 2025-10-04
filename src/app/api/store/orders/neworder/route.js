import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";
import { OrderReceived } from "../../../../../../utils/email/emailTemplates/OrderRecieved.js";
import { sendEmail } from "../../../../../../utils/email/send_mail";

export async function POST(request) {
  console.log("📥 Incoming order request");
  //await TableCreator();

  try {
    const body = await request.json();
    //console.log("Request body:", body);

    const {
      cart,
      packaging,
      shipping_address,
      billing_address,
      customer_email,
      sub_total,
      total,
      geo_data,
      use_shipping_address,
      payment_status = "pending",
    } = body;

    if (!customer_email || !shipping_address || !cart || cart.length === 0) {
      console.log("❌ Missing required order information");
      return NextResponse.json(
        { success: false, message: "Missing required order information.", data: [] },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();

    const orderResult = await dbActions.createNewOrder({
      cart: JSON.stringify(cart),
      packaging,
      shipping_address,
      billing_address,
      customer_email,
      sub_total,
      total,
      geo_data,
      use_shipping_address,
      payment_status,
    });

    if (!orderResult.success) {
      console.error("❌ Failed to save order");
      return NextResponse.json(
        { success: false, message: "Failed to save order.", data: [] },
        { status: 500 }
      );
    }

    console.log ("ORDER RESULT")
   console.log (orderResult.data)

   // ✅ Generate email
   let order =orderResult
    const orderTemplate = new OrderReceived();
    const htmlTemplate = orderTemplate.getHtml(order.data);
    const textTemplate = orderTemplate.getText(order.data);

    console.log(htmlTemplate)
    console.log(textTemplate)

    const payload = {
      to: customer_email,
      subject: `Your DBC Elegance Order Confirmation - #${orderResult.order_id}`,
      text: textTemplate,
      html: htmlTemplate,
    };

    const emailSent = await sendEmail(payload);
    console.log("📧 Email sent result:", emailSent);

    return NextResponse.json(
      {
        success: true,
        data: orderResult.data,
        message: "✅ Order received successfully and email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error saving order:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
