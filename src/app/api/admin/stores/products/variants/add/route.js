import { NextResponse } from "next/server";
import DBFunctions from "../../../../../../../../utils/DB/DBFunctions";
import { TableCreator } from "../../../../../../../../utils/DB/TableCreator";
import StorageFunctions from "../../../../../../../../utils/DB/StorageFunctions";

export async function POST(request) {
  const dbActions = new DBFunctions();
  const storage = new StorageFunctions();
  await TableCreator();

  try {
    const formData = await request.formData();
    const product_id = formData.get("product_id");
    const product_store = formData.get("product_store");
    const sku = formData.get("sku");
    const variant_status = formData.get("variant_status");
    const variant_price = formData.get("variant_price");
    const stock_quantity = formData.get("stock_quantity");

    // Validate required fields
    if (!product_id || !product_store || !sku || !variant_price || !stock_quantity) {
      return NextResponse.json(
        { success: false, message: "Product ID, store, SKU, variant price, and stock quantity are required." },
        { status: 400 }
      );
    }

    // Check if product exists
    const productResult = await dbActions.getProductById(product_id);
    if (!productResult.success) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    // Check if SKU already exists for this product
    const skuCheck = await dbActions.checkVariantSkuExists(sku, product_id);
    if (skuCheck.success && skuCheck.exists) {
      return NextResponse.json(
        { success: false, message: "SKU already exists for this product." },
        { status: 400 }
      );
    }

    // Handle file uploads for variant gallery
    const files = formData.getAll("variant_gallery");
    const folderPath = `store/${product_store}/variants/`;
    const gallery = [];

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
        type: file.type.startsWith("image/") ? "image" : "video",
        name: file.name,
        size: file.size
      });
    }

    // Create variant data
    const variantData = {
      product_id: parseInt(product_id),
      product_store,
      sku: sku.trim(),
      variant_status: variant_status || 'active',
      variant_price: parseFloat(variant_price),
      stock_quantity: parseInt(stock_quantity),
      variant_gallery: gallery
    };

    // Insert variant into database
    const variantResult = await dbActions.createVariant(variantData);
    if (!variantResult.success) {
      // Rollback uploaded files if DB insert fails
      for (const g of gallery) {
        await storage.deleteFile(folderPath, g.url);
      }
      return NextResponse.json(
        { success: false, message: "Failed to create variant." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: variantResult.data,
        message: "Variant created successfully."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Variant creation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
} 