import React, { useState } from 'react';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { FaImage, FaVideo } from 'react-icons/fa';

export default function EditProductModal({
  setShowEditModal,
  currentProduct,
  handleEditProduct,
  categories
}) {
  const [editedProduct, setEditedProduct] = useState({
    ...currentProduct,
    product_description: currentProduct?.product_description || "" // Fallback to empty string if null
  });
  const [fileErrors, setFileErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditProduct(editedProduct);
  };

  const processFiles = (files) => {
    const errors = [];
    const validFiles = [];

    files.forEach(file => {
      // Check file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        errors.push(`Unsupported file type: ${file.name}`);
        return;
      }

      // Check file size
      if (isImage && file.size > 2 * 1024 * 1024) {
        errors.push(`Image too large (max 2MB): ${file.name}`);
        return;
      }

      if (isVideo && file.size > 3 * 1024 * 1024) {
        errors.push(`Video too large (max 3MB): ${file.name}`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    setFileErrors([]);

    // Create preview URLs for valid files
    const filePreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      file // Store the actual file object for later upload
    }));

    // Combine with existing files
    const updatedGallery = [...(editedProduct.product_gallery || []), ...filePreviews];
    
    setEditedProduct({
      ...editedProduct,
      product_gallery: updatedGallery
    });
  };

  const removeFile = (index) => {
    const updatedGallery = [...editedProduct.product_gallery];
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedGallery[index].url);
    updatedGallery.splice(index, 1);
    
    setEditedProduct({
      ...editedProduct,
      product_gallery: updatedGallery
    });
  };

  if (!currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={() => setShowEditModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Scrollable Content */}
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800">Edit Product</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowEditModal(false)}
            >
              <FiX size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="edit-product_name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="edit-product_name"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.product_name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, product_name: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="edit-product_description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="edit-product_description"
                  rows={3}
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.product_description || ""}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, product_description: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="edit-product_category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="edit-product_category"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.product_category}
                  onChange={(e) =>
                    setEditedProduct({ 
                      ...editedProduct, 
                      product_category: parseInt(e.target.value) 
                    })
                  }
                >
                  <option value="0">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="edit-product_status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="edit-product_status"
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={editedProduct.product_status}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, product_status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Product Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Media</label>
              
              {/* Error messages */}
              {fileErrors.length > 0 && (
                <div className="mt-2 p-3 bg-red-50 rounded-md text-sm text-red-600">
                  {fileErrors.map((error, index) => (
                    <p key={index} className="flex items-start">
                      <span className="mr-1">•</span> {error}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Media Preview */}
              <div className="mt-2 flex flex-wrap gap-3">
                {editedProduct.product_gallery?.length > 0 ? (
                  editedProduct.product_gallery.map((file, index) => (
                    <div key={index} className="relative group h-24 w-24 rounded-md overflow-hidden border border-gray-200">
                      {file.type === 'image' ? (
                        <img 
                          src={file.url} 
                          alt={`Preview ${index}`} 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="relative h-full w-full bg-gray-100 flex items-center justify-center">
                          <FaVideo className="text-gray-400 text-2xl" />
                          <video 
                            src={file.url}
                            className="absolute inset-0 h-full w-full object-cover"
                            muted
                            loop
                            playsInline
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                      >
                        <FiTrash2 size={14} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                        <p className="text-xs text-white truncate px-1">
                          {file.type === 'image' ? 'Image' : 'Video'} {index + 1}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No media uploaded</div>
                )}
              </div>

              {/* Upload Area */}
              <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload-edit"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload media</span>
                      <input 
                        id="file-upload-edit" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple 
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          processFiles(files);
                        }}
                        accept="image/*,video/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supports: JPG, PNG, GIF, MP4 (Images: 2MB max, Videos: 3MB max)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}