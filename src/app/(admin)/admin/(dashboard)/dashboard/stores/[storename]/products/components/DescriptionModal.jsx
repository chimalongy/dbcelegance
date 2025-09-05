import React, { useState } from 'react';
import { FiX, FiTrash2, FiPlus } from 'react-icons/fi';

export default function DescriptionModal({
  setShowDescriptionModal,
  currentProduct,
  handleUpdateDescription,
}) {
  const [editedProduct, setEditedProduct] = useState({
    product_description: currentProduct?.product_description || "",
    product_features: currentProduct?.product_features || [""],
    product_size_and_fit: currentProduct?.product_size_and_fit || [""]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty features and size/fit items before saving
    const filteredFeatures = editedProduct.product_features.filter(feature => feature.trim() !== "");
    const filteredSizeAndFit = editedProduct.product_size_and_fit.filter(item => item.trim() !== "");
    
    handleUpdateDescription({
      product_description: editedProduct.product_description,
      product_features: filteredFeatures,
      product_size_and_fit: filteredSizeAndFit
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...editedProduct.product_features];
    newFeatures[index] = value;
    setEditedProduct({
      ...editedProduct,
      product_features: newFeatures
    });
  };

  const handleSizeAndFitChange = (index, value) => {
    const newSizeAndFit = [...editedProduct.product_size_and_fit];
    newSizeAndFit[index] = value;
    setEditedProduct({
      ...editedProduct,
      product_size_and_fit: newSizeAndFit
    });
  };

  const addFeature = () => {
    setEditedProduct({
      ...editedProduct,
      product_features: [...editedProduct.product_features, ""]
    });
  };

  const addSizeAndFit = () => {
    setEditedProduct({
      ...editedProduct,
      product_size_and_fit: [...editedProduct.product_size_and_fit, ""]
    });
  };

  const removeFeature = (index) => {
    if (editedProduct.product_features.length <= 1) return;
    
    const newFeatures = [...editedProduct.product_features];
    newFeatures.splice(index, 1);
    setEditedProduct({
      ...editedProduct,
      product_features: newFeatures
    });
  };

  const removeSizeAndFit = (index) => {
    if (editedProduct.product_size_and_fit.length <= 1) return;
    
    const newSizeAndFit = [...editedProduct.product_size_and_fit];
    newSizeAndFit.splice(index, 1);
    setEditedProduct({
      ...editedProduct,
      product_size_and_fit: newSizeAndFit
    });
  };

  if (!currentProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 z-40"
        onClick={() => setShowDescriptionModal(false)}
      ></div>

      {/* Modal */}
      <div className="relative z-50 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Scrollable Content */}
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800">Edit Description, Features & Size/Fit</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowDescriptionModal(false)}
            >
              <FiX size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="product_description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                id="product_description"
                rows={5}
                className="w-full border border-gray-300 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editedProduct.product_description}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, product_description: e.target.value })
                }
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Features List */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Features
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <FiPlus className="mr-1" />
                  Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
                {editedProduct.product_features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {editedProduct.product_features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                          title="Remove feature"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Add key features and specifications of your product
              </p>
            </div>

            {/* Size and Fit Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Size & Fit Information
                </label>
                <button
                  type="button"
                  onClick={addSizeAndFit}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <FiPlus className="mr-1" />
                  Add Size/Fit Info
                </button>
              </div>
              
              <div className="space-y-3">
                {editedProduct.product_size_and_fit.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleSizeAndFitChange(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Size/Fit detail ${index + 1}`}
                      />
                      {editedProduct.product_size_and_fit.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSizeAndFit(index)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                          title="Remove size/fit info"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Add information about sizing, fit, measurements, or care instructions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex justify-end space-x-3 border-t border-gray-100">
              <button
                type="button"
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowDescriptionModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
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