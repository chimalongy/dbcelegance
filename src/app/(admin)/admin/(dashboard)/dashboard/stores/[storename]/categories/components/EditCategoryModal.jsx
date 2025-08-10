"use client";

import { FiX, FiLoader, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function EditCategoryModal({
  setShowEditModal,
  currentCategory,
  setCurrentCategory,
  handleEditCategory,
  isEditing
}) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isImageChanged, setIsImageChanged] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

  useEffect(() => {
    // Set initial image preview
    if (currentCategory?.image) {
      if (typeof currentCategory.image === "string") {
        // Existing image URL
        setImagePreview(currentCategory.image);
        setIsImageChanged(false);
      } else if (currentCategory.image instanceof File) {
        // Newly uploaded file
        const previewUrl = URL.createObjectURL(currentCategory.image);
        setImagePreview(previewUrl);
        setIsImageChanged(true);
      }
    }
  }, [currentCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError('');

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

    const previewUrl = URL.createObjectURL(file);
    setCurrentCategory((prev) => ({
      ...prev,
      image: file,
    }));
    setImagePreview(previewUrl);
    setIsImageChanged(true);
  };

  const removeImage = () => {
    setCurrentCategory((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    setError('');
    setIsImageChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        // onClick={() => !isEditing && setShowEditModal(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-4xl max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">
            Edit Category {currentCategory?.id ? `(#${currentCategory.id})` : ''}
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => !isEditing && setShowEditModal(false)}
            disabled={isEditing}
            aria-label="Close modal"
          >
            <FiX size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form onSubmit={handleEditCategory} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-2 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                value={currentCategory?.name || ""}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                className="mt-2 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                value={currentCategory?.status || "active"}
                onChange={handleChange}
                disabled={isEditing}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Store (read-only) */}
            <div className="md:col-span-2">
              <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                Store
              </label>
              <input
                type="text"
                id="store"
                name="store"
                className="mt-2 block w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-800 bg-gray-100 cursor-not-allowed"
                value={currentCategory?.store || ""}
                readOnly
                disabled
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Category Image
                <span className="ml-1 text-gray-500 text-xs font-normal">
                  {!isImageChanged && currentCategory?.image ? "(Current image will be kept)" : ""}
                </span>
              </label>
              
              <div className={`mt-2 flex items-center gap-4 ${isEditing ? 'opacity-70' : ''}`}>
                <label
                  htmlFor="image"
                  className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                    isEditing ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  {currentCategory?.image ? 'Change Image' : 'Upload Image'}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    disabled={isEditing}
                  />
                </label>
                
                {(currentCategory?.image && !isEditing) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className={`px-4 py-2 text-red-600 rounded-lg text-sm font-medium ${
                      isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
                    }`}
                    disabled={isEditing}
                  >
                    <FiTrash2 className="inline mr-1" />
                    {imagePreview ? 'Remove New Image' : 'Remove Current Image'}
                  </button>
                )}
              </div>

              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              
              {typeof currentCategory?.image === "object" && currentCategory.image?.name && (
                <p className="mt-2 text-sm text-gray-500 truncate">
                  Selected: {currentCategory.image.name} ({(currentCategory.image.size / 1024).toFixed(1)}KB)
                </p>
              )}
              
              {imagePreview && (
                <div className="mt-4 max-h-80 overflow-y-auto flex justify-center">
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-full max-w-md object-contain rounded-xl border border-gray-200 shadow-md"
                    />
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <FiTrash2 className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setShowEditModal(false)}
                disabled={isEditing}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
                disabled={isEditing || !!error}
              >
                {isEditing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}