"use client";

import { useState } from 'react';
import { 
  FiSearch, FiChevronDown, FiChevronUp, 
  FiUser, FiMail, FiMapPin, FiGlobe, FiClock
} from 'react-icons/fi';  


export default function CustomersPage() {
  // Sample customer data with IP and location
  const [customers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      registered: "2023-01-15T14:32:00",
      lastLogin: "2023-07-20T09:15:22",
      lastIp: "192.168.1.45",
      location: "New York, US",
      device: "Chrome on Windows",
      status: "active"
    },
    {
      id: 2,
      name: "Emma Johnson",
      email: "emma.j@example.com",
      registered: "2022-11-22T10:15:00",
      lastLogin: "2023-07-19T16:42:10",
      lastIp: "203.113.82.12",
      location: "London, UK",
      device: "Safari on Mac",
      status: "active"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      registered: "2023-03-10T08:45:30",
      lastLogin: "2023-07-18T22:05:33",
      lastIp: "101.202.34.56",
      location: "Sydney, AU",
      device: "Firefox on Linux",
      status: "active"
    },
    {
      id: 4,
      name: "Sarah Davis",
      email: "sarah.d@example.com",
      registered: "2021-09-05T19:20:00",
      lastLogin: "2023-06-28T11:30:45",
      lastIp: "45.67.89.123",
      location: "Toronto, CA",
      device: "Edge on Windows",
      status: "inactive"
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.w@example.com",
      registered: "2023-02-18T13:10:15",
      lastLogin: "2023-05-20T14:25:00",
      lastIp: "178.62.91.204",
      location: "Berlin, DE",
      device: "Chrome on Android",
      status: "suspended"
    },
  ]);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "registered", direction: "descending" });

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Filter customers based on search and filters
  const filteredCustomers = sortedCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastIp.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format date with time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Registered Customers</h1>
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
              placeholder="Search customers..."
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
            <option value="suspended">Suspended</option>
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

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Customer
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
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortConfig.key === "email" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("registered")}
                >
                  <div className="flex items-center">
                    Registered
                    {sortConfig.key === "registered" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("lastLogin")}
                >
                  <div className="flex items-center">
                    Last Login
                    {sortConfig.key === "lastLogin" && (
                      sortConfig.direction === "ascending" ? 
                        <FiChevronUp className="ml-1" /> : 
                        <FiChevronDown className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last IP
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiUser size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.device}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1 text-gray-400" />
                        {formatDateTime(customer.registered)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1 text-gray-400" />
                        {formatDateTime(customer.lastLogin)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiGlobe className="mr-1 text-gray-400" />
                        {customer.lastIp || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiMapPin className="mr-1 text-gray-400" />
                        {customer.location || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' :
                        customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No customers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}