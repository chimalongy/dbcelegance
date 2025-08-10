import bcrypt from 'bcryptjs';
import { pool } from './db';

class DBFunctions {
  constructor() {
    this.pool = pool;
  }

  // ... (keep existing findAdminUser and registerAdminUser methods)

  async updateUserData(userId, updateData) {
    try {
      const { firstName, lastName, email, role, status } = updateData;
      
      const result = await this.pool.query(
        `UPDATE admin_users 
         SET first_name = $1, last_name = $2, email = $3, role = $4, status = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING id, first_name, last_name, email, role, status, created_at, updated_at`,
        [firstName, lastName, email, role, status, userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  async updateUserPassword(userId, currentPassword, newPassword) {
    try {
      // First get the current password hash
      const userResult = await this.pool.query(
        'SELECT password_hash FROM admin_users WHERE id = $1',
        [userId]
      );

      if (userResult.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValid = await bcrypt.compare(
        currentPassword, 
        userResult.rows[0].password_hash
      );

      if (!isValid) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await this.pool.query(
        'UPDATE admin_users SET password_hash = $1 WHERE id = $2',
        [newHashedPassword, userId]
      );

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }

  async deleteUser(userId) {
    try {
      const result = await this.pool.query(
        'DELETE FROM admin_users WHERE id = $1 RETURNING id, email',
        [userId]
      );

      if (result.rowCount === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true, data: result.rows[0] };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }

  async getAllUsers() {
    try {
      const result = await this.pool.query(
        'SELECT id, first_name, last_name, email, role, status, created_at, updated_at FROM admin_users'
      );

      return { success: true, data: result.rows };
    } catch (error) {
      console.error('Error getting users:', error);
      return { success: false, error: 'Failed to get users' };
    }
  }


  
}

export default DBFunctions;