"use client"
import React, { useState, useEffect } from 'react';
import {
  FiTrash2, FiEdit, FiLayers, FiLoader, FiChevronLeft, FiX,
  FiXCircle, FiImage, FiPlus, FiInfo, FiDollarSign, FiTag,
  FiGrid, FiArchive, FiClock, FiShoppingBag
} from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { apiSummary } from '@/app/lib/apiSummary';
import AddVariantModal from '../components/AddVariantModal';
import EditVariantModal from '../components/EditVariantModal';
import DeleteProductVariantModal from '../components/DeleteProductVariantModal';
import DeleteProduct from '../components/DeleteProduct';
import { useAdminSelectedProductStore } from '@/app/lib/store/adminselectedproductstore';
import EditProductModal from '../components/EditProductModal';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen" aria-live="polite" aria-busy="true">
    <div className="text-center">
      <FiLoader className="animate-spin text-3xl text-gray-400 mx-auto mb-3" />
      <p className="text-gray-500">Loading product details...</p>
    </div>
  </div>
);

const MediaViewer = ({ media, currentIndex, onClose, onNext, onPrev, onDelete }) => {
  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-full max-w-6xl max-h-[90vh]">
        {/* Navigation Controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Close viewer"
          >
            <FiX size={24} />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(currentMedia)}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors text-white"
              aria-label="Delete media"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="relative h-full flex items-center justify-center">
          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Previous media"
            >
              <FiChevronLeft size={28} />
            </button>
          )}

          <div className="w-full h-full flex items-center justify-center">
            {currentMedia.type === 'video' ? (
              <video 
                src={currentMedia.url} 
                controls 
                autoPlay
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={`Product media ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            )}
          </div>

          {currentIndex < media.length - 1 && (
            <button
              onClick={onNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
              aria-label="Next media"
            >
              <FiChevronLeft size={28} className="transform rotate-180" />
            </button>
          )}
        </div>

        {/* Pagination */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 rounded-full px-3 py-1 text-sm text-white">
            {currentIndex + 1} of {media.length}
          </div>
        </div>
      </div>
    </div>
  );
};

