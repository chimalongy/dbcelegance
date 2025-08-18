"use client";

import { useState, useEffect } from 'react';
import { 
  FiUserPlus, FiEdit2, FiTrash2, FiSearch, 
  FiChevronDown, FiChevronUp, FiUser, FiCheck, 
  FiX, FiLoader, FiPlus, FiFilter, FiRefreshCw 
} from 'react-icons/fi';
import AddUserModal from '../AdminDashboardComponents/Modals/AddUserModal.jsx';
import EditUserModal from '../AdminDashboardComponents/Modals/EditUserModal.jsx';
import DeleteConfirmationModal from '../AdminDashboardComponents/Modals/DeleteConfirmationModal.jsx';
import { apiSummary } from '@/app/lib/apiSummary.js';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
    status: 'active',
    accessiblePages: []
  });
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await axios.get(apiSummary.admin.users.get_all_users);
      // Ensure each user has accessiblePages array initialized
      console.log(result.data.data)
      const usersWithAccess = result.data.data.map(user => ({
        ...user,
        accessiblePages:JSON.parse( user.accessiblepages ) || []
      }));
      setUsers(usersWithAccess);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        accessiblePages: newUser.role === 'user' ? newUser.accessiblePages : []
      };

      const response = await axios.post(apiSummary.admin.users.add_new_user, payload);
      const result = response.data;

      setUsers([...users, {
        ...result.data,
        accessiblePages: payload.accessiblePages
      }]);
      setShowAddModal(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        status: 'active',
        accessiblePages: []
      });
      toast.success(result.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add user');
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const payload = {
        id: updatedUser.id,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        accessiblePages: updatedUser.role === 'user' ? updatedUser.accessiblePages : []
      };

      const response = await axios.post(apiSummary.admin.users.update_user_data, payload);
      const result = response.data;

      if (result.success) {
        setUsers(users.map(user => 
          user.id === updatedUser.id ? { ...updatedUser, accessiblePages: payload.accessiblePages } : user
        ));
        setShowEditModal(false);
        toast.success(result.message || 'User updated successfully');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDeleteConfirmation = async (id) => {
    try {
      const response = await axios.post(apiSummary.admin.users.delete_user, { id });
      const result = response.data;

      if (result.success) {
        setUsers(users.filter(user => user.id !== id));
        setShowDeleteModal(false);
        toast.success("User deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
      console.error(error);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser({
      ...user,
      accessiblePages: user.accessiblePages || []
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />;
  };

  const sortedAndFilteredUsers = [...users]
    .filter(user => {
      const matchesSearch = 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatLocation = (location) => {
    if (!location || location === "Location Unknown") return "Unknown";
    return location;
  };

  const formatIP = (ip) => {
    if (!ip || ip === "Unknown") return "Unknown";
    return ip;
  };

  return (
    <div className="lg:p-6">
      {/* Header and controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiUser className="text-blue-600" />
            Users Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage all registered users and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={refreshing}
          >
            <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiUserPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col gap-4 lg:flex-row justify-between items-center w-full">
          <div className="relative lg:w-[50%] w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select 
                className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select 
                className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
            <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('first_name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('first_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {getSortIcon('role')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('last_login')}
                  >
                    <div className="flex items-center">
                      Last Login
                      {getSortIcon('last_login')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('last_login_ip')}
                  >
                    <div className="flex items-center">
                      IP Address
                      {getSortIcon('last_login_ip')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('last_login_location')}
                  >
                    <div className="flex items-center">
                      Location
                      {getSortIcon('last_login_location')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('created_at')}
                  >
                    <div className="flex items-center">
                      Created At
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAndFilteredUsers.length > 0 ? (
                  sortedAndFilteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.status === 'active' ? (
                              <span className="flex items-center">
                                <FiCheck className="mr-1" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FiX className="mr-1" /> Inactive
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.last_login)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatIP(user.last_login_ip)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatLocation(user.last_login_location)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            onClick={() => openEditModal(user)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            onClick={() => openDeleteModal(user)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FiUser className="text-3xl mb-2" />
                        <p className="text-sm">No users found matching your criteria</p>
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setRoleFilter('all');
                            setStatusFilter('all');
                          }}
                          className="mt-2 text-blue-600 text-sm hover:underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal &&
        <AddUserModal
          handleAddUser={handleAddUser}
          setNewUser={setNewUser}
          newUser={newUser}
          setShowAddModal={setShowAddModal}
        />
      }

      {/* Edit User Modal */}
      {showEditModal && selectedUser &&
        <EditUserModal
          user={selectedUser}
          handleEditUser={handleEditUser}
          setShowEditModal={setShowEditModal}
        />
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser &&
        <DeleteConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser.first_name} ${selectedUser.last_name}? This action cannot be undone.`}
          onProceed={() => handleDeleteConfirmation(selectedUser.id)}
          onCancel={() => setShowDeleteModal(false)}
          setShowModal={setShowDeleteModal}
        />
      }
    </div>
  );
}