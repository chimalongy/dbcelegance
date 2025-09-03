"use client";
import React, { useState, useEffect } from "react";
import {
  FiTrash2,
  FiEdit,
  FiLoader,
  FiChevronLeft,
  FiX,
  FiImage,
  FiPlus,
  FiClock,
  FiPackage,
  FiCheck,
  FiSave,
  FiEye,
  FiSliders,
  FiBox,
  FiLayers,
  FiDollarSign,
  FiTag,
  FiGrid,
  FiShoppingCart,
  FiCopy,
} from "react-icons/fi";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useAdminUserStore } from "@/app/lib/store/adminuserstore";
import { apiSummary } from "@/app/lib/apiSummary";
import { useAdminSelectedProductStore } from "@/app/lib/store/adminselectedproductstore";
import EditProductModal from "../components/EditProductModal";
import DeleteProduct from "../components/DeleteProduct";
import DescriptionModal from "../components/DescriptionModal";
import MediaGallery from "./components/MediaGalllery";
import SizeManager from "./components/SizeManager";

const LoadingSpinner = () => (
  <div
    className="flex justify-center items-center h-screen"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="text-center">
      <FiLoader className="animate-spin text-3xl text-blue-500 mx-auto mb-3" />
      <p className="text-gray-500">Loading product details...</p>
    </div>
  </div>
);

const MediaViewer = ({ media, currentIndex, onClose, onNext, onPrev }) => {
  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh]">
        {/* Navigation Controls */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white backdrop-blur-sm"
            aria-label="Close viewer"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Media Content */}
        <div className="relative h-full flex items-center justify-center">
          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:white/20 transition-colors text-white backdrop-blur-sm"
              aria-label="Previous media"
            >
              <FiChevronLeft size={28} />
            </button>
          )}

          <div className="w-full h-full flex items-center justify-center">
            {currentMedia.type === "video" ? (
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
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:white/20 transition-colors text-white backdrop-blur-sm"
              aria-label="Next media"
            >
              <FiChevronLeft size={28} className="transform rotate-180" />
            </button>
          )}
        </div>

        {/* Pagination */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
            {currentIndex + 1} of {media.length}
          </div>
        </div>
      </div>
    </div>
  );
};



// Improved SizeManager component with auto-generated SKUs

const ProductDetailsPage = () => {
  const { adminselectedproduct } = useAdminSelectedProductStore();
  const router = useRouter();
  const params = useParams();
  const store_name = params.storename;
  const admin_user = useAdminUserStore((state) => state.adminuser);

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSizes, setSavingSizes] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (admin_user?.id) {
      if (
        admin_user.role !== "admin" &&
        !admin_user.accessiblepages.some(
          (accessible_page) => accessible_page === "stores"
        )
      ) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        fetchStoreCategories();
      }
    }
  }, [admin_user?.id]);

  useEffect(() => {
    if (adminselectedproduct) {
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
        { product_id: product.product_id }
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

  const handleUpdateProduct = async (updatedProduct) => {
    setIsEditing(true);

    try {
      const formData = new FormData();
      formData.append("product_id", updatedProduct.product_id);
      formData.append("product_name", updatedProduct.product_name);
      formData.append(
        "product_description",
        updatedProduct.product_description || ""
      );
      formData.append("product_category", updatedProduct.product_category);
      formData.append("product_status", updatedProduct.product_status);
      formData.append("product_store", store_name);

      // Append new files
      updatedProduct.product_gallery
        ?.filter((item) => item.file)
        .forEach((item) => {
          formData.append("product_gallery", item.file);
        });

      const res = await axios.post(
        apiSummary.admin.stores.products.update_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product updated successfully!");
        setShowEditModal(false);
        router.push(`/admin/dashboard/stores/${store_name}/products`);
      } else {
        throw new Error(res.data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Internal server error.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateDescription = async (updatedData) => {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.update_product,
        {
          product_id: product.product_id,
          product_description: updatedData.product_description,
          product_features: updatedData.product_features,
        }
      );

      if (response.data.success) {
        setProduct((prev) => ({
          ...prev,
          product_description: updatedData.product_description,
          product_features: updatedData.product_features,
        }));
        toast.success("Description updated successfully");
        setShowDescriptionModal(false);
      } else {
        throw new Error(
          response.data.message || "Failed to update description"
        );
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error(
        error.response?.data?.message || "Failed to update description"
      );
    }
  };

  const handleUpdateSizes = async (updatedSizes) => {

 console.log("SIZES TO UPDATE"+updatedSizes)
  //  setSavingSizes(true);
     const formData = new FormData();
      formData.append("product_id", product.product_id);        // add this
      formData.append("product_store", product.product_store);  // add this
  
      formData.append("product_sizes", JSON.stringify(product.sizes));
   
      console.log(JSON.stringify(formData))

    try {
      const response =  await axios.post(
         apiSummary.admin.stores.products.update_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

         console.log(response)
      if (response.data.success) {
        console.log()
        setProduct((prev) => ({ ...prev, sizes: updatedSizes }));
        return true;
      } else {
        console.log(response.data)
       
        throw new Error(response.data.message || "Failed to update sizes");
      }
    } catch (error) {
      console.log("Error updating sizes:", error);
     
      //toast.error(error.response?.data?.message || "Failed to update sizes");
      return false;
    } finally {
      setSavingSizes(false);
    }
  };

  const deleteProductGalleryItem = async (index) => {
    if (!product?.product_gallery || product.product_gallery.length <= index)
      return;

    setDeletingMedia(true);
    try {
      const mediaItem = product.product_gallery[index];

      const response = await axios.post(
        apiSummary.admin.stores.products.delete_product_gallery_item,
        {
          product_id: product.product_id,
          media_url: mediaItem.url,
          media_index: index,
        }
      );

      if (response.data.success) {
        // Update the product state by removing the deleted media item
        const updatedGallery = product.product_gallery.filter(
          (_, i) => i !== index
        );
        setProduct((prev) => ({
          ...prev,
          product_gallery: updatedGallery,
        }));

        toast.success("Media item deleted successfully");
      } else {
        throw new Error(response.data.message || "Failed to delete media item");
      }
    } catch (error) {
      console.error("Error deleting media item:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete media item"
      );
    } finally {
      setDeletingMedia(false);
    }
  };

  const openMediaViewer = (index = 0) => {
    if (!product?.product_gallery || product.product_gallery.length === 0)
      return;
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev < product.product_gallery.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (loading || !product) {
    return <LoadingSpinner />;
  }

  const category = categories.find(
    (c) => c.category_id === product.product_category
  );
  const createdAt = new Date(product.created_at);
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto lg:px-8 py-8">
      {/* Media Viewer Modal */}
      {showMediaViewer && product.product_gallery && (
        <MediaViewer
          media={product.product_gallery}
          currentIndex={currentMediaIndex}
          onClose={() => setShowMediaViewer(false)}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <button
            onClick={() =>
              router.push(`/admin/dashboard/stores/${store_name}/products`)
            }
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
          >
            <FiChevronLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Products</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {product.product_name}
            </h1>
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                product.product_status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {product.product_status?.toUpperCase()}
            </span>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Edit product name"
            >
              <FiEdit size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <FiEdit className="mr-2 text-gray-600" />
            <span className="text-sm font-medium">Edit Product</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-5 py-2.5 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-xs hover:shadow-md"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <FiLoader className="animate-spin mr-2 text-red-600" />
            ) : (
              <FiTrash2 className="mr-2 text-red-600" />
            )}
            <span className="text-sm font-medium text-red-600">Delete</span>
          </button>
        </div>
      </div>

      {/* Product Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 lg:p-8 p-2 mb-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center">
            <FiSliders className="mr-2 text-blue-500" />
            Product Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl relative">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Category
              </h3>
              <p className="text-gray-900 font-medium">
                {category?.category_name || "Uncategorized"}
              </p>
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Edit category"
              >
                <FiEdit size={14} />
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Created Date
              </h3>
              <p className="text-gray-900 font-medium flex items-center">
                <FiClock className="mr-2 text-gray-400" />
                {formattedDate}
              </p>
            </div>
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl relative">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {product.product_description || "No description provided."}
              </p>
              <button
                onClick={() => setShowDescriptionModal(true)}
                className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Edit description"
              >
                <FiEdit size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Sizes Manager */}
        <div className="border-t border-gray-200 pt-8">
          <SizeManager
            sizes={product.sizes}
            onUpdateSizes={handleUpdateSizes}
            isSaving={savingSizes}
            productName={product.product_name}
          />
        </div>
      </div>

      {/* Media Gallery Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FiImage className="mr-2 text-blue-500" />
            Media Gallery
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any image to view in full screen
          </p>
        </div>
        <div className="p-8">
          <MediaGallery
            media={product.product_gallery}
            onPreview={openMediaViewer}
            onDelete={deleteProductGalleryItem}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
              <FiLayers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Sizes</p>
              <p className="text-2xl font-bold text-blue-800">
                {product.sizes?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
              <FiShoppingCart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Total Inventory
              </p>
              <p className="text-2xl font-bold text-green-800">
                {product.sizes?.reduce(
                  (total, size) => total + (parseInt(size.inventory) || 0),
                  0
                ) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
              <FiDollarSign className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Price Range</p>
              <p className="text-2xl font-bold text-purple-800">
                {product.sizes?.length > 0
                  ? `$${Math.min(
                      ...product.sizes.map((s) => parseFloat(s.price))
                    )} - $${Math.max(
                      ...product.sizes.map((s) => parseFloat(s.price))
                    )}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

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
          isEditing={isEditing}
        />
      )}

      {/* Description Modal */}
      {showDescriptionModal && (
        <DescriptionModal
          setShowDescriptionModal={setShowDescriptionModal}
          currentProduct={product}
          handleUpdateDescription={handleUpdateDescription}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
