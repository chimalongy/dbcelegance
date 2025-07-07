"use client";
import Navbar from "@/app/components/Nav";
import React, { useState } from "react";


const ProductPage = () => {
  const gender = "mensfashion";
  const imagePrefix = `/images/products/${gender === "mensfashion" ? "M" : "F"}`;
  const images = Array.from({ length: 3 }, (_, j) => `${imagePrefix}${j + 1}.jpg`);

  const product = {
    name: "DIOR AND LEWIS HAMILTON Track Pants",
    reference: "513C127B4501_C482",
    material: "Multicolor Technical Fabric",
    images,
    sizes: ["S", "M", "L", "XL"],
    description:
      "The track pants are part of the exclusive DIOR AND LEWIS HAMILTON capsule. Crafted in multicolor technical fabric with a gradient effect, they showcase the DIOR AND LEWIS HAMILTON embroidery, with the House signature revisited in a graphic style, as well as the collaboration's logo on the back.",
    sizeAndFit:
      "Fits true to size. Designed for a relaxed fit. Model is wearing size M.",
    price: "2.300,00 €"
  };

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-6 py-10 md:px-20 lg:px-32 flex flex-col lg:flex-row gap-10">
        {/* Product Images */}
        <div className="w-full lg:w-1/2 flex flex-col items-center gap-4">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-[350px] h-auto object-contain shadow-md rounded-md"
          />
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover rounded border cursor-pointer ${
                  selectedImage === img ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-sm text-gray-600">{product.material}</p>
          <p className="text-xs text-gray-500">Reference: {product.reference}</p>

          {/* Size Selector */}
          <div className="mt-4">
            <label htmlFor="size" className="block mb-1 text-sm font-medium">
              Select your size
            </label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="">Select size</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="flex justify-between mt-2 text-sm text-blue-600 underline cursor-pointer">
              <span>Size recommendation</span>
              <span>Size Chart</span>
            </div>
          </div>

          {/* Price & Buttons */}
          <div className="mt-6">
            <button
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
              disabled={!selectedSize}
            >
              {selectedSize ? `Add to cart - ${product.price}` : "Select a size to add to cart"}
            </button>
            <button className="w-full mt-2 border border-gray-300 text-gray-500 py-3 rounded cursor-not-allowed">
              Express payment
            </button>
          </div>

          {/* Description */}
          <div className="mt-8 border-t pt-6 text-sm text-gray-600">
            <p><strong>Description:</strong> {product.description}</p>
            <p className="mt-4"><strong>Size & Fit:</strong> {product.sizeAndFit}</p>
          </div>

          <div className="text-sm text-blue-600 underline cursor-pointer">See more</div>
        </div>
      </div>
     
    </div>
  );
};

export default ProductPage;
