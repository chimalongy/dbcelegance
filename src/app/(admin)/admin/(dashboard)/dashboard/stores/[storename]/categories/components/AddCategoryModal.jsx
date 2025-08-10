import React, { useState, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiLoader } from 'react-icons/fi';

export default function AddCategoryModal({ 
  setShowAddModal, 
  newCategory, 
  setNewCategory, 
  handleAddCategory,
  isAdding 
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError(''); // Reset previous errors

    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must be less than 2MB');
      return;
    }

    setNewCategory({ ...newCategory, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setNewCategory({ ...newCategory, image: null });
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={() => !isAdding && setShowAddModal(false)}></div>

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Add New Category</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => !isAdding && setShowAddModal(false)}
            disabled={isAdding}
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Category Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  disabled={isAdding}
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  className="block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  disabled={isAdding}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="sm:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image
                </label>

                {!imagePreview ? (
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg ${isAdding ? 'bg-gray-50' : ''}`}>
                    <div className="space-y-1 text-center">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className={`relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${isAdding ? 'pointer-events-none text-blue-400' : ''}`}
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            disabled={isAdding}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 relative group">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-full h-48 object-contain rounded-lg border border-gray-200"
                    />
                    {!isAdding && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <FiTrash2 className="text-red-500" />
                      </button>
                    )}
                  </div>
                )}

                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {newCategory.image?.name && !error && (
                  <p className="mt-2 text-sm text-gray-500 truncate">
                    Selected: {newCategory.image.name} ({(newCategory.image.size / 1024).toFixed(1)}KB)
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowAddModal(false)}
                disabled={isAdding}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
                disabled={!!error || isAdding}
              >
                {isAdding ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}