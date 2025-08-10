import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

// Enable edge-compatible file type if using middleware (only for clarification, not code)
export const dynamic = 'force-dynamic'; // Optional: only if caching becomes an issue

export async function POST(request) {
   const dbActions = new DBFunctions();
  try {
    const formData = await request.formData();

    const category_name = formData.get("category_name");
    const category_status = formData.get("category_status");
    const category_store = formData.get("category_store");
    const file = formData.get("category_image");

    if (
      !category_name ||
      !category_status ||
      !category_store ||
      !file ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields including a valid image file are required.",
        },
        { status: 400 }
      );
    }

    // Create table if it doesn't exist
    await TableCreator();

  //check if category exist

    let category_exist_result = await dbActions.getCategoryByName(category_name, category_store)

    if (category_exist_result.success){
       return NextResponse.json(
        {
          success: false,
          message: "A category with same name exist.",
        },
        { status: 400 })
    }






    const folderPath = `store/${category_store}/categories/`;
    const storage = new StorageFunctions();
    const uploadResult = await storage.uploadFile(file, folderPath);

    if (!uploadResult || !uploadResult.path) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to upload image.",
        },
        { status: 500 }
      );
    }

   
    const category_data = await dbActions.createCategory({
      category_name,
      category_status,
      category_store,
      category_image: uploadResult.path,
    });

    if (!category_data.success) {
      await storage.deleteFile(folderPath, uploadResult.path);
      return NextResponse.json(
        {
          success: false,
          message: "Category registration failed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category_data.data,
        message: "Category registered successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category registration error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
