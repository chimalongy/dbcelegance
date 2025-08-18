import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2, FiLayers, FiToggleLeft, FiToggleRight, FiHash, FiEdit } from 'react-icons/fi';
import { FaImage, FaVideo } from 'react-icons/fa';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';
import toast from 'react-hot-toast';

const EditVariantModal = ({ 
  product, 
  variant: existingVariant,
  setShowEditVariantModal, 
  onVariantUpdated
}) => {
  const [fileErrors, setFileErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [variant, setVariant] = useState({
    sku: '',
    variant_status: 'active',
    variant_price: '',
    stock_quantity: '',
    variant_gallery: [],
    product_store: ''
  });

  // Initialize form with existing variant data
  useEffect(() => {
    if (existingVariant) {
      console.log(existingVariant)
      setVariant({
        sku: existingVariant.sku || '',
        variant_status: existingVariant.variant_status || 'active',
        variant_price: existingVariant.variant_price || '',
        stock_quantity: existingVariant.stock_quantity || '',
        variant_gallery: existingVariant.variant_gallery ? 
          (typeof existingVariant.variant_gallery === 'string' ? 
            JSON.parse(existingVariant.variant_gallery) : existingVariant.variant_gallery) : [],
        product_store: existingVariant.product_store || product?.product_store || 'default_store'
      });
    }
  }, [existingVariant, product]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const errors = [];
    const validFiles = [];

    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        errors.push(`Unsupported file type: ${file.name}`);
        return;
      }

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

    const filePreviews = validFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      file,
      name: file.name,
      size: file.size
    }));

    const updatedGallery = [...variant.variant_gallery, ...filePreviews];
    
    setVariant({
      ...variant,
      variant_gallery: updatedGallery
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const updatedGallery = [...variant.variant_gallery];
    // Only revoke URL if it's a preview (not an existing file)
    if (updatedGallery[index].file) {
      URL.revokeObjectURL(updatedGallery[index].url);
    }
    updatedGallery.splice(index, 1);
    
    setVariant({
      ...variant,
      variant_gallery: updatedGallery
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("product_id", product.product_id);
      formData.append("variant_id", existingVariant.variant_id);
      formData.append("product_store", variant.product_store);
      formData.append("sku", variant.sku.trim());
      formData.append("variant_status", variant.variant_status);
      formData.append("variant_price", variant.variant_price);
      formData.append("stock_quantity", variant.stock_quantity);

      // Add new files to form data
      const newFiles = variant.variant_gallery.filter(item => item.file);
      newFiles.forEach(file => {
        formData.append("variant_gallery", file.file);
      });

      // If replacing gallery, mark it
      if (newFiles.length > 0 && variant.variant_gallery.length === newFiles.length) {
        formData.append("replace_gallery", "true");
      }

      const response = await axios.post(apiSummary.admin.stores.products.update_variant, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Variant updated successfully!");
        
        // Clean up object URLs for new files
        variant.variant_gallery.forEach(item => {
          if (item.file) {
            URL.revokeObjectURL(item.url);
          }
        });

        // Call the callback to refresh the product list
        if (onVariantUpdated) {
          onVariantUpdated(product.product_id, response.data.data);
        }

        setShowEditVariantModal(false);
      } else {
        throw new Error(response.data.message || "Failed to update variant.");
      }
    } catch (error) {
      console.error('Error updating variant:', error);
      setSubmitError(error.response?.data?.message || error.message || 'Failed to update variant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={() => !isSubmitting && setShowEditVariantModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiEdit className="mr-2" /> 
            Edit Variant: {existingVariant?.sku}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            onClick={() => !isSubmitting && setShowEditVariantModal(false)}
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form id="edit-variant-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 flex items-center">
                <FiHash className="mr-2" /> Variant Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="variant_sku" className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="variant_sku"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      value={variant.sku}
                      onChange={(e) => setVariant({ ...variant, sku: e.target.value })}
                      placeholder="Enter variant SKU"
                      disabled={isSubmitting}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiHash />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="variant_status" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      id="variant_status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100"
                      value={variant.variant_status}
                      onChange={(e) => setVariant({ ...variant, variant_status: e.target.value })}
                      disabled={isSubmitting}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {variant.variant_status === 'active' ? (
                        <FiToggleRight className="text-green-500" />
                      ) : (
                        <FiToggleLeft className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="variant_price" className="block text-sm font-medium text-gray-700">
                  Variant Price *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="variant_price"
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    value={variant.variant_price}
                    onChange={(e) => setVariant({ ...variant, variant_price: e.target.value })}
                    placeholder="0.00"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    $
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="stock_quantity"
                    required
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    value={variant.stock_quantity}
                    onChange={(e) => setVariant({ ...variant, stock_quantity: e.target.value })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    #
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 flex items-center">
                <FaImage className="mr-2" /> Variant Media
              </h4>
              
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
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload new files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        disabled={isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, MP4 up to 2MB (images) or 3MB (videos)
                  </p>
                </div>
              </div>

              {variant.variant_gallery?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Current Media ({variant.variant_gallery.length}):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {variant.variant_gallery.map((file, index) => (
                      <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                        {file.type === 'image' ? (
                          <img 
                            src={file.url} 
                            alt={`Preview ${file.name}`} 
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
                          onClick={() => !isSubmitting && removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                          aria-label="Remove file"
                          disabled={isSubmitting}
                        >
                          <FiTrash2 size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                          <p className="text-xs text-white truncate px-1">
                            {file.type === 'image' ? 'Image' : 'Video'} - {file.name}
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
          {submitError && (
            <div className="flex-1 text-red-600 text-sm flex items-center">
              <span className="mr-1">⚠️</span> {submitError}
            </div>
          )}
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            onClick={() => setShowEditVariantModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-variant-form"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Variant'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVariantModal; 