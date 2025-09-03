import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiUpload, FiTrash2, FiPackage, FiTag, FiLayers, FiTrendingUp, FiToggleLeft, FiToggleRight, FiLoader, FiPlus, FiEdit2, FiCopy, FiAlertCircle } from 'react-icons/fi';
import { FaImage, FaVideo } from 'react-icons/fa';

export default function AddProductModal({
  setShowAddModal,
  handleAddProduct,
  categories,
  isAdding,
  storeName
}) {
  const [fileErrors, setFileErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeManagement, setSizeManagement] = useState({
    sizes: [],
    selectedSize: null,
    editingSize: null
  });
  const [sizeForm, setSizeForm] = useState({
    size: '',
    sku: '',
    price: '',
    inventory: ''
  });
  const [skuError, setSkuError] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [autoGenerateSku, setAutoGenerateSku] = useState(true);
  const [productData, setProductData] = useState({
    product_name: '',
    product_description: '',
    product_category: 0,
    product_status: 'active',
    product_gallery: [],
    product_store: storeName
  });
  const fileInputRef = useRef(null);
  const sizeInputRef = useRef(null);

  // Generate SKU from product name and size
  const generateSku = (size) => {
    if (!productData.product_name || !size) return '';

    // Convert to lowercase, replace spaces with hyphens, remove special characters
    const cleanProductName = productData.product_name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const cleanSize = size.toLowerCase().replace(/\s+/g, '-');

    return `${cleanProductName}-${cleanSize}`;
  };

  // Update SKU when product name or size changes
  useEffect(() => {
    if (autoGenerateSku && sizeForm.size) {
      const newSku = generateSku(sizeForm.size);
      setSizeForm(prev => ({ ...prev, sku: newSku }));

      // Check for duplicate SKU
      const isDuplicate = sizeManagement.sizes.some(
        size => size.sku === newSku && size.sku !== sizeManagement.editingSize?.sku
      );
      setSkuError(isDuplicate ? 'SKU must be unique' : '');
    }
  }, [sizeForm.size, productData.product_name, autoGenerateSku]);

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
      file
    }));

    const updatedGallery = [...productData.product_gallery, ...filePreviews];

    setProductData(prev => ({
      ...prev,
      product_gallery: updatedGallery
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const updatedGallery = [...productData.product_gallery];
    URL.revokeObjectURL(updatedGallery[index].url);
    updatedGallery.splice(index, 1);

    setProductData(prev => ({
      ...prev,
      product_gallery: updatedGallery
    }));
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

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Size management functions
  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setSizeForm(prev => ({ ...prev, [name]: value }));

    if (name === 'sku' && !autoGenerateSku) {
      // Check for duplicate SKU only if manually editing
      const isDuplicate = sizeManagement.sizes.some(
        size => size.sku === value && size.sku !== sizeManagement.editingSize?.sku
      );
      setSkuError(isDuplicate ? 'SKU must be unique' : '');
    }
  };

  const addOrUpdateSize = () => {
    if (skuError) return;

    // If auto-generate is on, ensure SKU is generated
    let finalSku = sizeForm.sku;
    if (autoGenerateSku && !finalSku && sizeForm.size) {
      finalSku = generateSku(sizeForm.size);
    }

    const sizeData = {
      ...sizeForm,
      sku: finalSku
    };

    if (sizeManagement.editingSize) {
      // Update existing size
      const updatedSizes = sizeManagement.sizes.map(size =>
        size.sku === sizeManagement.editingSize.sku ? { ...sizeData } : size
      );

      setSizeManagement(prev => ({
        ...prev,
        sizes: updatedSizes,
        editingSize: null
      }));
    } else {
      // Add new size
      const updatedSizes = [...sizeManagement.sizes, sizeData];

      setSizeManagement(prev => ({
        ...prev,
        sizes: updatedSizes,
        selectedSize: sizeData.sku
      }));
    }

    // Clear size error when a size is added
    setSizeError('');

    // Reset form
    setSizeForm({
      size: '',
      sku: '',
      price: '',
      inventory: ''
    });
    setAutoGenerateSku(true);
  };

  const editSize = (sku) => {
    const sizeToEdit = sizeManagement.sizes.find(size => size.sku === sku);
    if (sizeToEdit) {
      setSizeForm({ ...sizeToEdit });
      setSizeManagement(prev => ({
        ...prev,
        editingSize: sizeToEdit
      }));
      setAutoGenerateSku(false); // Disable auto-generation when editing

      // Focus on size input
      if (sizeInputRef.current) {
        sizeInputRef.current.focus();
      }
    }
  };

  const removeSize = (sku) => {
    const updatedSizes = sizeManagement.sizes.filter(size => size.sku !== sku);

    setSizeManagement(prev => ({
      ...prev,
      sizes: updatedSizes,
      selectedSize: updatedSizes.length > 0 ? updatedSizes[0].sku : null,
      editingSize: prev.editingSize?.sku === sku ? null : prev.editingSize
    }));

    // Show error if all sizes are removed
    if (updatedSizes.length === 0) {
      setSizeError('At least one size is required');
    }
  };

  const selectSize = (sku) => {
    setSizeManagement(prev => ({ ...prev, selectedSize: sku }));
  };

  const cancelEdit = () => {
    setSizeForm({
      size: '',
      sku: '',
      price: '',
      inventory: ''
    });
    setSizeManagement(prev => ({ ...prev, editingSize: null }));
    setSkuError('');
    setAutoGenerateSku(true);
  };

  const regenerateSku = () => {
    if (sizeForm.size) {
      const newSku = generateSku(sizeForm.size);
      setSizeForm(prev => ({ ...prev, sku: newSku }));

      // Check for duplicate SKU
      const isDuplicate = sizeManagement.sizes.some(
        size => size.sku === newSku && size.sku !== sizeManagement.editingSize?.sku
      );
      setSkuError(isDuplicate ? 'SKU must be unique' : '');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that at least one size is added
    if (sizeManagement.sizes.length === 0) {
      setSizeError('At least one size is required');
      return;
    }

    // Validate each size has required fields
    for (const size of sizeManagement.sizes) {
      if (!size.size || !size.sku || !size.price || size.inventory === undefined) {
        setSizeError('Each size must have size name, SKU, price, and inventory');
        return;
      }
      
      // Validate price is a positive number
      if (isNaN(size.price) || parseFloat(size.price) <= 0) {
        setSizeError('Price must be a positive number');
        return;
      }
      
      // Validate inventory is a non-negative integer
      // if (!Number.isInteger(size.inventory) || size.inventory < 0) {
      //   setSizeError('Inventory must be a non-negative integer');
      //   return;
      // }
    }

    // Clear any previous size errors
    setSizeError('');

    // Prepare the product data with sizes
    const productWithSizes = {
      ...productData,
      sizes: sizeManagement.sizes
    };

    // Call the parent's handler function with the complete product data
    handleAddProduct(productWithSizes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={() => !isAdding && setShowAddModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transform transition-all">
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
          <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
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
                      name="product_name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={productData.product_name}
                      onChange={handleProductInputChange}
                      placeholder="Enter product name"
                      disabled={isAdding}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FiTag />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Product name will be used to generate SKUs for sizes
                  </p>
                </div>

                <div className="space-y-1">
                  <label htmlFor="product_description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="product_description"
                    name="product_description"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={productData.product_description}
                    onChange={handleProductInputChange}
                    placeholder="Enter product description"
                    disabled={isAdding}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="product_category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      id="product_category"
                      name="product_category"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={productData.product_category}
                      onChange={handleProductInputChange}
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
                      name="product_status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={productData.product_status}
                      onChange={handleProductInputChange}
                      disabled={isAdding}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      {productData.product_status === 'active' ? (
                        <FiToggleRight className="text-green-500" />
                      ) : (
                        <FiToggleLeft className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800 flex items-center">
                  <FiLayers className="mr-2" /> Size Management
                </h4>
                {sizeError && (
                  <div className="flex items-center text-red-600 text-sm">
                    <FiAlertCircle className="mr-1" />
                    {sizeError}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                    <input
                      ref={sizeInputRef}
                      type="text"
                      name="size"
                      value={sizeForm.size}
                      onChange={handleSizeInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., S, M, L, 10, 12"
                      required
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                    <div className="flex">
                      <input
                        type="text"
                        name="sku"
                        value={sizeForm.sku}
                        onChange={handleSizeInputChange}
                        className={`flex-1 border ${skuError ? 'border-red-500' : 'border-gray-300'} rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Will be auto-generated"
                        required
                        readOnly={autoGenerateSku}
                      />
                      <button
                        type="button"
                        onClick={regenerateSku}
                        className="bg-gray-200 text-gray-700 px-3 rounded-r-md hover:bg-gray-300 transition-colors"
                        title="Regenerate SKU"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                    {skuError && <p className="mt-1 text-sm text-red-600">{skuError}</p>}
                    <div className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        id="auto-generate-sku"
                        checked={autoGenerateSku}
                        onChange={(e) => setAutoGenerateSku(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="auto-generate-sku" className="ml-2 block text-xs text-gray-700">
                        Auto-generate SKU from product name and size
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={sizeForm.price}
                      onChange={handleSizeInputChange}
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                    <input
                      type="number"
                      name="inventory"
                      value={sizeForm.inventory}
                      onChange={handleSizeInputChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Quantity"
                    />
                  </div>

                  <div className="md:col-span-1 flex items-end">
                    {sizeManagement.editingSize ? (
                      <div className="flex space-x-2 w-full">
                        <button
                          type="button"
                          onClick={addOrUpdateSize}
                          className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={!!skuError || !sizeForm.size || !sizeForm.sku}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="w-full bg-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={addOrUpdateSize}
                        className="w-full bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                        disabled={!!skuError || !sizeForm.size || !sizeForm.sku}
                      >
                        <FiPlus className="mr-1" /> Add
                      </button>
                    )}
                  </div>
                </div>

                {sizeManagement.sizes.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Product Sizes</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sizeManagement.sizes.map((size, index) => (
                        <div
                          key={size.sku}
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${sizeManagement.selectedSize === size.sku
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                          onClick={() => selectSize(size.sku)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h6 className="font-medium text-gray-800">{size.size}</h6>
                              <p className="text-sm text-gray-600">SKU: {size.sku}</p>
                              <p className="text-sm text-gray-600">Price: ${parseFloat(size.price || 0).toFixed(2)}</p>
                              <p className="text-sm text-gray-600">Stock: {size.inventory || 0}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editSize(size.sku);
                                }}
                                className="text-gray-500 hover:text-blue-600"
                                disabled={isAdding}
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSize(size.sku);
                                }}
                                className="text-gray-500 hover:text-red-600"
                                disabled={isAdding}
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
                        className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${isAdding ? 'pointer-events-none opacity-50' : ''
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
              {productData.product_gallery?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({productData.product_gallery.length}):</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {productData.product_gallery.map((file, index) => (
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
                          className={`absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 ${isAdding ? 'opacity-0 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
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
            className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isAdding ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={() => setShowAddModal(false)}
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-product-form"
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isAdding || sizeManagement.sizes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            disabled={isAdding || sizeManagement.sizes.length === 0}
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