"use client";

import { useState } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, 
  FiChevronDown, FiChevronUp, FiImage, FiDollarSign,
  FiTag, FiLayers, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import AddProductModal from './components/AddProductModal';
import EditProductModal from './components/EditProductModal';
import DeleteCategoryModal from '../categories/components/DeleteCategoryModal';
import DeleteProduct from './components/DeleteProduct';

export default function ProductsPage() {
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Classic White T-Shirt",
      sku: "TS-WHITE-001",
      category: "T-Shirts",
      price: 29.99,
      stock: 150,
      status: "active",
      images: ["/placeholder-product.jpg"],
      createdAt: "2023-05-15"
    },
    {
      id: 2,
      name: "Slim Fit Jeans",
      sku: "JN-SLIM-001",
      category: "Jeans",
      price: 89.99,
      stock: 75,
      status: "active",
      images: ["/placeholder-product.jpg"],
      createdAt: "2023-04-22"
    },
    {
      id: 3,
      name: "Summer Floral Dress",
      sku: "DR-FLORAL-001",
      category: "Dresses",
      price: 129.99,
      stock: 42,
      status: "active",
      images: ["/placeholder-product.jpg"],
      createdAt: "2023-06-10"
    },
    {
      id: 4,
      name: "Leather Sneakers",
      sku: "SN-LEATHER-001",
      category: "Shoes",
      price: 149.99,
      stock: 0,
      status: "inactive",
      images: ["/placeholder-product.jpg"],
      createdAt: "2023-03-18"
    },
    {
      id: 5,
      name: "Silk Scarf",
      sku: "SC-SILK-001",
      category: "Accessories",
      price: 49.99,
      stock: 120,
      status: "active",
      images: ["/placeholder-product.jpg"],
      createdAt: "2023-07-05"
    },
  ]);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // State for form data
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
    status: "active",
    images: []
  });

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Filter products based on search and filters
  const filteredProducts = sortedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, productToAdd]);
    setNewProduct({ 
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
      status: "active",
      images: []
    });
    setShowAddModal(false);
  };

  // Handle edit product
  const handleEditProduct = (e) => {
    e.preventDefault();
    setProducts(products.map(prod => 
      prod.id === currentProduct.id ? currentProduct : prod
    ));
    setShowEditModal(false);
  };

  // Handle delete product
  const handleDeleteProduct = () => {
    setProducts(products.filter(prod => prod.id !== currentProduct.id));
    setShowDeleteModal(false);
  };

  // Open edit modal and set current product
  const openEditModal = (product) => {
    setCurrentProduct({ ...product });
    setShowEditModal(true);
  };

  // Open delete modal and set current product
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Open image modal
  const openImageModal = (product) => {
    setCurrentProduct(product);
    setShowImageModal(true);
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(products.map(product => product.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("id")}
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === "id" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Name
                    {sortConfig.key === "name" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("sku")}
                >
                  <div className="flex items-center">
                    SKU
                    {sortConfig.key === "sku" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("category")}
                >
                  <div className="flex items-center">
                    Category
                    {sortConfig.key === "category" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("price")}
                >
                  <div className="flex items-center">
                    Price
                    {sortConfig.key === "price" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("stock")}
                >
                  <div className="flex items-center">
                    Stock
                    {sortConfig.key === "stock" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === "status" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => openImageModal(product)}
                        className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center"
                      >
                        {product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiImage className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && <AddProductModal setShowAddModal={setShowAddModal}setNewProduct={setNewProduct}handleAddProduct={handleAddProduct} uniqueCategories={uniqueCategories} newProduct={newProduct}  />}

      {/* Edit Product Modal */}
      {showEditModal && currentProduct && <EditProductModal setShowEditModal= {setShowEditModal} setCurrentProduct ={setCurrentProduct}currentProduct={currentProduct} handleEditProduct={handleEditProduct} uniqueCategories={uniqueCategories}/> }

      {/* Image View Modal */}
      {showImageModal && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={() => setShowImageModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{currentProduct.name}</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowImageModal(false)}
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="mt-4">
                  {currentProduct.images.length > 0 ? (
                    <div className="flex justify-center">
                      <img 
                        src={currentProduct.images[0]} 
                        alt={currentProduct.name}
                        className="max-h-96 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                      <div className="text-center">
                        <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowImageModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentProduct && <DeleteProduct setShowDeleteModal={setShowDeleteModal} handleDeleteProduct={handleDeleteProduct} currentProduct ={currentProduct}/>}
    </div>
  );
}