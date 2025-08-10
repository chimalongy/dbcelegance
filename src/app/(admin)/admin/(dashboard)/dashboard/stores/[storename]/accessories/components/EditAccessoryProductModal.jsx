"use client";

import { useState, useEffect } from 'react';
import { FiX, FiImage, FiLoader, FiPlus, FiTrash2 } from 'react-icons/fi';

const EditAccessoryProductModal = ({ setShowEditProductModal, currentProduct, handleEditProduct, categories, isEditingProduct }) => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editProduct, setEditProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stockQuantity: '',
    sku: '',
    status: 'active',
    images: []
  });

  useEffect(() => {
    if (currentProduct) {
      setEditProduct({
        name: currentProduct.name || '',
        description: currentProduct.description || '',
        category: currentProduct.category || '',
        price: currentProduct.price || '',
        stockQuantity: currentProduct.stockQuantity || '',
        sku: currentProduct.sku || '',
        status: currentProduct.status || 'active',
        images: currentProduct.images || []
      });
      
      // Set existing image previews
      if (currentProduct.images && currentProduct.images.length > 0) {
        setImagePreviews(currentProduct.images.map(img => img.url));
      }
    }
  }, [currentProduct]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setEditProduct({
      ...editProduct,
      images: [...editProduct.images, ...files.map(file => ({ file }))]
    });
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedImages = editProduct.images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setEditProduct({ ...editProduct, images: updatedImages });
    setImagePreviews(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditProduct(e);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Accessory Product</h2>
          <button 
            onClick={() => setShowEditProductModal(false)} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editProduct.name}
                onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editProduct.category}
                onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.accessory_category_id} value={category.accessory_category_id}>
                    {category.accessory_category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={editProduct.description}
              onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editProduct.price}
                onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editProduct.stockQuantity}
                onChange={(e) => setEditProduct({...editProduct, stockQuantity: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editProduct.sku}
                onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editProduct.status}
              onChange={(e) => setEditProduct({...editProduct, status: e.target.value})}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <div className="flex items-center mb-2">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 flex items-center">
                <FiImage className="mr-2" />
                Add Images
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
              </label>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full object-cover rounded-md border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-white rounded-full hover:bg-gray-100"
                      >
                        <FiTrash2 className="text-red-600" />
                      </button>
                    </div>
                    <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowEditProductModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={isEditingProduct}
            >
              {isEditingProduct ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccessoryProductModal; 