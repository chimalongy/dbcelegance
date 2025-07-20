import React from 'react';
import {
  FiX, FiShoppingBag, FiCheckCircle, FiPrinter
} from 'react-icons/fi';

export default function OrderActionModal({
  setShowOrderModal,
  selectedOrder,
  setSelectedOrder,
  updateOrderStatus,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => setShowOrderModal(false)}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-5xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Order #{selectedOrder?.id}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on {new Date(selectedOrder?.date).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowOrderModal(false)}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Order Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Order Items
                </h4>
                <div className="space-y-4">
                  {[{
                    name: 'Classic White T-Shirt',
                    desc: 'Size: M, Color: White',
                    price: 29.99
                  }, {
                    name: 'Slim Fit Jeans',
                    desc: 'Size: 32/34, Color: Blue',
                    price: 89.99
                  }].map((item, i) => (
                    <div key={i} className="flex items-start border-b border-gray-200 pb-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        <FiShoppingBag />
                      </div>
                      <div className="ml-4 flex-1">
                        <h5 className="text-sm font-medium text-gray-900">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                        <p className="text-sm text-gray-500">Qty: 1</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Shipping Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Shipping Address</h5>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedOrder.customer}<br />
                      123 Main Street<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">Shipping Method</h5>
                    <p className="text-sm text-gray-900 mt-1">
                      Standard Shipping<br />
                      {selectedOrder.tracking && (
                        <>
                          Tracking: {selectedOrder.tracking}<br />
                          <button className="text-blue-600 hover:text-blue-800 text-sm mt-1">
                            Track Package
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm text-gray-900">${(selectedOrder.total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-sm text-gray-900">$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-sm text-gray-900">${(selectedOrder.total * 0.1 - 9.99).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">Total</span>
                    <span className="text-sm font-medium text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Update Status</h4>
                <div className="space-y-2">
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setSelectedOrder({ ...selectedOrder, status: newStatus });
                      updateOrderStatus(selectedOrder.id, newStatus);
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Tracking Input */}
                  {selectedOrder.status === 'shipped' && !selectedOrder.tracking && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={selectedOrder.tracking}
                        onChange={(e) =>
                          setSelectedOrder({ ...selectedOrder, tracking: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPrinter className="inline mr-2" />
                  Print Invoice
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiCheckCircle className="inline mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
