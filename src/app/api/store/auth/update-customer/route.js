import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../utils/DB/TableCreator";

export async function POST(request) {
  const dbActions = new DBFunctions();


  try {
    const body = await request.json();
    const { customerEmail, fieldName, newValue } = body;
    

    console.log("📥 Incoming Update:", body);

    // ✅ Validate required fields
    if (!customerEmail || !fieldName || newValue === undefined) {
      return NextResponse.json(
        { success: false, error: "update fields" },
        { status: 400 }
      );
    }

    var customerresult = await dbActions.findCustomerByEmail(customerEmail)
   

    if (!customerresult.success){
         return NextResponse.json(
        { success: false, error: "Could not identify customer." },
        { status: 400 }
      );
    }

    let customer = customerresult.customer
       
 
    // ✅ Call DB function
    const updateResult = await dbActions.updateCustomerField(customer.customer_id, fieldName, newValue);

    if (!updateResult.success) {
      return NextResponse.json(
        { success: false, error: updateResult.error || "Update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updateResult.data,
        message: `Customer ${fieldName} updated successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
