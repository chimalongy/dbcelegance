import React from 'react';
import { FiTrash2, FiX, FiLoader } from 'react-icons/fi';

export default function DeleteCategoryModal({ 
  setShowDeleteModal, 
  handleDeleteCategory, 
  currentCategory,
  isDeleting 
}) {
  if (!currentCategory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={() => !isDeleting && setShowDeleteModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Delete Category</h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
            disabled={isDeleting}
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <FiTrash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the category{" "}
                <span className="font-semibold">"{currentCategory.name}"</span>?
                <br />
                <span className="text-red-600 font-medium">This action cannot be undone.</span>
              </p>
              {isDeleting && (
                <p className="mt-2 text-sm text-gray-500">
                  Deleting category... Please wait.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
            onClick={handleDeleteCategory}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}