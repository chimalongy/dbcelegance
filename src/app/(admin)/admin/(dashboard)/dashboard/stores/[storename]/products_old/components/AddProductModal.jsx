import React, { useState, useRef } from 'react';
import { FiX, FiUpload, FiTrash2, FiPackage, FiTag, FiLayers, FiTrendingUp, FiToggleLeft, FiToggleRight, FiLoader } from 'react-icons/fi';
import { FaImage, FaVideo } from 'react-icons/fa';

export default function AddProductModal({
  setShowAddModal,
  setNewProduct,
  handleAddProduct,
  categories,
  newProduct,
  isAdding // Added isAdding prop
}) {
  const [fileErrors, setFileErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
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
    const updatedGallery = [...(newProduct.product_gallery || []), ...filePreviews];
    
    setNewProduct({
      ...newProduct,
      product_gallery: updatedGallery
    });

    // Reset file input to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const updatedGallery = [...newProduct.product_gallery];
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(updatedGallery[index].url);
    updatedGallery.splice(index, 1);
    
    setNewProduct({
      ...newProduct,
      product_gallery: updatedGallery
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={() => !isAdding && setShowAddModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiPackage className="mr-2" /> Add New Product
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => !isAdding && setShowAddModal(false)}
            disabled={isAdding}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form id="add-product-form" onSubmit={handleAddProduct} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 flex items-center">
                <FiTag className="mr-2" /> Basic Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="product_name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={newProduct.product_name}
                      onChange={(e) => setNewProduct({ ...newProduct, product_name: e.target.value })}
                      placeholder="Enter product name"
                      disabled={isAdding}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiTag />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="product_category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="product_category"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={newProduct.product_category}
                      onChange={(e) => setNewProduct({ 
                        ...newProduct, 
                        product_category: parseInt(e.target.value) 
                      })}
                      disabled={isAdding}
                    >
                      <option value="0">Select a category</option>
                      {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiTrendingUp />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="product_status" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      id="product_status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={newProduct.product_status}
                      onChange={(e) => setNewProduct({ ...newProduct, product_status: e.target.value })}
                      disabled={isAdding}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {newProduct.product_status === 'active' ? (
                        <FiToggleRight className="text-green-500" />
                      ) : (
                        <FiToggleLeft className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 flex items-center">
                <FaImage className="mr-2" /> Product Media
              </h4>
              
              {/* Error messages */}
              {fileErrors.length > 0 && (
                <div className="p-3 bg-red-50 rounded-md text-sm text-red-600">
                  {fileErrors.map((error, index) => (
                    <p key={index} className="flex items-start">
                      <span className="mr-1">•</span> {error}
                    </p>
                  ))}
                </div>
              )}
              
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                onDragEnter={!isAdding ? handleDragEnter : undefined}
                onDragLeave={!isAdding ? handleDragLeave : undefined}
                onDragOver={!isAdding ? handleDragOver : undefined}
                onDrop={!isAdding ? handleDrop : undefined}
              >
                <div className="text-center">
                  <div className="flex flex-col items-center justify-center text-sm text-gray-600">
                    <FiUpload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor="file-upload"
                        className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${
                          isAdding ? 'pointer-events-none opacity-50' : ''
                        }`}
                      >
                        <span>Click to upload</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          multiple 
                          onChange={!isAdding ? handleFileChange : undefined}
                          ref={fileInputRef}
                          accept="image/*,video/*"
                          disabled={isAdding}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        or drag and drop files here
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports: JPG, PNG, GIF, MP4 (Images: 2MB max, Videos: 3MB max)
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Preview uploaded files */}
              {newProduct.product_gallery?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({newProduct.product_gallery.length}):</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {newProduct.product_gallery.map((file, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={`Preview ${index}`} 
                            className="h-24 w-full object-cover"
                          />
                        ) : (
                          <div className="relative h-24 w-full bg-gray-100 flex items-center justify-center">
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
                          onClick={() => !isAdding && removeFile(index)}
                          className={`absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 ${
                            isAdding ? 'opacity-0 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
                          } transition-opacity hover:bg-red-600`}
                          aria-label="Remove file"
                          disabled={isAdding}
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                          <p className="text-xs text-white truncate px-1">
                            {file.type === 'image' ? 'Image' : 'Video'} {index + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isAdding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => setShowAddModal(false)}
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
              isAdding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <FiLoader className="animate-spin inline mr-2" />
                Adding...
              </>
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}