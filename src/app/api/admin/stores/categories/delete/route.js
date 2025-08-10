import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const body = await request.json();
    const { category_id } = body;

    if (!category_id) {
      return NextResponse.json(
        { success: false, message: "Category ID is required." },
        { status: 400 }
      );
    }

    // Get category details first
    const category_result = await dbActions.getCategoryById(category_id);
    if (!category_result.success) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    const categoryData = category_result.data;

    // Delete image from storage if it exists
    if (categoryData.category_image) {
      const folderPath = `store/${categoryData.category_store}/categories/`;
      await storage.deleteFile(folderPath, categoryData.category_image);
    }

    // Delete category from DB
    const delete_result = await dbActions.deleteCategory(category_id);
    if (!delete_result.success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete category." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: delete_result.data, message: "Category deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Category deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
