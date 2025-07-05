"use client";
import React, { useState, useEffect } from "react";

const ProductList = ({gender}) => {
  const generateProducts = () => {
    const products = [];
    const baseNames = [
      "Zipped Start",
      "Track Pants",
      "Cracket Bucket Hat",
      "Star Apps Mule",
      "Classic Tee",
      "Denim Jacket",
      "Wool Coat",
      "Silk Scarf",
      "Leather Gloves",
      "Canvas Sneakers",
    ];
    const basePrice = [2700, 920, 1350, 850, 1200, 1800, 2200, 450, 680, 950];

    for (let i = 1; i <= 60; i++) {
      const randIndex = Math.floor(Math.random() * baseNames.length);
      const randomImageNumber = Math.floor(Math.random() * 3) + 1;
      products.push({
        id: i,
        name: `DBC ${baseNames[randIndex]} ${i}`,
        price: basePrice[randIndex],
       image: `/images/products/${gender === "mensfashion" ? "M" : "F"}${randomImageNumber}.jpg`

      });
    }

    return products;
  };

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const generatedProducts = generateProducts();
    setAllProducts(generatedProducts);
  }, []);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto  py-8">
      {/* 👇 Mobile now has 2 products per row */}
      <div className="grid grid-cols-2 gap-2 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white  shadow hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-[300px] lg:h-[600px] w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2 truncate">
                {product.name}
              </h3>
              <p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-700 text-center sm:text-left">
          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
          <span className="font-medium">{Math.min(indexOfLastItem, allProducts.length)}</span> of{" "}
          <span className="font-medium">{allProducts.length}</span> products
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
                  currentPage === pageNumber
                    ? "bg-amber-300 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-amber-500"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="px-2 py-1 text-sm text-gray-500">...</span>
              <button
                onClick={() => paginate(totalPages)}
                className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-amber-300 text-white"
                    :  "bg-white text-gray-700 hover:bg-gray-50 border border-amber-500"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 sm:px-4 sm:py-2 border rounded-md text-sm ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
