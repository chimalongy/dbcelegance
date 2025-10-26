import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();


  try {
    const body = await request.json();
    const { variant_id } = body;

    if (!variant_id) {
      return NextResponse.json(
        { success: false, message: "Variant ID is required." },
        { status: 400 }
      );
    }

    // Get variant details first
    const variantResult = await dbActions.getVariantById(variant_id);
    if (!variantResult.success) {
      return NextResponse.json(
        { success: false, message: "Variant not found." },
        { status: 404 }
      );
    }

    const variantData = variantResult.data;

    // Delete variant gallery files from storage if they exist
    if (variantData.variant_gallery) {
      try {
        const gallery = JSON.parse(variantData.variant_gallery);
        if (Array.isArray(gallery)) {
          const folderPath = `store/${variantData.product_store}/variants/`;
          for (const galleryItem of gallery) {
            await storage.deleteFile(folderPath, galleryItem.url);
          }
        }
      } catch (e) {
        console.warn("Could not parse variant gallery:", e);
      }
    }

    // Delete variant from database
    const deleteResult = await dbActions.deleteVariant(variant_id);
    if (!deleteResult.success) {
      return NextResponse.json(
        { success: false, message: "Failed to delete variant." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: deleteResult.data, 
        message: "Variant deleted successfully." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Variant deletion error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 