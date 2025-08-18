import React from 'react';
import { FiTrash2, FiLoader, FiX } from 'react-icons/fi';

export default function DeleteProductVariantModal({ 
  setShowDeleteVariantModal, 
  handleDeleteVariant, 
  currentVariant,
  currentProduct,
  isDeletingVariant
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={() => !isDeletingVariant && setShowDeleteVariantModal(false)}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100 mr-3">
              <FiTrash2 className="h-4 w-4 text-red-600" />
            </div>
            Delete Variant
          </h3>
          <button
            onClick={() => !isDeletingVariant && setShowDeleteVariantModal(false)}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            disabled={isDeletingVariant}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete the variant{" "}
              <span className="font-semibold text-gray-800">
                "{currentVariant?.sku}"
              </span>{" "}
              from product{" "}
              <span className="font-semibold text-gray-800">
                "{currentProduct?.product_name}"?
              </span>
            </p>
            
            <div className="p-3 bg-red-50 rounded-md text-sm text-red-600">
              <p className="font-medium">This action cannot be undone and will:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Remove all variant data</li>
                <li>Delete all associated media files</li>
                <li>Affect any orders containing this variant</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => !isDeletingVariant && setShowDeleteVariantModal(false)}
            className={`px-4 py-2 text-sm font-medium border rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              isDeletingVariant ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isDeletingVariant}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleDeleteVariant(currentProduct?.product_id, currentVariant?.variant_id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
              isDeletingVariant ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isDeletingVariant}
          >
            {isDeletingVariant ? (
              <>
                <FiLoader className="animate-spin inline mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Variant'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 