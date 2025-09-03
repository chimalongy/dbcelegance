import DBFunctions from '../../../utils/DB/DBFunctions';

/**
 * Audit Helper - Provides easy-to-use methods for creating audit logs
 * using the reusable createAuditLog method from DBFunctions
 */
export class AuditHelper {
  constructor() {
    this.dbActions = new DBFunctions();
  }

  /**
   * Create an audit log entry using DBFunctions.createAuditLog
   * @param {Object} auditData - Audit log data
   * @returns {Promise<Object>} - Result of the audit log creation
   */
  async createAuditLog(auditData) {
    try {
      // Prepare the data for DBFunctions.createAuditLog
      const auditLogData = {
        ...auditData,
        old_values: auditData.old_values ? JSON.stringify(auditData.old_values) : null,
        new_values: auditData.new_values ? JSON.stringify(auditData.new_values) : null,
        metadata: auditData.metadata ? JSON.stringify(auditData.metadata) : null
      };
      
      const result = await this.dbActions.createAuditLog(auditLogData);
      return result;
    } catch (error) {
      console.error('Error creating audit log:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Log user login attempts
   */
  async logLoginAttempt(email, status, options = {}) {
    return this.createAuditLog({
      user_email: email,
      action_type: 'login',
      action_category: 'system_management',
      resource_type: 'user',
      resource_name: 'Login attempt',
      status,
      ...options
    });
  }

  /**
   * Log user actions (create, update, delete)
   */
  async logUserAction(actionType, userId, userEmail, resourceType, resourceId, resourceName, options = {}) {
    return this.createAuditLog({
      user_id: userId,
      user_email: userEmail,
      action_type: actionType,
      action_category: 'user_management',
      resource_type: resourceType,
      resource_id: resourceId,
      resource_name: resourceName,
      ...options
    });
  }

  /**
   * Log product actions
   */
  async logProductAction(actionType, userId, userEmail, productId, productName, options = {}) {
    return this.createAuditLog({
      user_id: userId,
      user_email: userEmail,
      action_type: actionType,
      action_category: 'product_management',
      resource_type: 'product',
      resource_id: productId,
      resource_name: productName,
      ...options
    });
  }

  /**
   * Log category actions
   */
  async logCategoryAction(actionType, userId, userEmail, categoryId, categoryName, options = {}) {
    return this.createAuditLog({
      user_id: userId,
      user_email: userEmail,
      action_type: actionType,
      action_category: 'category_management',
      resource_type: 'category',
      resource_id: categoryId,
      resource_name: categoryName,
      ...options
    });
  }

  /**
   * Log system actions
   */
  async logSystemAction(actionType, userId, userEmail, resourceType, resourceId, resourceName, options = {}) {
    return this.createAuditLog({
      user_id: userId,
      user_email: userEmail,
      action_type: actionType,
      action_category: 'system_management',
      resource_type: resourceType,
      resource_id: resourceId,
      resource_name: resourceName,
      ...options
    });
  }
}

// Export a default instance for easy use
export const auditHelper = new AuditHelper();

// Export the class for creating custom instances
export default AuditHelper;
