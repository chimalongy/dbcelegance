import React from 'react';
import {
  FiX
} from 'react-icons/fi';

export default function EditProductModal({
  setShowEditModal,
  setCurrentProduct,
  currentProduct,
  handleEditProduct,
  uniqueCategories
}) {
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

          <form onSubmit={handleEditProduct} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, name: e.target.value })
                  }
                />
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="edit-sku" className="block text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <input
                  type="text"
                  id="edit-sku"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentProduct.sku}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, sku: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="edit-category"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, category: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                  Price *
                </label>
                <div className="mt-2 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    id="edit-price"
                    min="0"
                    step="0.01"
                    required
                    className="pl-7 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({
                        ...currentProduct,
                        price: parseFloat(e.target.value)
                      })
                    }
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="edit-stock"
                  min="0"
                  required
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentProduct.stock}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      stock: parseInt(e.target.value)
                    })
                  }
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="edit-status"
                  className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={currentProduct.status}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentProduct.images.length > 0 ? (
                  currentProduct.images.map((img, index) => (
                    <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden">
                      <img src={img} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm text-red-500 hover:text-red-700"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No images uploaded</div>
                )}
              </div>

              <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload-edit"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload more images</span>
                      <input id="file-upload-edit" name="file-upload" type="file" className="sr-only" multiple />
                    </label>
                  </div>
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
