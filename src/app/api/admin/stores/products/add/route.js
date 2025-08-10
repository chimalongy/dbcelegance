import { NextResponse } from "next/server";
import { TableCreator } from "../../../../../../../utils/DB/TableCreator";
import DBFunctions from "../../../../../../../utils/DB/DBFunctions";
import StorageFunctions from "../../../../../../../utils/DB/StorageFunctions";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();

  try {
    const formData = await request.formData();

    const product_name = formData.get("product_name");
    const product_description = formData.get("product_description");
    const product_category = parseInt(formData.get("product_category"));
    const product_status = formData.get("product_status");
    const product_store = formData.get("product_store");

    // Extract all files (multiple uploads possible)
    const files = formData.getAll("product_gallery");

    if (!product_name || !product_category || !product_status || !product_store || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "All fields and at least one media file are required." },
        { status: 400 }
      );
    }

    // Create table if not exists
    await TableCreator();

    let category_exist_result = await dbActions.getCategoryById(product_category)

    if (!category_exist_result.success){
       return NextResponse.json(
        {
          success: false,
          message: "Category does not exist.",
        },
        { status: 400 })
    }

    let product_exist_result = await dbActions.getProductByName(product_name, product_store)

    if (product_exist_result.success){
       return NextResponse.json(
        {
          success: false,
          message: "A product with similar name exist",
        },
        { status: 400 })
    }





    // Upload files and prepare gallery
    const folderPath = `store/${product_store}/products/`;
    let gallery = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const uploadResult = await storage.uploadFile(file, folderPath);
      if (!uploadResult || !uploadResult.path) {
        return NextResponse.json(
          { success: false, message: `Failed to upload file: ${file.name}` },
          { status: 500 }
        );
      }

      gallery.push({
        url: uploadResult.path,
        type: file.type.startsWith("image/") ? "image" : "video"
      });
    }

    // Insert into DB
    const product_data = await dbActions.createProduct({
      product_name,
      product_description,
      product_category,
      product_status,
      product_gallery: gallery,
      product_store
    });

    if (!product_data.success) {
      // Rollback uploaded files if DB insert fails
      for (const g of gallery) {
        await storage.deleteFile(folderPath, g.url);
      }
      return NextResponse.json(
        { success: false, message: "Product creation failed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product_data.data,
        message: "Product created successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
