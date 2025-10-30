import {
    FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiX,
    FiLoader, FiPackage, FiLayers, FiChevronDown, FiChevronUp,
    FiXCircle, FiSave, FiArrowLeft
} from 'react-icons/fi';


import { useState, useEffect } from "react";
export default function CreateGroupModal({
    isOpen,
    onClose,
    onSave,
    groupData,
    onChange,
    products,
    accessories,
    isSaving
}) {
    const [selectedItems, setSelectedItems] = useState(new Map());

    useEffect(() => {
        // Initialize selected items from groupData
        if (groupData?.group_items) {
            const itemsMap = new Map();
            groupData.group_items.forEach(item => {
                // Use a unique key that combines type and the actual ID from the database
                const key = `${item.type}-${item.type === 'product' ? item.product_id : item.accessory_id}`;
                itemsMap.set(key, item);
            });
            setSelectedItems(itemsMap);
        }
    }, [groupData]);

    const handleItemToggle = (item, type) => {
        // Create a unique key using type and the actual database ID
        const itemId = type === 'product' ? item.product_id : item.accessory_id;
        const key = `${type}-${itemId}`;
        
        const newSelected = new Map(selectedItems);

        if (newSelected.has(key)) {
            newSelected.delete(key);
        } else {
            // Create the group item object
            const groupItem = {
                id: itemId, // Use the actual database ID
                type: type,
                name: type === 'product' ? item.product_name : item.accessory_name,
                description: type === 'product' ? item.product_description : item.accessory_description,
                price: type === 'product' ? (item.sizes?.[0]?.price || 0) : item.accessory_price,
                image: type === 'product' ? getProductImage(item) : getAccessoryImage(item),
                status: type === 'product' ? item.product_status : item.accessory_status,
                ...(type === 'product' && { product_id: item.product_id }),
                ...(type === 'accessory' && { accessory_id: item.accessory_id })
            };
            newSelected.set(key, groupItem);
        }

        setSelectedItems(newSelected);

        // Update the group data with the new items array
        const groupItems = Array.from(newSelected.values());
        onChange({ ...groupData, group_items: groupItems });
    };

    const isItemSelected = (item, type) => {
        // Use the same unique key logic for checking selection
        const itemId = type === 'product' ? item.product_id : item.accessory_id;
        const key = `${type}-${itemId}`;
        return selectedItems.has(key);
    };

    // Helper function to get first image from gallery
    const getFirstImage = (gallery) => {
        if (!gallery || !Array.isArray(gallery) || gallery.length === 0) {
            return null;
        }
        return gallery[0]?.url || null;
    };

    // Helper function to get product image
    const getProductImage = (product) => {
        return getFirstImage(product.product_gallery);
    };

    // Helper function to get accessory image
    const getAccessoryImage = (accessory) => {
        return getFirstImage(accessory.accessory_gallery);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...groupData,
            group_items: Array.from(selectedItems.values())
        };
        onSave(finalData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Create Product Group
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isSaving}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* Group Name */}
                        <div>
                            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                id="groupName"
                                required
                                value={groupData?.group_name || ''}
                                onChange={(e) => onChange({ ...groupData, group_name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter group name"
                            />
                        </div>

                        {/* Group Description */}
                        <div>
                            <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="groupDescription"
                                rows={3}
                                value={groupData?.group_description || ''}
                                onChange={(e) => onChange({ ...groupData, group_description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter group description"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="groupStatus" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="groupStatus"
                                value={groupData?.group_status || 'active'}
                                onChange={(e) => onChange({ ...groupData, group_status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Products Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Products ({Array.from(selectedItems.values()).filter(item => item.type === 'product').length} selected)
                            </label>
                            <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                                {products.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <FiPackage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        No products available
                                    </div>
                                ) : (
                                    products.map(product => {
                                        const productImage = getProductImage(product);
                                        const isSelected = isItemSelected(product, 'product');
                                        return (
                                            <div key={`product-${product.product_id}`} className={`flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    id={`product-${product.product_id}`}
                                                    checked={isSelected}
                                                    onChange={() => handleItemToggle(product, 'product')}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`product-${product.product_id}`} className="ml-3 flex-1 cursor-pointer">
                                                    <div className="flex items-center space-x-3">
                                                        {/* Product Image */}
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                                                            {productImage ? (
                                                                <img
                                                                    src={productImage}
                                                                    alt={product.product_name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '';
                                                                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><FiPackage className="text-gray-400 w-5 h-5" /></div>';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                    <FiPackage className="text-gray-400 w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {product.product_name}
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.product_status === 'active'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {product.product_status}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                {product.product_description || 'No description'}
                                                            </p>
                                                            {product.sizes && product.sizes.length > 0 && (
                                                                <div className="mt-1 flex items-center space-x-2">
                                                                    <span className="text-xs text-blue-600">
                                                                        {product.sizes.length} size(s)
                                                                    </span>
                                                                    <span className="text-xs text-gray-400">•</span>
                                                                    <span className="text-xs text-gray-500">
                                                                        From ${Math.min(...product.sizes.map(s => s.price || 0))}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Accessories Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Accessories ({Array.from(selectedItems.values()).filter(item => item.type === 'accessory').length} selected)
                            </label>
                            <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                                {accessories.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <FiPackage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        No accessories available
                                    </div>
                                ) : (
                                    accessories.map(accessory => {
                                        const accessoryImage = getAccessoryImage(accessory);
                                        const isSelected = isItemSelected(accessory, 'accessory');
                                        return (
                                            <div key={`accessory-${accessory.accessory_id}`} className={`flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    id={`accessory-${accessory.accessory_id}`}
                                                    checked={isSelected}
                                                    onChange={() => handleItemToggle(accessory, 'accessory')}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`accessory-${accessory.accessory_id}`} className="ml-3 flex-1 cursor-pointer">
                                                    <div className="flex items-center space-x-3">
                                                        {/* Accessory Image */}
                                                        <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200">
                                                            {accessoryImage ? (
                                                                <img
                                                                    src={accessoryImage}
                                                                    alt={accessory.accessory_name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = '';
                                                                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><FiPackage className="text-gray-400 w-5 h-5" /></div>';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                    <FiPackage className="text-gray-400 w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Accessory Details */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {accessory.accessory_name}
                                                                </span>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${accessory.accessory_status === 'active'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {accessory.accessory_status}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                {accessory.accessory_description || 'No description'}
                                                            </p>
                                                            <div className="mt-1 flex items-center space-x-3">
                                                                <span className="text-xs font-medium text-blue-600">
                                                                    ${accessory.accessory_price}
                                                                </span>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <span className="text-xs text-gray-500">
                                                                    Stock: {accessory.stock_quantity}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Selected Items Summary */}
                        {selectedItems.size > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">
                                    Selected Items Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-blue-700 font-medium">Total Items:</span>
                                        <span className="text-blue-600 ml-2">{selectedItems.size} item(s)</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700 font-medium">Products:</span>
                                        <span className="text-blue-600 ml-2">
                                            {Array.from(selectedItems.values()).filter(item => item.type === 'product').length}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700 font-medium">Accessories:</span>
                                        <span className="text-blue-600 ml-2">
                                            {Array.from(selectedItems.values()).filter(item => item.type === 'accessory').length}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-blue-600">
                                    Selected items: {Array.from(selectedItems.values()).map(item => item.name).join(', ')}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving || !groupData?.group_name}
                        >
                            {isSaving ? (
                                <FiLoader className="animate-spin mr-2" />
                            ) : (
                                <FiPlus className="mr-2" />
                            )}
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};