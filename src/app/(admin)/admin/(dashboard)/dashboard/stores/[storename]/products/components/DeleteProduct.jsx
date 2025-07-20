import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

export default function DeleteProduct({ setShowDeleteModal, handleDeleteProduct, currentProduct }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => setShowDeleteModal(false)}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Modal Body */}
        <div className="px-6 py-5">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
                <FiTrash2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Product
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-800">
                  "{currentProduct?.name}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium border rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteProduct}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
