"use client";

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader, FiPackage, FiX, FiChevronLeft, FiChevronRight, FiXCircle } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';
import { toast } from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { useRouter } from 'next/navigation';
import { makeAdminFormDataPost, makeAdminJsonPost } from '@/app/lib/apiHelper';
import { useAdminSelectedAccessoryStore } from '@/app/lib/store/adminselectedaccessorystore';
import AddAccessoryCategoryModal from './components/AddAccessoryCategoryModal';
import AddAccessoryProductModal from './components/AddAccessoryProductModal';
import EditAccessoryCategoryModal from './components/EditAccessoryCategoryModal';
import DeleteAccessoryCategoryModal from './components/DeleteAccessoryCategoryModal';
import EditAccessoryProductModal from './components/EditAccessoryProductModal';
import DeleteAccessoryProductModal from './components/DeleteAccessoryProductModal';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
    <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
    <span className="sr-only">Loading...</span>
  </div>
);

// No products found component
const NoProductsFound = ({ products, clearFilters, openAddModal }) => (
  <div className="p-8 text-center">
    <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-lg font-medium text-gray-900">
      {products.length === 0 ? 'No products yet' : 'No matching products found'}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {products.length === 0
        ? "Get started by adding your first product."
        : "Try adjusting your search or filter criteria."}
    </p>
    <div className="mt-6 flex justify-center gap-4">
      {products.length === 0 ? (
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" /> Add First Product
        </button>
      ) : (
        <>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear all filters
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> Add New Product
          </button>
        </>
      )}
    </div>
  </div>
);

