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
import { useAdminSelectedAccessoryStore } from "@/app/lib/store/adminselectedaccessorystore";
import EditAccessoryProductModal from "../components/EditAccessoryProductModal";
import DeleteAccessoryProductModal from "../components/DeleteAccessoryProductModal";
import MediaGallery from "./components/MediaGallery";
import SizeManager from "./components/SizeManager";

const LoadingSpinner = () => (
  <div
    className="flex justify-center items-center h-screen"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="text-center">
      <FiLoader className="animate-spin text-3xl text-blue-500 mx-auto mb-3" />
      <p className="text-gray-500">Loading accessory details...</p>
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
              className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white backdrop-blur-sm"
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
                alt={`Accessory media ${currentIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            )}
          </div>

          {currentIndex < media.length - 1 && (
            <button
              onClick={onNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white backdrop-blur-sm"
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

// Helper function to parse accessory description
const parseAccessoryDescription = (descriptionString) => {
  try {
    if (!descriptionString) {
      return {
        description: "",
        accessory_features: [],
        accessory_size_and_fit: []
      };
    }

    // If it's already an object, return it
    if (typeof descriptionString === 'object') {
      return {
        description: descriptionString.description || "",
        accessory_features: descriptionString.accessory_features || [],
        accessory_size_and_fit: descriptionString.accessory_size_and_fit || []
      };
    }

    // Try to parse as JSON
    const parsed = JSON.parse(descriptionString);
    return {
      description: parsed.description || "",
      accessory_features: parsed.accessory_features || [],
      accessory_size_and_fit: parsed.accessory_size_and_fit || []
    };
  } catch (error) {
    console.warn("Failed to parse accessory description as JSON, treating as plain text:", error);
    // Fallback: treat as plain text description
    return {
      description: typeof descriptionString === 'string' ? descriptionString : "",
      accessory_features: [],
      accessory_size_and_fit:[]
    };
  }
};

const AccessoryDetailsPage = () => {
  const { adminselectedaccessory } = useAdminSelectedAccessoryStore();
  const router = useRouter();
  const params = useParams();
  const store_name = params.storename;
  const accessory_name = params.accessoryname;
  const admin_user = useAdminUserStore((state) => state.adminuser);

  const [accessory, setAccessory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSizes, setSavingSizes] = useState(false);
  const [deletingMedia, setDeletingMedia] = useState(false);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Parse description when accessory changes
  const parsedDescription = accessory ? parseAccessoryDescription(accessory.accessory_description) : { description: "", accessory_features: [], accessory_size_and_fit:[] };
   console.log(parsedDescription)
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
        fetchAccessoryCategories();
        fetchAccessoryData();
      }
    }
  }, [admin_user?.id, store_name, accessory_name]);

  useEffect(() => {
    // Only use store data if we don't have accessory data from API fetch
    if (adminselectedaccessory && !accessory) {
      setAccessory(adminselectedaccessory);
      setLoading(false);
    }
  }, [adminselectedaccessory, accessory]);

  const fetchAccessoryCategories = async () => {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_categories,
        { accessory_category_store: store_name }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching accessory categories:", error);
      toast.error("Failed to fetch accessory categories");
    }
  };

  const fetchAccessoryData = async () => {
    try {
      setLoading(true);
      // Decode the accessory name from URL
      const decodedAccessoryName = decodeURIComponent(accessory_name);
      
      // Get all accessories for the store and find the specific one
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_products,
        { accessory_store: store_name }
      );
      
      if (response.data.success && response.data.data) {
        const foundAccessory = response.data.data.find(
          acc => acc.accessory_name === decodedAccessoryName
        );
        
        if (foundAccessory) {
          // Parse JSONB fields if they exist
          if (foundAccessory.accessory_gallery && typeof foundAccessory.accessory_gallery === 'string') {
            try {
              foundAccessory.accessory_gallery = JSON.parse(foundAccessory.accessory_gallery);
            } catch (e) {
              console.warn("Could not parse accessory gallery JSON:", e);
              foundAccessory.accessory_gallery = [];
            }
          }
          
          if (foundAccessory.accessory_sizes && typeof foundAccessory.accessory_sizes === 'string') {
            try {
              foundAccessory.accessory_sizes = JSON.parse(foundAccessory.accessory_sizes);
            } catch (e) {
              console.warn("Could not parse accessory sizes JSON:", e);
              foundAccessory.accessory_sizes = [];
            }
          }
          
          setAccessory(foundAccessory);
          setLoading(false);
        } else {
          console.log("Accessory not found:", decodedAccessoryName);
          console.log("Available accessories:", response.data.data.map(acc => acc.accessory_name));
          toast.error("Accessory not found");
          router.push(`/admin/dashboard/stores/${store_name}/accessories`);
        }
      } else {
        throw new Error("Failed to fetch accessories");
      }
    } catch (error) {
      console.error("Error fetching accessory data:", error);
      toast.error("Failed to fetch accessory data");
      router.push(`/admin/dashboard/stores/${store_name}/accessories`);
    }
  };

  const handleDeleteAccessory = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.delete_product,
        { accessory_id: accessory.accessory_id }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Accessory deleted successfully!");
        router.push(`/admin/dashboard/stores/${store_name}/accessories`);
      } else {
        throw new Error(response.data.message || "Failed to delete accessory.");
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
      toast.error(error.response?.data?.message || "Failed to delete accessory.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateAccessory = async (updatedAccessory) => {
    setIsEditing(true);

    try {
      const formData = new FormData();
      formData.append("accessory_id", updatedAccessory.accessory_id);
      formData.append("accessory_name", updatedAccessory.accessory_name);
      formData.append(
        "accessory_description",
        updatedAccessory.accessory_description || ""
      );
      formData.append("accessory_category", updatedAccessory.accessory_category);
      formData.append("accessory_status", updatedAccessory.accessory_status);
      formData.append("accessory_store", store_name);

      // Append new files
      updatedAccessory.accessory_gallery
        ?.filter((item) => item.file)
        .forEach((item) => {
          formData.append("accessory_gallery", item.file);
        });

      const res = await axios.post(
        apiSummary.admin.stores.accessories.update_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Accessory updated successfully!");
        setShowEditModal(false);
        router.push(`/admin/dashboard/stores/${store_name}/accessories`);
      } else {
        throw new Error(res.data.message || "Failed to update accessory.");
      }
    } catch (error) {
      console.error("Error updating accessory:", error);
      toast.error(error.response?.data?.message || "Internal server error.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUpdateSizes = async (updatedSizes) => {
    console.log("SIZES TO UPDATE", updatedSizes);
    setSavingSizes(true);
    
    const formData = new FormData();
    formData.append("accessory_id", accessory.accessory_id);
    formData.append("accessory_store", accessory.accessory_store);
    formData.append("accessory_sizes", JSON.stringify(updatedSizes));

    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.update_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setAccessory((prev) => ({ ...prev, accessory_sizes: updatedSizes }));
        toast.success("Sizes updated successfully");
        return true;
      } else {
        throw new Error(response.data.message || "Failed to update sizes");
      }
    } catch (error) {
      console.error("Error updating sizes:", error);
      toast.error(error.response?.data?.message || "Failed to update sizes");
      return false;
    } finally {
      setSavingSizes(false);
    }
  };

  const deleteAccessoryGalleryItem = async (item, index) => {
    if (!accessory?.accessory_gallery || accessory.accessory_gallery.length <= index)
      return;

    setDeletingMedia(true);
    try {
      const mediaItem = accessory.accessory_gallery[index];

      const response = await axios.post(
        apiSummary.admin.stores.accessories.delete_accessory_gallery_item,
        {
          accessory_id: accessory.accessory_id,
          media_url: mediaItem.url,
          media_index: index,
        }
      );

      if (response.data.success) {
        const updatedGallery = accessory.accessory_gallery.filter(
          (_, i) => i !== index
        );
        setAccessory((prev) => ({
          ...prev,
          accessory_gallery: updatedGallery,
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

  const addAccessoryGalleryItems = async (items) => {
    for (const galleryItem of items) {
      if (galleryItem.file) {
        const formData = new FormData();
        formData.append("accessory_id", accessory.accessory_id);
        formData.append("accessory_gallery", galleryItem.file);

        try {
          const res = await axios.post(
            apiSummary.admin.stores.accessories.add_accessory_gallery_item,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          console.log("Uploaded:", res.data);
        } catch (err) {
          console.error("Upload failed:", err);
        }
      }
    }
  };

  const openMediaViewer = (index = 0) => {
    if (!accessory?.accessory_gallery || accessory.accessory_gallery.length === 0)
      return;
    setCurrentMediaIndex(index);
    setShowMediaViewer(true);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev < accessory.accessory_gallery.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (loading || !accessory) {
    return <LoadingSpinner />;
  }

  const category = categories.find(
    (c) => c.accessory_category_id === accessory.accessory_category
  );
  const createdAt = new Date(accessory.created_at);
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto lg:px-8 py-8">
      {/* Media Viewer Modal */}
      {showMediaViewer && accessory.accessory_gallery && (
        <MediaViewer
          media={accessory.accessory_gallery}
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
              router.push(`/admin/dashboard/stores/${store_name}/accessories`)
            }
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
          >
            <FiChevronLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Accessories</span>
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {accessory.accessory_name}
            </h1>
            <span
              className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                accessory.accessory_status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {accessory.accessory_status?.toUpperCase()}
            </span>
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Edit accessory name"
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
            <span className="text-sm font-medium">Edit Accessory</span>
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

      {/* Accessory Information Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 lg:p-8 p-2 mb-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200 flex items-center">
            <FiSliders className="mr-2 text-blue-500" />
            Accessory Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl relative">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Category
              </h3>
              <p className="text-gray-900 font-medium">
                {category?.accessory_category_name || "Uncategorized"}
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
                {parsedDescription.description || "No description provided."}
              </p>
              {parsedDescription.accessory_features && parsedDescription.accessory_features.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {parsedDescription.accessory_features.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                title="Edit description"
              >
                <FiEdit size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Accessory Sizes Manager */}
        <div className="border-t border-gray-200 pt-8">
          <SizeManager
            sizes={accessory.accessory_sizes}
            onUpdateSizes={handleUpdateSizes}
            isSaving={savingSizes}
            accessoryName={accessory.accessory_name}
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
            media={accessory.accessory_gallery}
            onPreview={openMediaViewer}
            onDelete={deleteAccessoryGalleryItem}
            onAdd={addAccessoryGalleryItems}
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
                {accessory.accessory_sizes?.length || 0}
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
                {accessory.accessory_sizes?.reduce(
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
                {accessory.accessory_sizes?.length > 0
                  ? `$${Math.min(
                      ...accessory.accessory_sizes.map((s) => parseFloat(s.price))
                    )} - $${Math.max(
                      ...accessory.accessory_sizes.map((s) => parseFloat(s.price))
                    )}`
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Accessory Modal */}
      {showDeleteModal && (
        <DeleteAccessoryProductModal
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteProduct={handleDeleteAccessory}
          currentProduct={accessory}
          isDeleting={isDeleting}
        />
      )}

      {/* Edit Accessory Modal */}
      {showEditModal && (
        <EditAccessoryProductModal
          setShowEditModal={setShowEditModal}
          currentProduct={accessory}
          handleEditProduct={handleUpdateAccessory}
          categories={categories}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default AccessoryDetailsPage;
