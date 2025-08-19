"use client";

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiLoader, FiPackage } from 'react-icons/fi';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';
import { toast } from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { useRouter } from 'next/navigation';
import AddAccessoryCategoryModal from './components/AddAccessoryCategoryModal';
import AddAccessoryProductModal from './components/AddAccessoryProductModal';
import EditAccessoryCategoryModal from './components/EditAccessoryCategoryModal';
import DeleteAccessoryCategoryModal from './components/DeleteAccessoryCategoryModal';
import EditAccessoryProductModal from './components/EditAccessoryProductModal';
import DeleteAccessoryProductModal from './components/DeleteAccessoryProductModal';

const AccessoryManagement = () => {
  const router = useRouter();
  const admin_user = useAdminUserStore(state => state.adminuser);
  const params = useParams();
  const store_name = params.storename;

  // Data states
  const [accessoryCategories, setAccessoryCategories] = useState([]);
  const [accessoryProducts, setAccessoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    price: '',
    stockQuantity: '',
    sku: '',
    status: 'active',
    images: []
  });

  // Fetch accessory categories
  async function fetchAccessoryCategories() {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_categories,
        { accessory_category_store: store_name }
      );
      setAccessoryCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching accessory categories:", error);
      toast.error("Failed to fetch accessory categories");
    }
  }

  // Fetch accessory products
  async function fetchAccessoryProducts() {
    try {
      const response = await axios.post(
        apiSummary.admin.stores.accessories.get_all_products,
        { accessory_store: store_name }
      );
      setAccessoryProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching accessory products:", error);
      toast.error("Failed to fetch accessory products");
    }
  }

  useEffect(() => {
    if (admin_user?.id) {
      if (admin_user.role !=="admin" &&(!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores"))) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        fetchAccessoryCategories();
        fetchAccessoryProducts();
        setLoading(false);
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

      const response = await axios.post(
        apiSummary.admin.stores.accessories.add_category,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Accessory category added successfully!");
        setAccessoryCategories([...accessoryCategories, response.data.data]);
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

      const response = await axios.post(
        apiSummary.admin.stores.accessories.update_category,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Accessory category updated successfully!");
        const updatedCategories = accessoryCategories.map(cat =>
          cat.accessory_category_id === currentCategory.accessory_category_id 
            ? response.data.data 
            : cat
        );
        setAccessoryCategories(updatedCategories);
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
      const response = await axios.post(
        apiSummary.admin.stores.accessories.delete_category,
        { accessory_category_id: currentCategory.accessory_category_id }
      );

      if (response.data.success) {
        toast.success("Accessory category deleted successfully!");
        setAccessoryCategories(accessoryCategories.filter(cat => 
          cat.accessory_category_id !== currentCategory.accessory_category_id
        ));
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
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);

    try {
      const formData = new FormData();
      formData.append("accessory_name", newProduct.name);
      formData.append("accessory_description", newProduct.description || "");
      formData.append("accessory_category", newProduct.category);
      formData.append("accessory_price", newProduct.price);
      formData.append("stock_quantity", newProduct.stockQuantity);
      formData.append("sku", newProduct.sku || "");
      formData.append("accessory_status", newProduct.status);
      formData.append("accessory_store", store_name);

      // Append actual File objects
      newProduct.images.forEach((item) => {
        formData.append("accessory_gallery", item.file);
      });

      const response = await axios.post(
        apiSummary.admin.stores.accessories.add_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Accessory product added successfully!");
        setAccessoryProducts([...accessoryProducts, response.data.data]);
        setShowAddProductModal(false);
        setNewProduct({
          name: '',
          description: '',
          category: '',
          price: '',
          stockQuantity: '',
          sku: '',
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

      const response = await axios.post(
        apiSummary.admin.stores.accessories.update_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Accessory product updated successfully!");
        const updatedProducts = accessoryProducts.map(prod =>
          prod.accessory_id === currentProduct.accessory_id 
            ? response.data.data 
            : prod
        );
        setAccessoryProducts(updatedProducts);
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
      const response = await axios.post(
        apiSummary.admin.stores.accessories.delete_product,
        { accessory_id: currentProduct.accessory_id }
      );

      if (response.data.success) {
        toast.success("Accessory product deleted successfully!");
        setAccessoryProducts(accessoryProducts.filter(prod => 
          prod.accessory_id !== currentProduct.accessory_id
        ));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Accessory Management</h1>
          <p className="text-sm text-gray-500">
            Manage your accessory categories and products
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
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {activeTab === 'products' && (
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          )}

          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredCategories.length === 0 ? (
            <div className="p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No categories found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first category.</p>
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
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const category = accessoryCategories.find(c => c.accessory_category_id === product.accessory_category);
                    
                    return (
                      <tr key={product.accessory_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.accessory_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            {product.accessory_gallery?.length > 0 ? (
                              <img
                                src={product.accessory_gallery[0].url}
                                alt={product.accessory_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <FiPackage className="text-gray-400 h-6 w-6" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.accessory_name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{product.accessory_description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category?.accessory_category_name || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.accessory_price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock_quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.accessory_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.accessory_status.charAt(0).toUpperCase() + product.accessory_status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditProductModal(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            disabled={isDeletingProduct}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => openDeleteProductModal(product)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeletingProduct}
                          >
                            {isDeletingProduct ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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