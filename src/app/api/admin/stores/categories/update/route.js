import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  try {

    const formData = await request.formData();
    const category_id = formData.get("category_id");

    if (!category_id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required." },
        { status: 400 }
      );
    }

    let category_result = await dbActions.getCategoryById(category_id)
    if (!category_result.success){
       return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 400 }
      );
    }

    
//console.log(category_result)
 let previousImageUrl = category_result.data.category_image

    const storage = new StorageFunctions();
    const updateData = {};

    // Handle normal fields
    for (const [key, value] of formData.entries()) {
      if (key === "category_id") continue;

      if (key === "category_image" && value instanceof File) {
       
        console.log("previous image url: "+ previousImageUrl)
        const folderPath = `store/${formData.get("category_store")}/categories/`;
        const delete_current_image_result = await storage.deleteFile(folderPath, previousImageUrl)
        console.log(delete_current_image_result)
        const uploadResult = await storage.uploadFile(value, folderPath);
        if (!uploadResult?.path) {
          return NextResponse.json(
            { success: false, message: "Failed to upload image." },
            { status: 500 }
          );
        }
        updateData[key] = uploadResult.path;
      } else {
        updateData[key] = value;
      }
    }

    await TableCreator();

    
    const result = await dbActions.updateCategoryFields(category_id, updateData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Category update failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "Category updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
