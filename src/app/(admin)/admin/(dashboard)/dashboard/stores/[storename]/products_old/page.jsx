"use client"
import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiTrash2, FiChevronRight, FiPackage,
  FiSearch, FiFilter, FiX, FiLoader, FiXCircle
} from 'react-icons/fi';
import AddProductModal from './components/AddProductModal';
import DeleteProduct from './components/DeleteProduct';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { useRouter } from 'next/navigation';
import { apiSummary } from '@/app/lib/apiSummary';
import { useAdminSelectedProductStore } from '@/app/lib/store/adminselectedproductstore';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
    <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
    <span className="sr-only">Loading...</span>
  </div>
);

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

const ProductsManagement = () => {
  const setAdminSelectedProduct = useAdminSelectedProductStore(state => state.setadminselectedproduct);
  const clearAdminSelectedProduct = useAdminSelectedProductStore(state => state.clearadminselectedproduct);
  const adminselectedproduct = useAdminSelectedProductStore(state => state.adminselectedproduct);
  const router = useRouter();
  const admin_user = useAdminUserStore(state => state.adminuser);
  const params = useParams();
  const store_name = params.storename;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_description: '',
    product_category: 0,
    product_status: 'active',
    product_gallery: [],
    product_store: store_name
  });

  async function fetchstorecategories() {
    try {
      setLoading(true);
      const response = await axios.post(
        apiSummary.admin.stores.categories.get_all_categories,
        { category_store: store_name }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    }
  }

  async function fetchStoreProducts() {
    try {
      setLoading(true);
      const response = await axios.post(
        apiSummary.admin.stores.products.get_all_products,
        { product_store: store_name }
      );
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (admin_user?.id) {
      if (!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores")) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        fetchstorecategories();
        fetchStoreProducts();
      }
    }
  }, [admin_user?.id]);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCategory !== 'all') {
      result = result.filter(product =>
        product.product_category === parseInt(selectedCategory)
      );
    }

    if (selectedStatus !== 'all') {
      result = result.filter(product =>
        product.product_status === selectedStatus
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedStatus, products]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const formData = new FormData();
      formData.append("product_name", newProduct.product_name);
      formData.append("product_description", newProduct.product_description || "");
      formData.append("product_category", newProduct.product_category);
      formData.append("product_status", newProduct.product_status);
      formData.append("product_store", store_name);

      newProduct.product_gallery.forEach((item) => {
        formData.append("product_gallery", item.file);
      });

      const res = await axios.post(
        apiSummary.admin.stores.products.add_product,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Product created successfully!");
        setNewProduct({
          product_name: "",
          product_description: "",
          product_category: 0,
          product_status: "active",
          product_gallery: [],
          product_store: store_name
        });
        setShowAddModal(false);
        await fetchStoreProducts();
      } else {
        throw new Error(res.data.message || "Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Internal server error.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setIsDeleting(true);

    try {
      const response = await axios.post(
        apiSummary.admin.stores.products.delete_product,
        { product_id: productId }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product deleted successfully!");
        await fetchStoreProducts();
        setShowDeleteModal(false);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const navigateToProduct = (productId) => {
    router.push(`/admin/dashboard/stores/${store_name}/products/${productId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your store products
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="order-1 md:order-none">
            <label htmlFor="search" className="sr-only">Search products</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 w-5 h-5" />
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search products..."
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

          <div className="grid grid-cols-2 gap-4 order-2 md:order-none md:grid-cols-1 md:contents">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition-colors"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="order-3 md:order-none">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md
              text-gray-600 hover:bg-gray-100 hover:text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!searchTerm && selectedCategory === 'all' && selectedStatus === 'all'}
            >
              <FiX className="mr-1 w-4 h-4" /> Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
          <span className="font-medium">{products.length}</span> products
        </div>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredProducts.length === 0 ? (
          <NoProductsFound
            products={products}
            clearFilters={clearFilters}
            openAddModal={() => setShowAddModal(true)}
          />
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredProducts.map(product => {
              const category = categories.find(c => c.category_id === product.product_category);

              return (
                <li key={product.product_id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.product_gallery?.length > 0 ? (
                            <img
                              src={product.product_gallery[0].url}
                              alt={product.product_name}
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
                            <h3 className="text-lg font-medium text-gray-800 truncate">
                              {product.product_name}
                            </h3>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {product.variants?.length || 0} variants
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {category && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {category.category_name}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.product_status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              {product.product_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button

                          /// set admin selected product

                          onClick={() => {
                            clearAdminSelectedProduct();
                            setAdminSelectedProduct(product);
                            navigateToProduct(product.product_name)
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                          aria-label={`View product ${product.product_name}`}
                        >
                          <FiChevronRight size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                          aria-label={`Delete product ${product.product_name}`}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <FiLoader className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          setShowAddModal={setShowAddModal}
          setNewProduct={setNewProduct}
          handleAddProduct={handleAddProduct}
          categories={categories}
          newProduct={newProduct}
          isAdding={isAdding}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <DeleteProduct
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteProduct={() => handleDeleteProduct(selectedProduct.product_id)}
          currentProduct={selectedProduct}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ProductsManagement;