"use client";

import { useState, useEffect } from 'react';

const ACCESS_PAGES = [
  "users",
  "stores",
  "orders",
  "customers",
];

export default function EditUserModal({ user, handleEditUser, setShowEditModal }) {
  const [editedUser, setEditedUser] = useState({
    ...user,
    accessiblePages: user.accessiblePages || []
  });

  useEffect(() => {
    setEditedUser({
      ...user,
      accessiblePages: user.accessiblePages || []
    });
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditUser(editedUser);
  };

  const handlePageAccessChange = (page, isChecked) => {
    const updatedPages = isChecked
      ? [...editedUser.accessiblePages, page]
      : editedUser.accessiblePages.filter(p => p !== page);
    
    setEditedUser({
      ...editedUser,
      accessiblePages: updatedPages
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
            <button 
              onClick={() => setShowEditModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editedUser.first_name}
                  onChange={(e) => setEditedUser({...editedUser, first_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editedUser.last_name}
                  onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editedUser.email}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editedUser.role}
                onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {editedUser.role === 'user' && (
              <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Can Access</h3>
                <div className="grid grid-cols-2 gap-2">
                  {ACCESS_PAGES.map((page) => (
                    <div key={page} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-access-${page}`}
                        checked={editedUser.accessiblePages.includes(page)}
                        onChange={(e) => handlePageAccessChange(page, e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`edit-access-${page}`} className="ml-2 text-sm text-gray-700 capitalize">
                        {page}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editedUser.status}
                onChange={(e) => setEditedUser({...editedUser, status: e.target.value})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}