"use client";

import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';

// Sample category images (replace with your actual image paths)
const categoryImages = {
  "Shirts": "/images/stores/male/categories/shirts.jpg",
  "Jeans": "/images/stores/male/categories/jeans.jpg",
  "Trousers": "/images/stores/male/categories/trousers.jpg",
  
};

export default function CategoriesPage() {
  // Sample data with image references
  const [categories, setCategories] = useState([
    { id: 1, name: "Shirts", status: "active", createdAt: "2023-05-15", image: categoryImages["Shirts"] },
    { id: 2, name: "Jeans", status: "active", createdAt: "2023-04-22", image: categoryImages["Jeans"] },
    { id: 3, name: "Trousers", status: "active", createdAt: "2023-04-22", image: categoryImages["Trousers"] },
   
  ]);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for form data
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    status: "active",
    image: ""
  });

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Filter categories based on search and filters
  const filteredCategories = sortedCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle add category
  const handleAddCategory = (e) => {
    e.preventDefault();
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const categoryToAdd = {
      ...newCategory,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      image: newCategory.image //|| "/images/categories/default.jpg" // Default image if none provided
    };
    setCategories([...categories, categoryToAdd]);
    setNewCategory({ name: "", status: "active", image: "" });
    setShowAddModal(false);
  };

  // Handle edit category
  const handleEditCategory = (e) => {
    e.preventDefault();
    setCategories(categories.map(cat => 
      cat.id === currentCategory.id ? currentCategory : cat
    ));
    setShowEditModal(false);
  };

  // Handle delete category
  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== currentCategory.id));
    setShowDeleteModal(false);
  };

  // Open edit modal and set current category
  const openEditModal = (category) => {
    setCurrentCategory({ ...category });
    setShowEditModal(true);
  };

  // Open delete modal and set current category
  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Category
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
              placeholder="Search categories..."
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
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
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
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created
                    {sortConfig.key === "createdAt" && (
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-md overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No categories found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal 
          setShowAddModal={setShowAddModal} 
          newCategory={newCategory} 
          setNewCategory={setNewCategory} 
          handleAddCategory={handleAddCategory} 
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && currentCategory && (
        <EditCategoryModal 
          setShowEditModal={setShowEditModal} 
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          handleEditCategory={handleEditCategory}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentCategory && (
        <DeleteCategoryModal  
          setShowDeleteModal={setShowDeleteModal} 
          handleDeleteCategory={handleDeleteCategory} 
          currentCategory={currentCategory} 
        />
      )}
    </div>
  );
}