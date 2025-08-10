"use client";

import { FiX, FiAlertTriangle, FiLoader } from 'react-icons/fi';

const DeleteAccessoryCategoryModal = ({ setShowDeleteCategoryModal, currentCategory, handleDeleteCategory, isDeletingCategory }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Delete Accessory Category</h2>
          <button 
            onClick={() => setShowDeleteCategoryModal(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="flex items-center mb-4">
          <FiAlertTriangle className="text-red-500 mr-3" size={24} />
          <div>
            <p className="text-gray-700 font-medium">Are you sure you want to delete this category?</p>
            <p className="text-gray-500 text-sm mt-1">
              Category: <span className="font-medium">{currentCategory?.name}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <p className="text-red-700 text-sm">
            <strong>Warning:</strong> This action cannot be undone. All products in this category will also be deleted.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowDeleteCategoryModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isDeletingCategory}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteCategory}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            disabled={isDeletingCategory}
          >
            {isDeletingCategory ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Category'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccessoryCategoryModal; 