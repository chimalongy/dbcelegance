// components/AuditLogModal.jsx
"use client";

import { FiX, FiUser, FiClock, FiDatabase, FiAlertCircle, FiCheck, FiGlobe, FiMapPin, FiMonitor, FiHash, FiTag, FiInfo } from 'react-icons/fi';

const AuditLogModal = ({ log, users, isOpen, onClose }) => {
  if (!isOpen || !log) return null;

  const getUserName = (userId, userEmail) => {
    if (!userId) return userEmail || "System";
    const user = users.find(u => u.id === userId);
    return user ? `${user.first_name} ${user.last_name}` : (userEmail || `User (${userId})`);
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

  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'user': return <FiUser className="text-blue-500" />;
      case 'product': return <FiDatabase className="text-green-500" />;
      case 'order': return <FiDatabase className="text-purple-500" />;
      case 'category': return <FiDatabase className="text-indigo-500" />;
      case 'accessory': return <FiDatabase className="text-orange-500" />;
      case 'store': return <FiDatabase className="text-teal-500" />;
      case 'variant': return <FiDatabase className="text-pink-500" />;
      case 'payment': return <FiDatabase className="text-yellow-500" />;
      case 'settings': return <FiDatabase className="text-gray-500" />;
      default: return <FiDatabase className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatJsonData = (data) => {
    if (!data) return null;
    try {
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data;
    } catch (error) {
      return data;
    }
  };

  const renderJsonData = (data, title) => {
    const formattedData = formatJsonData(data);
    if (!formattedData) return null;

    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-500">{title}</label>
        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(formattedData, null, 2)}
          </pre>
        </div>
      </div>
    );
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
      case 'download':
        return `Downloaded ${resource} data`;
      case 'upload':
        return `Uploaded ${resource} data`;
      default:
        return `${action} action on ${resource}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Audit Log Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              {getActionDescription(log)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Action Type</label>
              <div className="flex items-center">
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getActionColor(log.action_type)}`}>
                  {log.action_type.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="flex items-center">
                {log.status === 'success' ? (
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    <FiCheck className="mr-1" /> Success
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                    <FiAlertCircle className="mr-1" /> Failed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Resource Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Resource Type</label>
              <div className="flex items-center text-gray-800">
                {getResourceIcon(log.resource_type)}
                <span className="ml-2 capitalize">{log.resource_type}</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Resource ID</label>
              <p className="text-gray-800 font-mono">{log.resource_id || 'N/A'}</p>
            </div>
          </div>

          {/* Resource Name */}
          {log.resource_name && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Resource Name</label>
              <p className="text-gray-800 font-medium">{log.resource_name}</p>
            </div>
          )}

          {/* Action Category */}
          {log.action_category && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Action Category</label>
              <div className="flex items-center">
                <FiTag className="text-gray-400 mr-2" />
                <span className="text-gray-800">
                  {log.action_category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Performed By</label>
            <div className="flex items-center text-gray-800">
              <FiUser className="text-gray-400 mr-2" />
              <span>{getUserName(log.user_id, log.user_email)}</span>
              {log.user_email && (
                <span className="ml-2 text-sm text-gray-500">({log.user_email})</span>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Timestamp</label>
            <div className="flex items-center text-gray-800">
              <FiClock className="text-gray-400 mr-2" />
              <span>{formatDate(log.created_at)}</span>
            </div>
          </div>

          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {log.ip_address && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">IP Address</label>
                <div className="flex items-center text-gray-800">
                  <FiGlobe className="text-gray-400 mr-2" />
                  <span className="font-mono">{log.ip_address}</span>
                </div>
              </div>
            )}

            {log.user_agent && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">User Agent</label>
                <div className="flex items-center text-gray-800">
                  <FiMonitor className="text-gray-400 mr-2" />
                  <span className="text-sm font-mono truncate" title={log.user_agent}>
                    {log.user_agent}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Location and Session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {log.location && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Location</label>
                <div className="flex items-center text-gray-800">
                  <FiMapPin className="text-gray-400 mr-2" />
                  <span>{log.location}</span>
                </div>
              </div>
            )}

            {log.session_id && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Session ID</label>
                <div className="flex items-center text-gray-800">
                  <FiHash className="text-gray-400 mr-2" />
                  <span className="font-mono text-sm">{log.session_id}</span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {log.error_message && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Error Message</label>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{log.error_message}</p>
              </div>
            </div>
          )}

          {/* Old Values */}
          {renderJsonData(log.old_values, 'Previous Values')}

          {/* New Values */}
          {renderJsonData(log.new_values, 'New Values')}

          {/* Metadata */}
          {renderJsonData(log.metadata, 'Additional Metadata')}

          {/* Audit ID */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-500">Audit Log ID</label>
            <div className="flex items-center text-gray-800">
              <FiInfo className="text-gray-400 mr-2" />
              <span className="font-mono text-sm">{log.audit_id}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogModal;