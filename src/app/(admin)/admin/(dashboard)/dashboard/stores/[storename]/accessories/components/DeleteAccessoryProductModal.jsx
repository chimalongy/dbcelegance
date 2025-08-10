"use client";

import { FiX, FiAlertTriangle, FiLoader } from 'react-icons/fi';

const DeleteAccessoryProductModal = ({ setShowDeleteProductModal, currentProduct, handleDeleteProduct, isDeletingProduct }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Delete Accessory Product</h2>
          <button 
            onClick={() => setShowDeleteProductModal(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-500 mr-3" size={24} />
          <div>
            <p className="text-gray-700 font-medium">Are you sure you want to delete this product?</p>
            <p className="text-gray-500 text-sm mt-1">
              Product: <span className="font-medium">{currentProduct?.name}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">
            <strong>Warning:</strong> This action cannot be undone. All product data including images will be permanently deleted.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowDeleteProductModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isDeletingProduct}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProduct}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            disabled={isDeletingProduct}
          >
            {isDeletingProduct ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccessoryProductModal; 