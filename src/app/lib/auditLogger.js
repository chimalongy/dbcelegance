import axios from 'axios';
import { apiSummary } from './apiSummary';

/**
 * Utility class for creating audit logs throughout the application
 */
class AuditLogger {
  /**
   * Create an audit log entry
   * @param {Object} options - Audit log options
   * @param {string} options.actionType - Type of action (create, update, delete, login, etc.)
   * @param {string} options.actionCategory - Category of action (user_management, product_management, etc.)
   * @param {string} options.resourceType - Type of resource being acted upon
   * @param {string|number} options.resourceId - ID of the resource
   * @param {string} options.resourceName - Name/description of the resource
   * @param {Object} options.oldValues - Previous values (for updates)
   * @param {Object} options.newValues - New values (for updates)
   * @param {Object} options.user - User performing the action
   * @param {string} options.status - Status of the action (success, failure)
   * @param {string} options.errorMessage - Error message if status is failure
   * @param {Object} options.metadata - Additional contextual information
   * @param {string} options.ipAddress - IP address of the user
   * @param {string} options.userAgent - User agent string
   * @param {string} options.location - Geographic location
   * @param {string} options.sessionId - Session identifier
   */
  static async log(options) {
    try {
      const {
        actionType,
        actionCategory,
        resourceType,
        resourceId,
        resourceName,
        oldValues,
        newValues,
        user,
        status = 'success',
        errorMessage,
        metadata,
        ipAddress,
        userAgent,
        location,
        sessionId
      } = options;

      // Validate required fields
      if (!actionType || !actionCategory || !resourceType) {
        console.error('AuditLogger: Missing required fields', options);
        return false;
      }

      const auditData = {
        user_id: user?.id || null,
        user_email: user?.email || null,
        action_type: actionType,
        action_category: actionCategory,
        resource_type: resourceType,
        resource_id: resourceId || null,
        resource_name: resourceName || null,
        old_values: oldValues || null,
        new_values: newValues || null,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        location: location || null,
        session_id: sessionId || null,
        status,
        error_message: errorMessage || null,
        metadata: metadata || null
      };

      const response = await axios.post(apiSummary.admin.audit.create_log, auditData);
      
      if (response.data.success) {
        console.log('Audit log created successfully:', response.data.data.audit_id);
        return true;
      } else {
        console.error('Failed to create audit log:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error creating audit log:', error);
      return false;
    }
  }

  /**
   * Log a user action
   */
  static async logUserAction(actionType, user, resourceType, resourceId, resourceName, options = {}) {
    return this.log({
      actionType,
      actionCategory: 'user_management',
      resourceType,
      resourceId,
      resourceName,
      user,
      ...options
    });
  }

  /**
   * Log a product action
   */
  static async logProductAction(actionType, user, resourceId, resourceName, options = {}) {
    return this.log({
      actionType,
      actionCategory: 'product_management',
      resourceType: 'product',
      resourceId,
      resourceName,
      user,
      ...options
    });
  }

  /**
   * Log a category action
   */
  static async logCategoryAction(actionType, user, resourceId, resourceName, options = {}) {
    return this.log({
      actionType,
      actionCategory: 'category_management',
      resourceType: 'category',
      resourceId,
      resourceName,
      user,
      ...options
    });
  }

  /**
   * Log a login/logout action
   */
  static async logAuthAction(actionType, user, options = {}) {
    return this.log({
      actionType,
      actionCategory: 'system_management',
      resourceType: 'user',
      resourceId: user?.id,
      resourceName: user?.email,
      user,
      ...options
    });
  }

  /**
   * Log a system action
   */
  static async logSystemAction(actionType, user, resourceType, resourceId, resourceName, options = {}) {
    return this.log({
      actionType,
      actionCategory: 'system_management',
      resourceType,
      resourceId,
      resourceName,
      user,
      ...options
    });
  }
}

export default AuditLogger;
