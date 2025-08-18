"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const CategoryList = ({store}) => {
  // This would typically come from an API call
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch with your provided data
    const fetchCategories = async () => {
      try {
        // In a real app, you would fetch from your API endpoint
        const mockCategories = [
          {
            category_id: 6,
            category_name: "T-shirt and polo's",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398361410.png",
            created_at: "2025-08-17T02:39:22.427Z"
          },
          {
            category_id: 7,
            category_name: "Shirts",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398427626.png",
            created_at: "2025-08-17T02:40:29.216Z"
          },
          {
            category_id: 8,
            category_name: "Sweaters",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398462763.png",
            created_at: "2025-08-17T02:41:03.957Z"
          },
          {
            category_id: 9,
            category_name: "Pant and shorts",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398500475.png",
            created_at: "2025-08-17T02:41:41.626Z"
          },
          {
            category_id: 10,
            category_name: "Outer wear",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398536169.png",
            created_at: "2025-08-17T02:42:17.178Z"
          },
          {
            category_id: 11,
            category_name: "Jacket",
            category_status: "active",
            category_store: "male",
            category_image: "https://mwybgicbeqwphroaerpy.supabase.co/storage/v1/object/public/dbc_elegance_store/store/male/categories/1755398577998.png",
            created_at: "2025-08-17T02:42:59.281Z"
          }
        ];

        // Filter by store if needed
        const filteredCategories = mockCategories.filter(
          cat => cat.category_store === store && cat.category_status === "active"
        );
        
        setAllCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [store]);

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allCategories.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = allCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-2 gap-2 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-md h-[400px] animate-pulse">
              <div className="h-[300px] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-2 gap-2 lg:gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {currentCategories.map((category) => (
          <Link 
            href={`/store/${category.category_store}/${category.category_name.toLowerCase().replace(/\s+/g, '-')}`} 
            key={category.category_id}
          >
            <div className="bg-white shadow hover:shadow-lg transition duration-300 overflow-hidden">
              {/* Single Category Image */}
              <div className="h-[300px] lg:h-[400px] overflow-hidden">
                <img
                  src={category.category_image}
                  alt={category.category_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 mb-2 truncate">
                  {category.category_name}
                </h3>
                <p className="text-gray-700 font-bold">Shop Now</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination - Only show if we have more than one page */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium">{Math.min(indexOfLastItem, allCategories.length)}</span> of{" "}
            <span className="font-medium">{allCategories.length}</span> categories
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
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-amber-500"
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
      )}
    </div>
  );
};

export default CategoryList;