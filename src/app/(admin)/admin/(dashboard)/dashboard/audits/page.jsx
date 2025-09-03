"use client";

import { useState, useEffect } from 'react';
import { 
  FiSearch, FiChevronDown, FiChevronUp, FiCheck, 
  FiX, FiLoader, FiFilter, FiRefreshCw, FiClock,
  FiDatabase, FiUser, FiShoppingCart, FiBox,
  FiServer, FiEye, FiAlertCircle, FiInfo, FiCalendar,
  FiChevronLeft, FiChevronRight, FiLayers
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAdminUserStore } from '@/app/lib/store/adminuserstore.js';
import { apiSummary } from '@/app/lib/apiSummary.js';
import { useRouter } from 'next/navigation';
import AuditLogModal from '../AdminDashboardComponents/Modals/AuditLogModal';

export default function AuditLogs() {
  let router = useRouter()
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('all');
  const [actionCategoryFilter, setActionCategoryFilter] = useState('all');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    limit: 50,
    has_next: false,
    has_prev: false
  });
  const admin_user = useAdminUserStore(state => state.adminuser);

  // Available filters based on actual database schema
  const actionTypes = [
    'all', 'create', 'update', 'delete', 'login', 'logout', 
    'view', 'export', 'import', 'download', 'upload'
  ];
  
  const actionCategories = [
    'all', 'user_management', 'product_management', 'order_management', 
    'category_management', 'inventory_management', 'system_management',
    'accessory_management', 'store_management'
  ];

  const resourceTypes = [
    'all', 'user', 'product', 'order', 'category', 
            'accessory', 'store', 'payment', 'settings'
  ];

  const statusTypes = ['all', 'success', 'failure'];

  useEffect(() => {
    setLoading(true);
    if (admin_user?.id) {
      if (admin_user.role !== "admin" && (!admin_user.accessiblepages.some((accessible_page) => accessible_page === "audit_logs"))) {
        // toast.error("You don't have access to this page.");
        // router.push("/admin/dashboard/");
         fetchLogs();
        fetchUsersList();
      } else {
        fetchLogs();
        fetchUsersList();
      }
    }
  }, [admin_user?.id]);

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true);
      


      const response = await axios.post(apiSummary.admin.audit.get_logs, {
        page: page,
        limit: pagination.limit,
        search: searchTerm,
        action_type: actionTypeFilter,
        action_category: actionCategoryFilter,
        resource_type: resourceTypeFilter,
        user_id: userFilter,
        status: statusFilter,
        start_date: startDate,
        end_date: endDate
      });
      
      if (response.data.success) {
        setLogs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error("Failed to load audit logs");
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error("Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const response = await axios.get(apiSummary.admin.users.get_all_users);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLogs(1);
  };

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, current_page: 1 }));
    fetchLogs(1);
  };

  const handlePageChange = (page) => {
    fetchLogs(page);
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />;
  };

  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'user': return <FiUser className="text-blue-500" />;
      case 'product': return <FiBox className="text-green-500" />;
      case 'order': return <FiShoppingCart className="text-purple-500" />;
      case 'category': return <FiServer className="text-indigo-500" />;
      case 'accessory': return <FiDatabase className="text-orange-500" />;
      case 'store': return <FiDatabase className="text-teal-500" />;
      
      case 'payment': return <FiDatabase className="text-yellow-500" />;
      case 'settings': return <FiServer className="text-gray-500" />;
      default: return <FiServer className="text-gray-500" />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': return 'bg-purple-100 text-purple-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'view': return 'bg-indigo-100 text-indigo-800';
      case 'export': return 'bg-teal-100 text-teal-800';
      case 'import': return 'bg-cyan-100 text-cyan-800';
      case 'download': return 'bg-emerald-100 text-emerald-800';
      case 'upload': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserName = (userId, userEmail) => {
    if (!userId) return userEmail || "System";
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : (userEmail || `User (${userId})`);
  };

  const getActionDescription = (log) => {
    const action = log.action_type;
    const resource = log.resource_type;
    const resourceName = log.resource_name || log.resource_id || 'Unknown';
    
    switch (action) {
      case 'create':
        return `Created new ${resource} "${resourceName}"`;
      case 'update':
        return `Updated ${resource} "${resourceName}"`;
      case 'delete':
        return `Deleted ${resource} "${resourceName}"`;
      case 'login':
        return `User logged in`;
      case 'logout':
        return `User logged out`;
      case 'view':
        return `Viewed ${resource} "${resourceName}"`;
      case 'export':
        return `Exported ${resource} data`;
      case 'import':
        return `Imported ${resource} data`;
      default:
        return `${action} action on ${resource}`;
    }
  };

  // Filter and sort logs
  const filteredAndSortedLogs = [...logs]
    .sort((a, b) => {
      if (sortConfig.key) {
        let aValue, bValue;
        
        if (sortConfig.key === 'user_name') {
          aValue = getUserName(a.user_id, a.user_email);
          bValue = getUserName(b.user_id, b.user_email);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });

  return (
    <div className="lg:p-6">
      {/* Header and controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiClock className="text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-sm text-gray-500">
            Track all activities and changes across the system ({pagination.total_count} total logs)
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
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search logs by email, resource name, action type..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {actionTypes.filter(a => a !== 'all').map(action => (
                <option key={action} value={action}>
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDatabase className="text-gray-400" />
            </div>
            <select 
              className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={resourceTypeFilter}
              onChange={(e) => setResourceTypeFilter(e.target.value)}
            >
              <option value="all">All Resources</option>
              {resourceTypes.filter(r => r !== 'all').map(resource => (
                <option key={resource} value={resource}>
                  {resource.charAt(0).toUpperCase() + resource.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={actionCategoryFilter}
              onChange={(e) => setActionCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {actionCategories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>
                  {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select 
              className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select 
              className="border rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              {statusTypes.filter(s => s !== 'all').map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setActionTypeFilter('all');
                setActionCategoryFilter('all');
                setResourceTypeFilter('all');
                setUserFilter('all');
                setStatusFilter('all');
                setStartDate('');
                setEndDate('');
                handleFilterChange();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-64">
            <FiLoader className="animate-spin text-2xl mb-2 text-blue-600" />
            <p>Loading audit logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('created_at')}
                  >
                    <div className="flex items-center">
                      Timestamp
                      {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('user_name')}
                  >
                    <div className="flex items-center">
                      User
                      {getSortIcon('user_name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('action_type')}
                  >
                    <div className="flex items-center">
                      Action
                      {getSortIcon('action_type')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('resource_type')}
                  >
                    <div className="flex items-center">
                      Resource
                      {getSortIcon('resource_type')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedLogs.length > 0 ? (
                  filteredAndSortedLogs.map((log) => (
                    <tr key={log.audit_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getUserName(log.user_id, log.user_email)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action_type)}`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {getResourceIcon(log.resource_type)}
                          <span className="ml-1">{log.resource_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.resource_name || log.resource_id}>
                        {log.resource_name || log.resource_id || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.action_category ? log.action_category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {log.status === 'success' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              <FiCheck className="mr-1" /> Success
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              <FiX className="mr-1" /> Failed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <FiEye className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <FiAlertCircle className="text-3xl mb-2" />
                        <p className="text-sm">No audit logs found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="mt-6 flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing page {pagination.current_page} of {pagination.total_pages} 
              ({pagination.total_count} total logs)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={!pagination.has_prev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              {pagination.current_page}
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={!pagination.has_next}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Log details modal */}
      <AuditLogModal
        log={selectedLog}
        users={users}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}