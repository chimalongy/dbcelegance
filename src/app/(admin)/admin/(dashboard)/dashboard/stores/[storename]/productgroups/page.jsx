"use client";

import React, { useState, useEffect } from 'react';
import {
    FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiX,
    FiLoader, FiPackage, FiLayers, FiChevronDown, FiChevronUp,
    FiXCircle, FiSave, FiArrowLeft
} from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';
import { toast } from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore';
import { makeAdminJsonPost, makeAdminFormDataPost } from '@/app/lib/apiHelper';
import CreateGroupModal from './components/CreateGroupModal';
import DeleteGroupModal from './components/DeleteGroupModal';
import EditGroupModal from './components/EditGroupModal';

// Loading spinner component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
        <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
        <span className="sr-only">Loading...</span>
    </div>
);

// No groups found component
const NoGroupsFound = ({ groups, clearFilters, openAddModal }) => (
    <div className="p-8 text-center">
        <FiLayers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
            {groups.length === 0 ? 'No product groups yet' : 'No matching groups found'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
            {groups.length === 0
                ? "Get started by creating your first product group."
                : "Try adjusting your search criteria."}
        </p>
        <div className="mt-6 flex justify-center gap-4">
            {groups.length === 0 ? (
                <button
                    onClick={openAddModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FiPlus className="mr-2" /> Create First Group
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
                        <FiPlus className="mr-2" /> Create New Group
                    </button>
                </>
            )}
        </div>
    </div>
);

const ProductGroupsManagement = () => {
    const router = useRouter();
    const admin_user = useAdminUserStore(state => state.adminuser);
    const params = useParams();
    const store_name = params.storename;

    // Data states
    const [productCategories, setProductCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [accessoryCategories, setAccessoryCategories] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [productGroups, setProductGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Selected items
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupFormData, setGroupFormData] = useState({
        group_name: '',
        group_description: '',
        group_status: 'active',
        group_items: [],
        group_gallery: []
    });

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all required data
    const fetchAllData = async () => {
        try {
            setLoading(true);

            // Fetch product categories
            const categoriesRes = await axios.post(
                apiSummary.admin.stores.categories.get_all_categories,
                { category_store: store_name }
            );
            setProductCategories(categoriesRes.data.data);

            // Fetch products
            const productsRes = await axios.post(
                apiSummary.admin.stores.products.get_all_products,
                { product_store: store_name }
            );
            setProducts(productsRes.data.data);

            // Fetch accessory categories
            const accessoryCategoriesRes = await axios.post(
                apiSummary.admin.stores.accessories.get_all_categories,
                { accessory_category_store: store_name }
            );
            setAccessoryCategories(accessoryCategoriesRes.data.data);

            // Fetch accessories
            const accessoriesRes = await axios.post(
                apiSummary.admin.stores.accessories.get_all_products,
                { accessory_store: store_name }
            );
            setAccessories(accessoriesRes.data.data);

            // Fetch product groups
            const groupsRes = await axios.post(
                apiSummary.admin.stores.productgroups.get_all_groups,
                { group_store: store_name }
            );

            let data = groupsRes.data.data

            const newdata = data.map((group) => {
                return {
                    ...group,
                    group_items: JSON.parse(group.group_items),
                    group_gallery: JSON.parse(group.group_gallery),
                };
            });
            setProductGroups(newdata || []);
            console.log("groupsRes", newdata);
            setFilteredGroups(newdata || []);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin_user?.id) {
            if (admin_user.role !== "admin" && (!admin_user.accessiblepages.some((accessible_page) => accessible_page === "stores"))) {
                toast.error("You don't have access to this page.");
                router.push("/admin/dashboard/");
            } else {
                fetchAllData();
            }
        }
    }, [admin_user?.id]);

    // Apply search filter
    useEffect(() => {
        if (!searchTerm) {
            setFilteredGroups(productGroups);
        } else {
            const filtered = productGroups.filter(group =>
                group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                group.group_description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredGroups(filtered);
        }
    }, [searchTerm, productGroups]);

    const handleCreateGroup = async (groupData) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("group_name", groupData.group_name);
            formData.append("group_description", groupData.group_description || "");
            formData.append("group_status", groupData.group_status);
            formData.append("group_store", store_name);
            formData.append("group_items", JSON.stringify(groupData.group_items));

            // Append gallery files
            groupData.group_gallery.forEach((item) => {
                if (item.file) {
                    formData.append("group_gallery", item.file);
                }
            });

            const res = await makeAdminFormDataPost(
                apiSummary.admin.stores.productgroups.add_group,
                formData
            );

            if (res.data.success) {
                toast.success(res.data.message || "Group created successfully!");
                setShowCreateModal(false);
                await fetchAllData();
            } else {
                throw new Error(res.data.message || "Failed to create group.");
            }
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error(error.response?.data?.message || "Internal server error.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateGroup = async (groupData) => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("group_id", selectedGroup.group_id);
            formData.append("group_name", groupData.group_name);
            formData.append("group_description", groupData.group_description);
            formData.append("group_status", groupData.group_status);
            formData.append("group_store", store_name);
            formData.append("group_items", JSON.stringify(groupData.group_items || []));

            // Append new gallery files
            groupData.group_gallery
                ?.filter(item => item.file) // Only include new files
                .forEach(item => {
                    formData.append("group_gallery", item.file);
                });

            const response = await makeAdminFormDataPost(
                apiSummary.admin.stores.productgroups.update_group,
                formData
            );

            if (response.data.success) {
                toast.success("Product group updated successfully!");
                setShowEditModal(false);
                setSelectedGroup(null);
                setGroupFormData({
                    group_name: '',
                    group_description: '',
                    group_status: 'active',
                    group_items: [],
                    group_gallery: []
                });
                await fetchAllData();
            } else {
                throw new Error(response.data.message || "Failed to update product group");
            }
        } catch (error) {
            console.error("Error updating product group:", error);
            toast.error(error.response?.data?.message || "Failed to update product group");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteGroup = async () => {
        if (!selectedGroup) return;

        setIsDeleting(true);
        try {
            const response = await makeAdminJsonPost(
                apiSummary.admin.stores.productgroups.delete_group,
                { group_id: selectedGroup.group_id }
            );

            if (response.data.success) {
                toast.success("Product group deleted successfully!");
                setShowDeleteModal(false);
                setSelectedGroup(null);
                await fetchAllData();
            } else {
                throw new Error(response.data.message || "Failed to delete product group");
            }
        } catch (error) {
            console.error("Error deleting product group:", error);
            toast.error(error.response?.data?.message || "Failed to delete product group");
        } finally {
            setIsDeleting(false);
        }
    };

    // Modal handlers - FIXED: Include group_gallery in the form data
    const openCreateModal = () => {
        setGroupFormData({
            group_name: '',
            group_description: '',
            group_status: 'active',
            group_items: [],
            group_gallery: [] // Include empty gallery array
        });
        setSelectedGroup(null);
        setShowCreateModal(true);
    };

    const openEditModal = (group) => {
        setSelectedGroup(group);
        setGroupFormData({
            group_name: group.group_name,
            group_description: group.group_description || '',
            group_status: group.group_status,
            group_items: group.group_items || [],
            group_gallery: group.group_gallery || [] // ADD THIS LINE - include existing gallery
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (group) => {
        setSelectedGroup(group);
        setShowDeleteModal(true);
    };

    const clearFilters = () => {
        setSearchTerm('');
    };

    // Helper function to get item counts and names
    const getGroupItemsSummary = (group) => {
        if (!group.group_items || !Array.isArray(group.group_items)) {
            return { products: 0, accessories: 0, productNames: [], accessoryNames: [] };
        }

        const products = group.group_items.filter(item => item.type === 'product');
        const accessories = group.group_items.filter(item => item.type === 'accessory');

        return {
            products: products.length,
            accessories: accessories.length,
            productNames: products.map(p => p.name),
            accessoryNames: accessories.map(a => a.name)
        };
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="mx-auto">
            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSave={handleCreateGroup}
                groupData={groupFormData}
                onChange={setGroupFormData}
                products={products}
                accessories={accessories}
                isSaving={isSaving}
            />

            {/* Edit Group Modal */}
            <EditGroupModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSave={handleUpdateGroup}
                groupData={groupFormData}
                onChange={setGroupFormData}
                products={products}
                accessories={accessories}
                isSaving={isSaving}
                currentGroup={selectedGroup}
            />

            {/* Delete Confirmation Modal */}
            <DeleteGroupModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteGroup}
                group={selectedGroup}
                isDeleting={isDeleting}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Groups</h1>
                    <p className="text-sm text-gray-500">
                        Group multiple products and accessories together
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FiPlus className="mr-2" />
                    Create Group
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* Search */}
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Search groups</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400 w-5 h-5" />
                            </div>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search groups by name or description..."
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

                    {/* Clear Filters */}
                    <div>
                        <button
                            onClick={clearFilters}
                            className="flex items-center justify-center px-3 py-2 text-sm border border-gray-300 rounded-md
              text-gray-600 hover:bg-gray-100 hover:text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!searchTerm}
                        >
                            <FiX className="mr-1 w-4 h-4" /> Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Groups Count */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredGroups.length}</span> of{' '}
                    <span className="font-medium">{productGroups.length}</span> groups
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredGroups.length === 0 ? (
                    <NoGroupsFound
                        groups={productGroups}
                        clearFilters={clearFilters}
                        openAddModal={openCreateModal}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Group Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredGroups.map((group) => {
                                    const { products: productCount, accessories: accessoryCount, productNames, accessoryNames } = getGroupItemsSummary(group);
                                    return (
                                        <tr key={group.group_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                                    {group.group_description || 'No description'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">
                                                    <div>Total: {productCount + accessoryCount} items</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {productCount > 0 && (
                                                            <div>Products: {productCount}</div>
                                                        )}
                                                        {accessoryCount > 0 && (
                                                            <div>Accessories: {accessoryCount}</div>
                                                        )}
                                                    </div>
                                                    {(productNames.length > 0 || accessoryNames.length > 0) && (
                                                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                            {[...productNames, ...accessoryNames].slice(0, 3).join(', ')}
                                                            {[...productNames, ...accessoryNames].length > 3 && '...'}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${group.group_status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {group.group_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(group.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(group)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                                        title="Edit group"
                                                    >
                                                        <FiEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(group)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                                        disabled={isDeleting}
                                                        title="Delete group"
                                                    >
                                                        {isDeleting ? <FiLoader className="animate-spin" size={16} /> : <FiTrash2 size={16} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGroupsManagement;