"use client";

import { useState, useEffect } from "react";
import { FiX, FiSave } from "react-icons/fi";

export default function DescriptionModal({
  setShowDescriptionModal,
  currentDescription = "",
  handleDescriptionUpdate,
  productName
}) {
  const [description, setDescription] = useState(currentDescription);

  useEffect(() => {
    setDescription(currentDescription || "");
  }, [currentDescription]);

  const closeModal = () => setShowDescriptionModal(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Edit Description for {productName}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={closeModal}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <textarea
            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 whitespace-pre-wrap"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description..."
          />
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center"
            onClick={() => handleDescriptionUpdate(description)}
          >
            <FiSave className="mr-2" />
            Save Description
          </button>
        </div>
      </div>
    </div>
  );
}