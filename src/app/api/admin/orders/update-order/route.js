import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";
import { OrderShipped } from "../../../../../../utils/email/emailTemplates/OrderShipped";
import { sendEmail } from "../../../../../../utils/email/send_mail";
import { OrderDelivered } from "../../../../../../utils/email/emailTemplates/OrderDelivered";
import { OrderCanceled } from "../../../../../../utils/email/emailTemplates/OrderCanceled";
import { OrderDelayed } from "../../../../../../utils/email/emailTemplates/OrderDelayed";

export async function POST(request) {
  console.log("📤 Incoming order update request");


  try {
    const body = await request.json();
    //console.log("Request body:", body);

    const { order_id, order_status } = body;

    if (!order_id) {
      console.log("❌ Missing order_id");
      return NextResponse.json(
        { success: false, message: "Missing order_id." },
        { status: 400 }
      );
    }

    const dbActions = new DBFunctions();

    // ✅ Update order in DB
    const updateResult = await dbActions.updateOrder(body);

    if (!updateResult.success) {
      console.error("❌ Failed to update order");
      return NextResponse.json(
        { success: false, message: "Failed to update order." },
        { status: 500 }
      );
    }

    if (order_status == "shipped") {
      //sendshipping email

      let ordershipped = new OrderShipped();
      const htmlTemplate = ordershipped.getHtml(updateResult.data);
      const textTemplate = ordershipped.getText(updateResult.data);

      console.log(htmlTemplate);
      console.log(textTemplate);

      const payload = {
        to: updateResult.data.customer_email,
        subject: `Your Order has been shipped!!!  - #${updateResult.data.order_id}`,
        text: textTemplate,
        html: htmlTemplate,
      };

      const emailSent = await sendEmail(payload);
      console.log("📧 Email sent result:", emailSent);
    } else if (order_status == "delivered") {
      let orderdelivered = new OrderDelivered();
      const htmlTemplate = orderdelivered.getHtml(updateResult.data);
      const textTemplate = orderdelivered.getText(updateResult.data);

      console.log(htmlTemplate);
      console.log(textTemplate);

      const payload = {
        to: updateResult.data.customer_email,
        subject: `Your Order has been Delivered!!!  - #${updateResult.data.order_id}`,
        text: textTemplate,
        html: htmlTemplate,
      };

      const emailSent = await sendEmail(payload);
      console.log("📧 Email sent result:", emailSent);
    } else if (order_status == "cancelled") {
      let orderCanceled = new OrderCanceled();
      const htmlTemplate = orderCanceled.getHtml(updateResult.data);
      const textTemplate = orderCanceled.getText(updateResult.data);

      console.log(htmlTemplate);
      console.log(textTemplate);

      const payload = {
        to: updateResult.data.customer_email,
        subject: `Your Order has been Canceled!!!  - #${updateResult.data.order_id}`,
        html: htmlTemplate,
      };

      const emailSent = await sendEmail(payload);
      console.log("📧 Email sent result:", emailSent);
    } else if (order_status == "delayed/onhold") {
      let orderdelayed = new OrderDelayed();
      const htmlTemplate = orderdelayed.getHtml(updateResult.data);
      const textTemplate = orderdelayed.getText(updateResult.data);

      console.log(htmlTemplate);
      console.log(textTemplate);

      const payload = {
        to: updateResult.data.customer_email,
        subject: `Sorry for the Delay!  - #${updateResult.data.order_id}`,
        text: textTemplate,
        html: htmlTemplate,
      };

      const emailSent = await sendEmail(payload);
      console.log("📧 Email sent result:", emailSent);
    }

    return NextResponse.json(
      {
        success: true,
        message: "✅ Order updated successfully.",
        data: updateResult.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
