/**
 * Admin Authentication Helper
 * Provides utilities for extracting admin user information from requests
 * and creating standardized audit logs for admin actions
 */

import { auditHelper } from './auditHelper';

/**
 * Extract admin user information from request headers
 * @param {Request} request - The incoming request
 * @returns {Object} Admin user information
 */
export function extractAdminUserInfo(request) {
  return {
    adminUserId: request.headers.get('x-admin-user-id'),
    adminUserEmail: request.headers.get('x-admin-user-email'),
    adminUserName: request.headers.get('x-admin-user-name'),
    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown'
  };
}

/**
 * Create a standardized audit log for admin actions
 * @param {string} actionType - Type of action (create, update, delete, etc.)
 * @param {string} resourceType - Type of resource (category, product, accessory_category, etc.)
 * @param {Object} userInfo - Admin user information
 * @param {Object} options - Additional options for the audit log
 * @returns {Promise<Object>} Result of the audit log creation
 */
export async function createAdminAuditLog(actionType, resourceType, userInfo, options = {}) {
  const {
    adminUserId,
    adminUserEmail,
    adminUserName,
    ipAddress,
    userAgent
  } = userInfo;

  const auditOptions = {
    status: options.status || 'success',
    ip_address: ipAddress,
    user_agent: userAgent,
    metadata: {
      ...options.metadata,
      admin_user_name: adminUserName
    },
    ...options
  };

  // Determine the appropriate audit helper method based on resource type
  switch (resourceType) {
    case 'category':
    case 'accessory_category':
      return auditHelper.logCategoryAction(
        actionType,
        adminUserId,
        adminUserEmail,
        options.resourceId || null,
        options.resourceName || 'unknown',
        auditOptions
      );
    
    case 'product':
    case 'accessory_product':
      return auditHelper.logProductAction(
        actionType,
        adminUserId,
        adminUserEmail,
        options.resourceId || null,
        options.resourceName || 'unknown',
        auditOptions
      );
    
    case 'user':
      return auditHelper.logUserAction(
        actionType,
        adminUserId,
        adminUserEmail,
        resourceType,
        options.resourceId || null,
        options.resourceName || 'unknown',
        auditOptions
      );
    
    default:
      return auditHelper.logSystemAction(
        actionType,
        adminUserId,
        adminUserEmail,
        resourceType,
        options.resourceId || null,
        options.resourceName || 'unknown',
        auditOptions
      );
  }
}

/**
 * Log a failed admin action with standardized error information
 * @param {string} actionType - Type of action that failed
 * @param {string} resourceType - Type of resource
 * @param {Object} userInfo - Admin user information
 * @param {string} errorMessage - Error message
 * @param {Object} additionalMetadata - Additional metadata
 * @returns {Promise<Object>} Result of the audit log creation
 */
export async function logFailedAdminAction(actionType, resourceType, userInfo, errorMessage, additionalMetadata = {}) {
  return createAdminAuditLog(actionType, resourceType, userInfo, {
    status: 'failure',
    error_message: errorMessage,
    metadata: {
      attempt_type: 'failed_action',
      ...additionalMetadata
    }
  });
}

/**
 * Log a successful admin action with standardized success information
 * @param {string} actionType - Type of action that succeeded
 * @param {string} resourceType - Type of resource
 * @param {Object} userInfo - Admin user information
 * @param {Object} successData - Success data (old_values, new_values, etc.)
 * @param {Object} additionalMetadata - Additional metadata
 * @returns {Promise<Object>} Result of the audit log creation
 */
export async function logSuccessfulAdminAction(actionType, resourceType, userInfo, successData = {}, additionalMetadata = {}) {
  return createAdminAuditLog(actionType, resourceType, userInfo, {
    status: 'success',
    ...successData,
    metadata: {
      attempt_type: 'successful_action',
      ...additionalMetadata
    }
  });
}

export default {
  extractAdminUserInfo,
  createAdminAuditLog,
  logFailedAdminAction,
  logSuccessfulAdminAction
};