// Media Gallery Modal
const MediaGalleryModal = ({ media, currentIndex, onClose, onNext, onPrev }) => {
  if (!media || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-screen">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 focus:outline-none"
          aria-label="Close gallery"
        >
          <FiXCircle size={28} />
        </button>

        <div className="flex items-center justify-center h-full">
          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
              aria-label="Previous image"
            >
              <FiChevronLeft size={32} />
            </button>
          )}

          <div className="flex items-center justify-center w-full h-full">
            <img
              src={currentMedia.url}
              alt={`Accessory media ${currentIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>

          {currentIndex < media.length - 1 && (
            <button
              onClick={onNext}
              className="absolute right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 focus:outline-none"
              aria-label="Next image"
            >
              <FiChevronRight size={32} />
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-white text-sm">
          {currentIndex + 1} of {media.length}
        </div>
      </div>
    </div>
  );
};

// Product item component
const ProductItem = ({
  product,
  categories,
  handleDeleteProduct,
  openEditProduct,
  isDeletingProduct,
  openMediaGallery,
  setAdminSelectedAccessory
}) => {
  const category = categories.find(c => c.accessory_category_id === product.accessory_category);

  return (
    <li key={product.accessory_id} className="bg-white hover:bg-gray-50 transition-colors">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex items-start space-x-4 min-w-0">
            <div 
              className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={() => openMediaGallery(product.accessory_gallery)}
            >
              {product.accessory_gallery?.length > 0 ? (
                <img
                  src={product.accessory_gallery[0].url}
                  alt={product.accessory_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              ) : (
                <FiPackage className="text-gray-400 h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center">
                <button
                  onClick={() => {
                    const encodedName = encodeURIComponent(product.accessory_name);
                    const url = `${window.location.pathname}/${encodedName}`;
                    console.log("Navigating to:", url);
                    setAdminSelectedAccessory(product);
                    window.location.href = url;
                  }}
                  className="text-lg font-medium text-gray-800 truncate hover:text-blue-600 transition-colors text-left"
                >
                  {product.accessory_name}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {product.accessory_description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {category.accessory_category_name}
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.accessory_status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {product.accessory_status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ${product.accessory_price}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Stock: {product.stock_quantity}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openEditProduct(product)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
              aria-label={`Edit product ${product.accessory_name}`}
            >
              <FiEdit2 size={18} />
            </button>

            <button
              onClick={() => handleDeleteProduct(product.accessory_id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              aria-label={`Delete product ${product.accessory_name}`}
              disabled={isDeletingProduct}
            >
              {isDeletingProduct ? <FiLoader className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

const AccessoryManagement = () => {
  const setAdminSelectedAccessory = useAdminSelectedAccessoryStore(state => state.setadminselectedaccessory);
  const clearAdminSelectedAccessory = useAdminSelectedAccessoryStore(state => state.clearadminselectedaccessory);
  const adminselectedaccessory = useAdminSelectedAccessoryStore(state => state.adminselectedaccessory);
  const router = useRouter();
  const admin_user = useAdminUserStore(state => state.adminuser);
  const params = useParams();
  const store_name = params.storename;

  // Data states
  const [accessoryCategories, setAccessoryCategories] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [fetchingProducts, setFetchingProducts] = useState(false);
  // For media gallery like products page
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMedia, setCurrentMedia] = useState([]);

  // Active tab state
  const [activeTab, setActiveTab] = useState('categories');

  // Modal states
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);

  // Loading states
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Selected items
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form data
  const [newCategory, setNewCategory] = useState({
    name: '',
    status: 'active',
    image: null
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active',
    images: []
  });

  // Fetch accessory categories
  async function fetchAccessoryCategories() {
    setFetchingCategories(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_categories,
        { accessory_category_store: store_name }
      );
      setAccessoryCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching accessory categories:", error);
      toast.error("Failed to fetch accessory categories");
    } finally {
      setFetchingCategories(false);
    }
  }

  // Fetch accessory products
  async function fetchAccessoryProducts() {
    setFetchingProducts(true);
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_products,
        { accessory_store: store_name }
      );
      setAccessoryProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching accessory products:", error);
      toast.error("Failed to fetch accessory products");
    } finally {
      setFetchingProducts(false);
    }
  }

  useEffect(() => {
    if (admin_user?.id) {
      if (admin_user.role !=="admin" &&(!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores"))) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        // Fetch both categories and products
        Promise.all([fetchAccessoryCategories(), fetchAccessoryProducts()])
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [admin_user?.id]);

  // Filter data based on search and filters
  const filteredCategories = accessoryCategories.filter(category => {
    const matchesSearch = category.accessory_category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || category.accessory_category_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProducts = accessoryProducts.filter(product => {
    const matchesSearch = product.accessory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.accessory_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.accessory_status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.accessory_category === parseInt(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Category handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setIsAddingCategory(true);

    try {
      const formData = new FormData();
      formData.append("accessory_category_name", newCategory.name);
      formData.append("accessory_category_status", newCategory.status);
      formData.append("accessory_category_store", store_name);

      if (newCategory.image instanceof File) {
        formData.append("accessory_category_image", newCategory.image);
      }

      const response = await makeAdminFormDataPost(
        apiSummary.admin.stores.accessories.add_category,
        formData
      );

      if (response.data.success) {
        toast.success("Accessory category added successfully!");
        await fetchAccessoryCategories();
        setShowAddCategoryModal(false);
        setNewCategory({ name: '', status: 'active', image: null });
      } else {
        throw new Error(response.data.message || "Failed to add accessory category.");
      }
    } catch (err) {
      console.log("Add accessory category error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to add accessory category. Please try again.");
      }
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    setIsEditingCategory(true);

    try {
      const formData = new FormData();
      formData.append("accessory_category_id", currentCategory.accessory_category_id);
      formData.append("accessory_category_name", currentCategory.name);
      formData.append("accessory_category_status", currentCategory.status);
      formData.append("accessory_category_store", store_name);

      if (currentCategory.image instanceof File) {
        formData.append("accessory_category_image", currentCategory.image);
      }

      const response = await makeAdminFormDataPost(
        apiSummary.admin.stores.accessories.update_category,
        formData
      );

      if (response.data.success) {
        toast.success("Accessory category updated successfully!");
        await fetchAccessoryCategories();
        setShowEditCategoryModal(false);
        setCurrentCategory(null);
      } else {
        throw new Error(response.data.message || "Failed to update accessory category.");
      }
    } catch (err) {
      console.log("Edit accessory category error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to update accessory category. Please try again.");
      }
    } finally {
      setIsEditingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    setIsDeletingCategory(true);

    try {
      const response = await makeAdminJsonPost(
        apiSummary.admin.stores.accessories.delete_category,
        { accessory_category_id: currentCategory.accessory_category_id }
      );

      if (response.data.success) {
        toast.success("Accessory category deleted successfully!");
        await fetchAccessoryCategories();
        setShowDeleteCategoryModal(false);
        setCurrentCategory(null);
      } else {
        throw new Error(response.data.message || "Failed to delete accessory category.");
      }
    } catch (err) {
      console.log("Delete accessory category error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to delete accessory category. Please try again.");
      }
    } finally {
      setIsDeletingCategory(false);
    }
  };

  // Product handlers
  const handleAddProduct = async (productData) => {
    setIsAddingProduct(true);

    try {
      const formData = new FormData();
      formData.append("accessory_name", productData.name);
      formData.append("accessory_description", productData.description || "");
      formData.append("accessory_category", productData.category);
      formData.append("accessory_status", productData.status);
      formData.append("accessory_store", store_name);

      // Handle sizes - convert to JSONB format for database
      if (productData.sizes && productData.sizes.length > 0) {
        formData.append("accessory_sizes", JSON.stringify(productData.sizes));
      }

      // Append actual File objects (ignore preview-only entries)
      (productData.images || [])
        .filter((item) => item && item.file instanceof File)
        .forEach((item) => {
          formData.append("accessory_gallery", item.file);
        });

      const response = await makeAdminFormDataPost(
        apiSummary.admin.stores.accessories.add_product,
        formData
      );

      if (response.data.success) {
        toast.success("Accessory product added successfully!");
        await fetchAccessoryProducts();
        setShowAddProductModal(false);
        setNewProduct({
          name: '',
          description: '',
          category: '',
          status: 'active',
          images: []
        });
      } else {
        throw new Error(response.data.message || "Failed to add accessory product.");
      }
    } catch (err) {
      console.log("Add accessory product error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to add accessory product. Please try again.");
      }
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setIsEditingProduct(true);

    try {
      const formData = new FormData();
      formData.append("accessory_id", currentProduct.accessory_id);
      formData.append("accessory_name", currentProduct.name);
      formData.append("accessory_description", currentProduct.description || "");
      formData.append("accessory_category", currentProduct.category);
      formData.append("accessory_price", currentProduct.price);
      formData.append("stock_quantity", currentProduct.stockQuantity);
      formData.append("sku", currentProduct.sku || "");
      formData.append("accessory_status", currentProduct.status);
      formData.append("accessory_store", store_name);

      // Append new File objects only
      currentProduct.images.forEach((item) => {
        if (item.file instanceof File) {
          formData.append("accessory_gallery", item.file);
        }
      });

      const response = await makeAdminFormDataPost(
        apiSummary.admin.stores.accessories.update_product,
        formData
      );

      if (response.data.success) {
        toast.success("Accessory product updated successfully!");
        await fetchAccessoryProducts();
        setShowEditProductModal(false);
        setCurrentProduct(null);
      } else {
        throw new Error(response.data.message || "Failed to update accessory product.");
      }
    } catch (err) {
      console.log("Edit accessory product error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to update accessory product. Please try again.");
      }
    } finally {
      setIsEditingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    setIsDeletingProduct(true);

    try {
      const response = await makeAdminJsonPost(
        apiSummary.admin.stores.accessories.delete_product,
        { accessory_id: currentProduct.accessory_id }
      );

      if (response.data.success) {
        toast.success("Accessory product deleted successfully!");
        await fetchAccessoryProducts();
        setShowDeleteProductModal(false);
        setCurrentProduct(null);
      } else {
        throw new Error(response.data.message || "Failed to delete accessory product.");
      }
    } catch (err) {
      console.log("Delete accessory product error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || "Failed to delete accessory product. Please try again.");
      }
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Modal handlers
  const openEditCategoryModal = (category) => {
    setCurrentCategory({
      accessory_category_id: category.accessory_category_id,
      name: category.accessory_category_name,
      status: category.accessory_category_status,
      image: category.accessory_category_image
    });
    setShowEditCategoryModal(true);
  };

  const openDeleteCategoryModal = (category) => {
    setCurrentCategory({
      accessory_category_id: category.accessory_category_id,
      name: category.accessory_category_name
    });
    setShowDeleteCategoryModal(true);
  };

  const openEditProductModal = (product) => {
    setCurrentProduct({
      accessory_id: product.accessory_id,
      name: product.accessory_name,
      description: product.accessory_description,
      category: product.accessory_category,
      price: product.accessory_price,
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      status: product.accessory_status,
      images: product.accessory_gallery || []
    });
    setShowEditProductModal(true);
  };

  const openDeleteProductModal = (product) => {
    setCurrentProduct({
      accessory_id: product.accessory_id,
      name: product.accessory_name
    });
    setShowDeleteProductModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  // Open media gallery for accessory products (images only)
  const openMediaGallery = (media, index = 0) => {
    if (!media || media.length === 0) return;
    setCurrentMedia(media);
    setCurrentMediaIndex(index);
    setShowMediaGallery(true);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => (prev < currentMedia.length - 1 ? prev + 1 : prev));
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Show loading spinner when initially loading
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto">
      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGalleryModal
          media={currentMedia}
          currentIndex={currentMediaIndex}
          onClose={() => setShowMediaGallery(false)}
          onNext={handleNextMedia}
          onPrev={handlePrevMedia}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {activeTab === 'products' ? 'Accessory Products' : 'Accessory Management'}
          </h1>
          <p className="text-sm text-gray-500">
            {activeTab === 'products' 
              ? 'Manage your accessory products' 
              : 'Manage your accessory categories and products'
            }
          </p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'categories') {
              setShowAddCategoryModal(true);
            } else {
              setShowAddProductModal(true);
            }
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add {activeTab === 'categories' ? 'Category' : 'Product'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('categories')}
        >
          Accessory Categories
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Accessory Products
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="order-1 md:order-none">
            <label htmlFor="search" className="sr-only">Search {activeTab}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 w-5 h-5" />
              </div>
              <input
                id="search"
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  aria-label="Clear search"
                >
                  <FiX className="text-gray-400 hover:text-gray-600 w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-4 order-2 md:order-none md:grid-cols-1 md:contents">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {activeTab === 'products' && (
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-colors"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {accessoryCategories.map(category => (
                    <option key={category.accessory_category_id} value={category.accessory_category_id}>
                      {category.accessory_category_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Clear Filters */}
          <div className="order-3 md:order-none">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md
              text-gray-600 hover:bg-gray-100 hover:text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!searchTerm && statusFilter === 'all' && (activeTab === 'categories' || categoryFilter === 'all')}
            >
              <FiX className="mr-1 w-4 h-4" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{activeTab === 'categories' ? filteredCategories.length : filteredProducts.length}</span> of{' '}
          <span className="font-medium">{activeTab === 'categories' ? accessoryCategories.length : accessoryProducts.length}</span> {activeTab}
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {fetchingCategories ? (
            <LoadingSpinner />
          ) : filteredCategories.length === 0 ? (
            <div className="p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {accessoryCategories.length === 0 ? 'No categories yet' : 'No matching categories found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {accessoryCategories.length === 0 ? 'Get started by adding your first category.' : 'Try adjusting your search or filter criteria.'}
              </p>
              <div className="mt-6 flex justify-center gap-4">
                {accessoryCategories.length === 0 ? (
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="mr-2" /> Add First Category
                  </button>
                ) : (
                  <>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear all filters
                    </button>
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="mr-2" /> Add New Category
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.accessory_category_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.accessory_category_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img
                            src={category.accessory_category_image}
                            alt={category.accessory_category_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.accessory_category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.accessory_category_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {category.accessory_category_status.charAt(0).toUpperCase() + category.accessory_category_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditCategoryModal(category)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={isDeletingCategory}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => openDeleteCategoryModal(category)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeletingCategory}
                        >
                          {isDeletingCategory ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {fetchingProducts ? (
            <LoadingSpinner />
          ) : filteredProducts.length === 0 ? (
            <NoProductsFound
              products={accessoryProducts}
              clearFilters={clearFilters}
              openAddModal={() => setShowAddProductModal(true)}
            />
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <ProductItem
                  key={product.accessory_id}
                  product={product}
                  categories={accessoryCategories}
                  handleDeleteProduct={() => openDeleteProductModal(product)}
                  openEditProduct={openEditProductModal}
                  isDeletingProduct={isDeletingProduct}
                  openMediaGallery={openMediaGallery}
                  setAdminSelectedAccessory={setAdminSelectedAccessory}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <AddAccessoryCategoryModal
          setShowAddCategoryModal={setShowAddCategoryModal}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
          isAddingCategory={isAddingCategory}
        />
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <AddAccessoryProductModal
          setShowAddProductModal={setShowAddProductModal}
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          categories={accessoryCategories}
          isAddingProduct={isAddingProduct}
        />
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && (
        <EditAccessoryCategoryModal
          setShowEditCategoryModal={setShowEditCategoryModal}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          handleEditCategory={handleEditCategory}
          isEditingCategory={isEditingCategory}
        />
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && (
        <DeleteAccessoryCategoryModal
          setShowDeleteCategoryModal={setShowDeleteCategoryModal}
          currentCategory={currentCategory}
          handleDeleteCategory={handleDeleteCategory}
          isDeletingCategory={isDeletingCategory}
        />
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <EditAccessoryProductModal
          setShowEditProductModal={setShowEditProductModal}
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          handleEditProduct={handleEditProduct}
          categories={accessoryCategories}
          isEditingProduct={isEditingProduct}
        />
      )}

      {/* Delete Product Modal */}
      {showDeleteProductModal && (
        <DeleteAccessoryProductModal
          setShowDeleteProductModal={setShowDeleteProductModal}
          currentProduct={currentProduct}
          handleDeleteProduct={handleDeleteProduct}
          isDeletingProduct={isDeletingProduct}
        />
      )}
    </div>
  );
};

export default AccessoryManagement;