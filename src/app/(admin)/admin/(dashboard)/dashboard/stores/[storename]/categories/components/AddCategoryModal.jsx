import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function AddCategoryModal({ setShowAddModal, newCategory, setNewCategory, handleAddCategory }) {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        // onClick={() => setShowAddModal(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-4xl max-h-screen bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">Add New Category</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setShowAddModal(false)}
            aria-label="Close modal"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-2 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-2 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCategory.status}
                onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="mt-2 block w-full text-sm text-gray-500"
                onChange={handleImageChange}
              />
              {newCategory.image?.name && (
                <p className="mt-1 text-xs text-gray-500 truncate">{newCategory.image.name}</p>
              )}
              {imagePreview && (
                <div className="mt-4 max-h-80 overflow-y-auto flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Category Preview"
                    className="w-full max-w-md object-contain rounded-xl border border-gray-200 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
