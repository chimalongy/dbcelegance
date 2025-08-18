import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';

const VariantTest = ({ productId, productStore }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${apiSummary.admin.stores.products.get_variants}?product_id=${productId}`
      );
      
      if (response.data.success) {
        setVariants(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
      setError(error.response?.data?.message || 'Failed to fetch variants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchVariants();
    }
  }, [productId]);

  const testCreateVariant = async () => {
    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("product_store", productStore);
      formData.append("sku", `TEST-${Date.now()}`);
      formData.append("variant_status", "active");

      const response = await axios.post(
        apiSummary.admin.stores.products.add_variant,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        console.log('Variant created:', response.data.data);
        fetchVariants(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating test variant:', error);
    }
  };

  const testDeleteVariant = async (variantId) => {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.delete_variant,
        { variant_id: variantId }
      );

      if (response.data.success) {
        console.log('Variant deleted:', response.data.data);
        fetchVariants(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting variant:', error);
    }
  };

  if (!productId) {
    return <div className="text-gray-500">No product selected</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Variant System Test</h3>
      
      <div className="space-y-4">
        <button
          onClick={testCreateVariant}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Test Variant
        </button>

        <button
          onClick={fetchVariants}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
        >
          Refresh Variants
        </button>

        {loading && <div className="text-blue-600">Loading...</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Variants ({variants.length}):</h4>
          {variants.length === 0 ? (
            <p className="text-gray-500">No variants found</p>
          ) : (
            <div className="space-y-2">
              {variants.map((variant) => (
                <div key={variant.variant_id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium">{variant.sku}</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      variant.variant_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {variant.variant_status}
                    </span>
                  </div>
                  <button
                    onClick={() => testDeleteVariant(variant.variant_id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantTest; 