const VariantTable = ({ variants, onEdit, onDelete, isDeleting }) => {
  if (!variants || variants.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <FiShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-500">No variants yet</h3>
        <p className="text-gray-400 mt-1">Add your first variant to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attributes
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {variants.map((variant) => (
            <tr key={variant.variant_id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{variant.sku}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {variant.color && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {variant.color}
                    </span>
                  )}
                  {variant.size && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {variant.size}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <FiDollarSign className="text-gray-400 mr-1 flex-shrink-0" />
                  {variant.price?.toFixed(2) || '0.00'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  variant.variant_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {variant.variant_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onEdit(variant)}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label={`Edit variant ${variant.sku}`}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(variant)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    aria-label={`Delete variant ${variant.sku}`}
                    disabled={isDeleting}
                  >
                    {isDeleting ? <FiLoader className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MediaGallery = ({ media, onPreview, onDelete, isDeleting }) => {
  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <FiImage className="mx-auto h-10 w-10 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-500">No media yet</h3>
        <p className="text-gray-400 mt-1">Add images to showcase your product</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {media.map((item, index) => (
        <div key={index} className="relative group">
          <div
            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:ring-2 hover:ring-blue-500/30"
            onClick={() => onPreview(index)}
          >
            {item.type === 'video' ? (
              <video
                src={item.url}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={item.url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                  e.target.innerHTML = '<FiImage className="text-gray-400 text-3xl" />';
                }}
              />
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
            disabled={isDeleting}
            aria-label={`Delete image ${index + 1}`}
          >
            {isDeleting ? (
              <FiLoader className="animate-spin" size={16} />
            ) : (
              <FiX size={16} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

const ProductDetailsPage = () => {
  const { adminselectedproduct } = useAdminSelectedProductStore();
  const router = useRouter();
  const params = useParams();
  const store_name = params.storename;
  const product_id = params.productid;
  const admin_user = useAdminUserStore(state => state.adminuser);

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showEditVariantModal, setShowEditVariantModal] = useState(false);
  const [showDeleteVariantModal, setShowDeleteVariantModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingVariant, setIsDeletingVariant] = useState(false);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);

  // Selected items
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVariantToDelete, setSelectedVariantToDelete] = useState(null);

  useEffect(() => {
    if (admin_user?.id) {
      if (!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores")) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        fetchStoreCategories();
      }
    }
  }, [admin_user?.id]);

  useEffect(() => {
    if (adminselectedproduct?.product_id) {
      setProduct(adminselectedproduct);
      setLoading(false);
    }
  }, [adminselectedproduct]);

  const fetchStoreCategories = async () => {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.categories.get_all_categories,
        { category_store: store_name }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  };

  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.delete_product,
        { product_id }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Product deleted successfully!");
        router.push(`/admin/dashboard/stores/${store_name}/products`);
      } else {
        throw new Error(response.data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    setIsDeletingVariant(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.delete_variant,
        { variant_id: variantId }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Variant deleted successfully!");
        // Refresh product data
        const productRes = await axios.post(
          apiSummary.admin.stores.products.get_product,
          { product_id }
        );
        setProduct(productRes.data.data);
        setShowDeleteVariantModal(false);
      } else {
        throw new Error(response.data.message || "Failed to delete variant.");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error(error.response?.data?.message || "Failed to delete variant.");
    } finally {
      setIsDeletingVariant(false);
    }
  };

  const handleDeleteMedia = async (mediaItem) => {
    setIsDeletingMedia(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.delete_media,
        {
          product_id,
          media_url: mediaItem.url
        }
      );
      if (response.data.success) {
        toast.success("Media deleted successfully!");
        // Refresh product data
        const productRes = await axios.post(
          apiSummary.admin.stores.products.get_product,
          { product_id }
        );
        setProduct(productRes.data.data);
        setShowMediaViewer(false);
      } else {
        throw new Error(response.data.message || "Failed to delete media.");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error(error.response?.data?.message || "Failed to delete media.");
    } finally {
      setIsDeletingMedia(false);
    }
  };

  const handleAddVariant = async () => {
    // Refresh product data after adding variant
    const productRes = await axios.post(
      apiSummary.admin.stores.products.get_product,
      { product_id }
    );
    setProduct(productRes.data.data);
    setShowVariantModal(false);
  };

  const handleUpdateVariant = async () => {
    // Refresh product data after updating variant
    const productRes = await axios.post(
      apiSummary.admin.stores.products.get_product,
      { product_id }
    );
    setProduct(productRes.data.data);
    setShowEditVariantModal(false);
  };

  const handleUpdateProduct = async () => {
    // Refresh product data after updating
    const productRes = await axios.post(
      apiSummary.admin.stores.products.get_product,
      { product_id }
    );
    setProduct(productRes.data.data);
    setShowEditModal(false);
  };

  const openMediaViewer = (index = 0) => {
    if (!product?.product_gallery || product.product_gallery.length === 0) return;
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(prev => (prev < product.product_gallery.length - 1 ? prev + 1 : prev));
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  if (loading || !product || categories.length === 0) {
    return <LoadingSpinner />;
  }

  const category = categories.find(c => c.category_id === product.product_category);
  const createdAt = new Date(product.created_at);
  const formattedDate = createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Media Viewer Modal */}
      {showMediaViewer && product.product_gallery && (
        <MediaViewer
          media={product.product_gallery}
          currentIndex={currentMediaIndex}
          onClose={() => setShowMediaViewer(false)}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
          onDelete={handleDeleteMedia}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <button
            onClick={() => router.push(`/admin/dashboard/stores/${store_name}/products`)}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-3 transition-colors"
          >
            <FiChevronLeft className="mr-2" />
            <span className="text-sm">Back to Products</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              product.product_status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.product_status}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-xs"
          >
            <FiEdit className="mr-2 text-gray-600" />
            <span className="text-sm font-medium">Edit Product</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2.5 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors shadow-xs"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <FiLoader className="animate-spin mr-2 text-red-600" />
            ) : (
              <FiTrash2 className="mr-2 text-red-600" />
            )}
            <span className="text-sm font-medium text-red-600">Delete Product</span>
          </button>
        </div>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Product Image */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {product.product_gallery?.length > 0 ? (
            <div 
              className="aspect-square bg-gray-50 flex items-center justify-center cursor-pointer"
              onClick={() => openMediaViewer(0)}
            >
              <img
                src={product.product_gallery[0].url}
                alt={product.product_name}
                className="w-full h-full object-contain p-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                  e.target.innerHTML = '<FiImage className="text-gray-300 text-5xl" />';
                }}
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-50 flex items-center justify-center">
              <FiImage className="text-gray-300 text-5xl" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <p className="text-gray-900">
                  {category?.category_name || 'Uncategorized'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                <p className="text-gray-900 flex items-center">
                  <FiClock className="mr-2 text-gray-400" />
                  {formattedDate}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.product_description || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Inventory Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500 mb-1">Total Variants</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {product.variants?.length || 0}
                </p>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500 mb-1">Active</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {product.variants?.filter(v => v.variant_status === 'active').length || 0}
                </p>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500 mb-1">Inactive</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {product.variants?.filter(v => v.variant_status === 'inactive').length || 0}
                </p>
              </div>
              <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-xs font-medium text-gray-500 mb-1">Media Files</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {product.product_gallery?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiGrid className="mr-2 text-gray-500" />
            Product Variants
          </h2>
          <button
            onClick={() => setShowVariantModal(true)}
            className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            <FiPlus className="mr-2" />
            <span className="text-sm">Add Variant</span>
          </button>
        </div>
        <div className="p-6">
          <VariantTable
            variants={product.variants}
            onEdit={(variant) => {
              setSelectedVariant(variant);
              setShowEditVariantModal(true);
            }}
            onDelete={(variant) => {
              setSelectedVariantToDelete(variant);
              setShowDeleteVariantModal(true);
            }}
            isDeleting={isDeletingVariant}
          />
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FiImage className="mr-2 text-gray-500" />
            Media Gallery
          </h2>
        </div>
        <div className="p-6">
          <MediaGallery
            media={product.product_gallery}
            onPreview={openMediaViewer}
            onDelete={handleDeleteMedia}
            isDeleting={isDeletingMedia}
          />
        </div>
      </div>

      {/* Add Variant Modal */}
      {showVariantModal && (
        <AddVariantModal
          product={product}
          setShowVariantModal={setShowVariantModal}
          onVariantAdded={handleAddVariant}
        />
      )}

      {/* Edit Variant Modal */}
      {showEditVariantModal && selectedVariant && (
        <EditVariantModal
          variant={selectedVariant}
          product={product}
          setShowEditVariantModal={setShowEditVariantModal}
          onVariantUpdated={handleUpdateVariant}
        />
      )}

      {/* Delete Variant Modal */}
      {showDeleteVariantModal && selectedVariantToDelete && (
        <DeleteProductVariantModal
          setShowDeleteVariantModal={setShowDeleteVariantModal}
          handleDeleteVariant={() => handleDeleteVariant(selectedVariantToDelete.variant_id)}
          currentVariant={selectedVariantToDelete}
          currentProduct={product}
          isDeletingVariant={isDeletingVariant}
        />
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && (
        <DeleteProduct
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteProduct={handleDeleteProduct}
          currentProduct={product}
          isDeleting={isDeleting}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <EditProductModal
          setShowEditModal={setShowEditModal}
          currentProduct={product}
          handleEditProduct={handleUpdateProduct}
          categories={categories}
          isEditing={false}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;