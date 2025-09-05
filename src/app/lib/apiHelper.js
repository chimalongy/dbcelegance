/**
 * API Helper - Provides utilities for making authenticated admin API calls
 * with proper user information headers for audit logging
 */

import axios from 'axios';
import { useAdminUserStore } from './store/adminuserstore';

/**
 * Get admin user information from the store
 * @returns {Object|null} Admin user information or null if not logged in
 */
export function getAdminUserInfo() {
  const state = useAdminUserStore.getState();
  return state.adminuser;
}

/**
 * Create headers with admin user information for audit logging
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object with admin user information
 */
export function createAdminHeaders(additionalHeaders = {}) {
  const adminUser = getAdminUserInfo();
  
  if (!adminUser) {
    console.warn('No admin user found in store. Audit logs will show "system" instead of user details.');
    return additionalHeaders;
  }

  return {
    ...additionalHeaders,
    'x-admin-user-id': adminUser.id?.toString() || '',
    'x-admin-user-email': adminUser.email || '',
    'x-admin-user-name': `${adminUser.first_name || ''} ${adminUser.last_name || ''}`.trim(),
  };
}

/**
 * Make an authenticated admin API call with proper headers
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} url - API endpoint URL
 * @param {Object} data - Request data
 * @param {Object} options - Additional axios options
 * @returns {Promise} Axios response
 */
export async function makeAdminApiCall(method, url, data = null, options = {}) {
  const headers = createAdminHeaders(options.headers);
  
  const config = {
    ...options,
    headers,
  };

  try {
    switch (method.toLowerCase()) {
      case 'get':
        return await axios.get(url, config);
      case 'post':
        return await axios.post(url, data, config);
      case 'put':
        return await axios.put(url, data, config);
      case 'delete':
        return await axios.delete(url, config);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    console.error(`Admin API call failed (${method} ${url}):`, error);
    throw error;
  }
}

/**
 * Make a POST request with FormData (for file uploads)
 * @param {string} url - API endpoint URL
 * @param {FormData} formData - Form data to send
 * @param {Object} options - Additional axios options
 * @returns {Promise} Axios response
 */
export async function makeAdminFormDataPost(url, formData, options = {}) {
  const headers = createAdminHeaders({
    'Content-Type': 'multipart/form-data',
    ...options.headers,
  });

  const config = {
    ...options,
    headers,
  };

  try {
    return await axios.post(url, formData, config);
  } catch (error) {
    console.error(`Admin FormData POST failed (${url}):`, error);
    throw error;
  }
}

/**
 * Make a POST request with JSON data
 * @param {string} url - API endpoint URL
 * @param {Object} data - JSON data to send
 * @param {Object} options - Additional axios options
 * @returns {Promise} Axios response
 */
export async function makeAdminJsonPost(url, data, options = {}) {
  const headers = createAdminHeaders({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  const config = {
    ...options,
    headers,
  };

  try {
    return await axios.post(url, data, config);
  } catch (error) {
    console.error(`Admin JSON POST failed (${url}):`, error);
    throw error;
  }
}

export default {
  getAdminUserInfo,
  createAdminHeaders,
  makeAdminApiCall,
  makeAdminFormDataPost,
  makeAdminJsonPost,
};
