"use client";

import { useState, useEffect } from "react";
import {
  FiSearch, FiChevronDown, FiChevronUp,
  FiPrinter, FiEye, FiLoader, FiRefreshCw, FiCalendar,
  FiFilter, FiX
} from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import OrderActionModal from "./components/OrderActionModal";
import { apiSummary } from "@/app/lib/apiSummary.js";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Mobile filter drawer
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch orders (no pagination, no filters from backend)
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiSummary.admin.orders.get_all_orders);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to load orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filtering (search, payment, status, date range)
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.order_id.toString().includes(searchTerm) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    const orderDate = new Date(order.created_at);
    const matchesDate =
      (!fromDate || orderDate >= new Date(fromDate)) &&
      (!toDate || orderDate <= new Date(toDate));

    return matchesSearch && matchesPayment && matchesStatus && matchesDate;
  });

  // Sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    if (sortConfig.key === "customer_email") {
      aVal = aVal?.toLowerCase();
      bVal = bVal?.toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paymentOptions = [
    { value: "all", label: "All Payments" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" }
  ];

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPaymentFilter("all");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setShowMobileFilters(false);
  };

  // Mobile card view for orders
  const OrderCard = ({ order }) => {
    const items = order.cart || "[]";
    const itemCount = Array.isArray(items) ? items.length : 0;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-3">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-blue-600">Order #{order.order_id}</h3>
            <p className="text-sm text-gray-500">{order.customer_email}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              order.payment_status === "paid" ? "bg-green-100 text-green-800" :
              order.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
              order.payment_status === "failed" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div>
            <p className="text-gray-500">Date</p>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Items</p>
            <p>{itemCount}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-semibold"> {order.geo_data.currency_symbol}{order.total}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={() => viewOrderDetails(order)}
            className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
          >
            <FiEye className="mr-1" />
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Orders Management</h1>
          <p className="text-xs md:text-sm text-gray-500">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center p-2 md:px-3 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            disabled={refreshing}
          >
            <FiRefreshCw className={`${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden md:inline ml-2">Refresh</span>
          </button>
          <button className="hidden md:flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FiPrinter className="mr-2" />
            Print
          </button>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FiFilter />
          </button>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-between items-center bg-white p-3 rounded-lg shadow">
        <span className="text-sm font-medium">Filters</span>
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center text-sm text-blue-600"
        >
          <FiFilter className="mr-1" />
          Adjust
        </button>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:block bg-white p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order ID or email..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Payment filter */}
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          {paymentOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-500" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 border rounded-lg text-sm"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg overflow-y-auto">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Order ID or email..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Payment filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  {paymentOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                <select
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Date range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-500" />
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-500" />
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={resetFilters}
                  className="flex-1 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table/Cards */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
            <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden p-4">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <OrderCard key={order.order_id} order={order} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No orders found matching your criteria.
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: "order_id", label: "Order ID" },
                      { key: "customer_email", label: "Customer Email" },
                      { key: "created_at", label: "Date" },
                      { key: "cart", label: "Items" },
                      { key: "total", label: "Total" },
                      { key: "payment_status", label: "Payment" },
                      { key: "order_status", label: "Order Status" }
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => requestSort(col.key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          {col.label}
                          {sortConfig.key === col.key && (
                            sortConfig.direction === "asc" ?
                              <FiChevronUp className="ml-1" /> :
                              <FiChevronDown className="ml-1" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => {
                      const items = order.cart || "[]";
                      return (
                        <tr key={order.order_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.order_id}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.customer_email}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {Array.isArray(items) ? items.length : 0}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">${order.total}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.payment_status === "paid" ? "bg-green-100 text-green-800" :
                              order.payment_status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              order.payment_status === "failed" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm">
                            <button
                              onClick={() => viewOrderDetails(order)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FiEye />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No orders found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && 
        <OrderActionModal
          setShowOrderModal={setShowOrderModal}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
      }
    </div>
  );
}