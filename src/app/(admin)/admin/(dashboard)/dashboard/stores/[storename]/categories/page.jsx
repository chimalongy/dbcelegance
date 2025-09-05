"use client";

import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronDown, FiChevronUp, FiLoader } from 'react-icons/fi';
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { useRouter } from 'next/navigation';
import { makeAdminFormDataPost, makeAdminJsonPost } from '@/app/lib/apiHelper';

export default function CategoriesPage() {
  const router = useRouter();
  const admin_user = useAdminUserStore(state => state.adminuser);
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchstorecategories() {
    try {
      setLoading(true);
      const response = await axios.post(
        apiSummary.admin.stores.categories.get_all_categories, 
        { category_store: params.storename }
      );
      setCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (admin_user?.id) {
     if (admin_user.role !=="admin" &&(!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores"))) {
        toast.error("You don't have access to this page.");
        router.push("/admin/dashboard/");
      } else {
        fetchstorecategories();
      }
    }
  }, [admin_user?.id]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form data
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    status: "active",
    image: null
  });

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ 
    key: "category_id", 
    direction: "ascending" 
  });

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

  // Filter categories
  const filteredCategories = sortedCategories.filter(category => {
    const matchesSearch = category.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || category.category_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle add category
 const handleAddCategory = async (e) => {
  e.preventDefault();
  setIsAdding(true);

  try {
    const formData = new FormData();
    formData.append("category_name", newCategory.name);
    formData.append("category_status", newCategory.status);
    formData.append("category_store", params.storename);

    if (newCategory.image instanceof File) {
      formData.append("category_image", newCategory.image);
    }

    const response = await makeAdminFormDataPost(
      apiSummary.admin.stores.categories.add_category,
      formData
    );

    if (response.data.success) {
      toast.success("Category added successfully!");
      setCategories([...categories, response.data.data]);
      setShowAddModal(false);
      setNewCategory({ name: "", status: "active", image: null });
    } else {
      throw new Error(response.data.message || "Failed to add category.");
    }
  } catch (err) {
    console.log("Add category error:", err);

    // Handle Axios errors with server-provided message
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error(err.message || "Failed to add category. Please try again.");
    }
  } finally {
    setIsAdding(false);
  }
};

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const formData = new FormData();
      formData.append("category_id", currentCategory.id);
      formData.append("category_name", currentCategory.name);
      formData.append("category_status", currentCategory.status);
      formData.append("category_store", currentCategory.store);

      if (currentCategory.image instanceof File) {
        formData.append("category_image", currentCategory.image);
      }

      const response = await makeAdminFormDataPost(
        apiSummary.admin.stores.categories.update_category,
        formData
      );

      if (response.data.success) {
        toast.success("Category updated successfully!");
        setCategories(categories.map(cat =>
          cat.category_id === currentCategory.id ? response.data.data : cat
        ));
        setShowEditModal(false);
      } else {
        throw new Error(response.data.message || "Failed to update category.");
      }
    } catch (err) {
      console.error("Edit category error:", err);
      toast.error(err.message || "Failed to update category. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    setIsDeleting(true);

    try {
      const response = await makeAdminJsonPost(
        apiSummary.admin.stores.categories.delete_category,
        { category_id: currentCategory.category_id }
      );

      if (response.data.success) {
        setCategories(categories.filter(cat => cat.category_id !== currentCategory.category_id));
        toast.success("Category deleted successfully!");
        setShowDeleteModal(false);
      } else {
        throw new Error(response.data.message || "Failed to delete category.");
      }
    } catch (err) {
      console.error("Delete category error:", err);
      toast.error(err.message || "Failed to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
      setCurrentCategory(null);
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setCurrentCategory({ 
      id: category.category_id,
      name: category.category_name,
      status: category.category_status,
      image: category.category_image,
      store: params.storename,
      category_id: category.category_id // Keeping this for backward compatibility
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setCurrentCategory({
      category_id: category.category_id,
      name: category.category_name,
      // Add any other properties you want to display in the modal
    });
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
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
            <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
            <p>Loading categories...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("category_id")}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === "category_id" && (
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
                    onClick={() => requestSort("category_name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === "category_name" && (
                        sortConfig.direction === "ascending" ?
                          <FiChevronUp className="ml-1" /> :
                          <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("category_status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === "category_status" && (
                        sortConfig.direction === "ascending" ?
                          <FiChevronUp className="ml-1" /> :
                          <FiChevronDown className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort("created_at")}
                  >
                    <div className="flex items-center">
                      Created
                      {sortConfig.key === "created_at" && (
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
                  filteredCategories.map((category,index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index+1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img
                            src={category.category_image}
                            alt={category.category_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.category_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.category_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {category.category_status.charAt(0).toUpperCase() + category.category_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(category)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          disabled={isEditing}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => openDeleteModal(category)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
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
        )}
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          setShowAddModal={setShowAddModal}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          handleAddCategory={handleAddCategory}
          isAdding={isAdding}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && currentCategory && (
        <EditCategoryModal
          setShowEditModal={setShowEditModal}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          handleEditCategory={handleEditCategory}
          isEditing={isEditing}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentCategory && (
        <DeleteCategoryModal
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteCategory={handleDeleteCategory}
          currentCategory={currentCategory}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}