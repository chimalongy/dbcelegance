import {
    FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiX,
    FiLoader, FiPackage, FiLayers, FiChevronDown, FiChevronUp,
    FiXCircle, FiSave, FiArrowLeft
} from 'react-icons/fi';


import { useState, useEffect } from "react";

export default function DeleteGroupModal ({ isOpen, onClose, onConfirm, group, isDeleting })  {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <FiTrash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Delete Product Group
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Are you sure you want to delete the group "{group?.group_name}"? This action cannot be undone.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <FiLoader className="animate-spin mr-2" />
                        ) : (
                            <FiTrash2 className="mr-2" />
                        )}
                        Delete Group
                    </button>
                </div>
            </div>
        </div>
    );
};