import { apiSummary } from "@/app/lib/apiSummary";
import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiX, FiShoppingBag, FiCheckCircle, FiPrinter, FiLoader } from "react-icons/fi";

export default function OrderActionModal({
  setShowOrderModal,
  selectedOrder,
  setSelectedOrder,
  updateOrderStatus,
}) {
  if (!selectedOrder) return null;

  console.log("Selected order:", selectedOrder);

  // State for tracking number, shipping agency, and cancellation/delay reason
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingAgency, setShippingAgency] = useState("");
  const [useTrackingNumber, setUseTrackingNumber] = useState(true);
  const [cancellationReason, setCancellationReason] = useState("");
  const [delayReason, setDelayReason] = useState("");
  const [isSaving, setIsSaving] = useState(false); // New saving state

  // Calculate order summary
  const subtotal = parseFloat(selectedOrder.sub_total) || 0;
  const total = parseFloat(selectedOrder.total) || 0;
  const shipping = total - subtotal;

  // Order status options
  const orderStatusOptions = [
    "awaiting payment",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "delayed/onhold"
  ];

  // Common shipping agencies for suggestions
  const commonShippingAgencies = [
    "UPS", "FedEx", "DHL", "USPS", "Canada Post", 
    "Royal Mail", "Australia Post", "DPD", "TNT", 
    "Aramex", "Purolator", "China Post", "EMS"
  ];

  // Helper function to get product details regardless of type
  const getProductDetails = (item) => {
    if (item.product_id) {
      // Regular product
      return {
        id: item.product_id,
        name: item.product_name,
        gallery: item.product_gallery,
        selectedSize: item.selected_size,
        sizes: item.sizes,
        type: 'product'
      };
    } else if (item.accessory_id) {
      // Accessory product
      return {
        id: item.accessory_id,
        name: item.accessory_name,
        gallery: item.accessory_gallery,
        selectedSize: item.selected_size,
        sizes: item.sizes,
        type: 'accessory'
      };
    }
    return null;
  };

  // Helper function to get price for an item
  const getItemPrice = (item) => {
    const details = getProductDetails(item);
    if (!details || !details.selectedSize || !details.sizes) return "N/A";
    
    const selectedSizeObj = details.sizes.find(
      (s) => s.size === details.selectedSize.user_selected_size
    );
    return selectedSizeObj ? selectedSizeObj.price : "N/A";
  };

  // Handle status change
  const handleStatusChange = (newStatus) => {
    setSelectedOrder({
      ...selectedOrder,
      order_status: newStatus,
    });
  };

  // Check if we can save changes
  const canSaveChanges = () => {
    if (isSaving) return false; // Disable saving while already saving

    const currentStatus = selectedOrder.order_status;

    // For shipped status, check tracking number and shipping agency requirements
    if (currentStatus === "shipped") {
      if (useTrackingNumber && !trackingNumber.trim()) {
        return false; // Can't save without tracking number when required
      }
      if (!shippingAgency.trim()) {
        return false; // Shipping agency is required for shipped orders
      }
    }

    // For cancelled status, require reason
    if (currentStatus === "cancelled" && !cancellationReason.trim()) {
      return false;
    }

    // For delayed status, require reason
    if (currentStatus === "delayed/onhold" && !delayReason.trim()) {
      return false;
    }

    return true;
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!canSaveChanges()) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    setIsSaving(true); // Start saving

    // Prepare update data
    const updateData = {
      order_status: selectedOrder.order_status,
      ...(selectedOrder.order_status === "shipped" && {
        shipping_agency: shippingAgency,
        use_tracking_number: useTrackingNumber, // Always include this flag
        ...(useTrackingNumber && { tracking_number: trackingNumber }),
        ...(!useTrackingNumber && { tracking_number: null }) // Explicitly set to null when not used
      }),
      ...(selectedOrder.order_status === "cancelled" && {
        side_note: cancellationReason
      }),
      ...(selectedOrder.order_status === "delayed/onhold" && {
        side_note: delayReason
      })
    };

    // Call update function if provided
    if (updateOrderStatus) {
      updateOrderStatus(selectedOrder.order_id, updateData);
    }

    let updatedOrder = {...selectedOrder, ...updateData};
    console.log("Saving order changes:", updatedOrder);

    try {
      let result = await axios.post(apiSummary.admin.orders.update_order, updatedOrder);
      console.log(result.data);

      if (result.data.success) {
        toast.success("Order status updated.");
        // Optionally close modal after successful save
        // setShowOrderModal(false);
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error?.response?.data?.message || "Error updating order status");
    } finally {
      setIsSaving(false); // End saving regardless of outcome
    }
  };

  // Reset form fields when status changes
  useEffect(() => {
    if (selectedOrder.order_status !== "shipped") {
      setTrackingNumber("");
      setShippingAgency("");
      setUseTrackingNumber(true);
    }
    if (selectedOrder.order_status !== "cancelled") {
      setCancellationReason("");
    }
    if (selectedOrder.order_status !== "delayed/onhold") {
      setDelayReason("");
    }
  }, [selectedOrder.order_status]);

  // Initialize tracking preference when order has existing data
  useEffect(() => {
    if (selectedOrder.order_status === "shipped") {
      // If order already has tracking number, assume tracking is used
      if (selectedOrder.tracking_number) {
        setTrackingNumber(selectedOrder.tracking_number);
        setUseTrackingNumber(true);
      }
      // If you have existing use_tracking_number field, use it
      if (selectedOrder.use_tracking_number !== undefined) {
        setUseTrackingNumber(selectedOrder.use_tracking_number);
      }
      // Initialize shipping agency if exists
      if (selectedOrder.shipping_agency) {
        setShippingAgency(selectedOrder.shipping_agency);
      }
    }
  }, [selectedOrder]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={() => !isSaving && setShowOrderModal(false)} // Prevent closing while saving
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-5xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Order #{selectedOrder.order_id}
                {isSaving && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <FiLoader className="animate-spin -ml-1 mr-1 h-3 w-3" />
                    Saving...
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Customer: {selectedOrder.customer_email}
              </p>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
              onClick={() => setShowOrderModal(false)}
              disabled={isSaving} // Disable close button while saving
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
                {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.cart.map((item, i) => {
                      const productDetails = getProductDetails(item);
                      if (!productDetails) return null;

                      return (
                        <div
                          key={i}
                          className="flex items-start border-b border-gray-200 pb-4"
                        >
                          {/* Product Image */}
                          {productDetails.gallery && productDetails.gallery.length > 0 ? (
                            <img
                              src={productDetails.gallery[0].url}
                              alt={productDetails.name}
                              className="h-16 w-16 bg-gray-100 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                              <FiShoppingBag />
                            </div>
                          )}

                          <div className="ml-4 flex-1">
                            <h5 className="text-sm font-medium text-gray-900">
                              {productDetails.name || "Unnamed Product"}
                              {productDetails.type === 'accessory' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Accessory
                                </span>
                              )}
                            </h5>
                            <p className="text-sm text-gray-500">
                              Size: {productDetails.selectedSize?.user_selected_size || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {productDetails.selectedSize?.quantity || 1}
                            </p>
                            <div className="text-sm font-medium text-gray-900 mt-1">
                              Price: {selectedOrder.geo_data.currency_symbol}{getItemPrice(item)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No items in this order.</p>
                )}
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Shipping Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">
                      Shipping Address
                    </h5>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedOrder.shipping_address ?
                        `${selectedOrder.shipping_address.firstName} ${selectedOrder.shipping_address.lastName}, ${selectedOrder.shipping_address.address}, ${selectedOrder.shipping_address.country}`
                        : "No address provided"
                      }
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Phone: {selectedOrder.shipping_address?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-500">
                      Payment Status
                    </h5>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedOrder.payment_status}
                    </p>
                    <h5 className="text-sm font-medium text-gray-500 mt-3">
                      Packaging
                    </h5>
                    <p className="text-sm text-gray-900 mt-1 capitalize">
                      {selectedOrder.packaging?.selectedpackaging || "Standard"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm text-gray-900">
                      {selectedOrder.geo_data.currency_symbol} {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-sm text-gray-900">
                      {selectedOrder.geo_data.currency_symbol} {shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-sm text-gray-900">
                      {selectedOrder.geo_data.currency_symbol} 0.00
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedOrder.geo_data.currency_symbol} {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Actions
                </h4>

                {/* Order Status Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    value={selectedOrder.order_status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isSaving} // Disable while saving
                  >
                    {orderStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tracking and Shipping Agency Section - Only show for shipped status */}
                {selectedOrder.order_status === "shipped" && (
                  <div className="space-y-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                    <label className="block text-sm font-medium text-gray-700">
                      Shipping Information
                    </label>

                    {/* Shipping Agency Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Agency *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter shipping agency (e.g., UPS, FedEx, DHL)"
                        value={shippingAgency}
                        onChange={(e) => setShippingAgency(e.target.value)}
                        list="shipping-agencies"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isSaving} // Disable while saving
                      />
                      <datalist id="shipping-agencies">
                        {commonShippingAgencies.map((agency) => (
                          <option key={agency} value={agency} />
                        ))}
                      </datalist>
                      <p className="text-xs text-gray-500 mt-1">
                        * Shipping agency is required when order is shipped
                      </p>
                    </div>

                    {/* Tracking Number Section */}
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="useTracking"
                          checked={!useTrackingNumber}
                          onChange={(e) => setUseTrackingNumber(!e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                          disabled={isSaving} // Disable while saving
                        />
                        <label htmlFor="useTracking" className="ml-2 block text-sm text-gray-700">
                          Do not use tracking number
                        </label>
                      </div>

                      {/* Tracking number input - only show if tracking is enabled */}
                      {useTrackingNumber && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tracking Number *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter tracking number"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            disabled={isSaving} // Disable while saving
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            * Tracking number is required when tracking is enabled
                          </p>
                        </div>
                      )}

                      {/* Message when tracking is disabled */}
                      {!useTrackingNumber && (
                        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-xs text-yellow-700">
                            Tracking number will not be used for this shipment. 
                            This preference will be saved in the order data.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancellation Reason - Only show for cancelled status */}
                {selectedOrder.order_status === "cancelled" && (
                  <div className="space-y-2 p-3 bg-red-50 rounded-md border border-red-200">
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Cancellation *
                    </label>
                    <textarea
                      placeholder="Please provide reason for cancellation..."
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      rows="3"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={isSaving} // Disable while saving
                    />
                    <p className="text-xs text-gray-500">
                      * This reason will be communicated to the customer
                    </p>
                  </div>
                )}

                {/* Delay Reason - Only show for delayed/onhold status */}
                {selectedOrder.order_status === "delayed/onhold" && (
                  <div className="space-y-2 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                    <label className="block text-sm font-medium text-gray-700">
                      Reason for Delay/Hold *
                    </label>
                    <textarea
                      placeholder="Please provide reason for delay or putting order on hold..."
                      value={delayReason}
                      onChange={(e) => setDelayReason(e.target.value)}
                      rows="3"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={isSaving} // Disable while saving
                    />
                    <p className="text-xs text-gray-500">
                      * This reason will be communicated to the customer
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update (Payment Status - Keeping existing) */}
              {updateOrderStatus && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Update Payment Status
                  </h4>
                  <div className="space-y-2">
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={selectedOrder.payment_status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setSelectedOrder({
                          ...selectedOrder,
                          payment_status: newStatus,
                        });
                        updateOrderStatus(selectedOrder.order_id, newStatus);
                      }}
                      disabled={isSaving} // Disable while saving
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={isSaving} // Disable while saving
                >
                  <FiPrinter className="inline mr-2" />
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!canSaveChanges()}
                  className={`flex-1 px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white flex items-center justify-center ${
                    canSaveChanges()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } disabled:bg-blue-400 disabled:cursor-wait`}
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

              {/* Debug button (optional - remove in production) */}
              <button
                onClick={() => console.log({
                  ...selectedOrder,
                  tracking_preference: useTrackingNumber ? "enabled" : "disabled",
                  tracking_number: trackingNumber,
                  shipping_agency: shippingAgency
                })}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                disabled={isSaving} // Disable while saving
              >
                Debug Shipping Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}