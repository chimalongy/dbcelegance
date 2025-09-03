# Audit Logs Setup Guide

## Overview
The audit logs system has been implemented to track all activities and changes across the DBC Elegance system. This provides comprehensive logging for security, compliance, and debugging purposes.

## Environment Variables Required

Add these to your `.env` file:

```env
# Audit Logs Table
DATABASE_AUDIT_LOGS_TABLE=audit_logs

# Other required database tables
DATABASE_ADMIN_USERS_TABLE=admin_users
DATABASE_CATEGORY_TABLE=categories
DATABASE_PRODUCTS_TABLE=products

DATABASE_ACCESSORY_CATEGORY_TABLE=accessory_categories
DATABASE_ACCESSORY_PRODUCTS_TABLE=accessory_products
```

## Database Table Structure

The audit logs table (`audit_logs`) includes the following fields:

- **audit_id**: Primary key (auto-increment)
- **user_id**: Reference to admin user (nullable)
- **user_email**: User's email for quick access
- **action_type**: Type of action (create, update, delete, login, etc.)
- **action_category**: Category of action (user_management, product_management, etc.)
- **resource_type**: Type of resource being acted upon
- **resource_id**: ID of the resource
- **resource_name**: Name/description of the resource
- **old_values**: JSONB field for previous values (for updates)
- **new_values**: JSONB field for new values (for updates)
- **ip_address**: User's IP address
- **user_agent**: Browser/client information
- **location**: Geographic location
- **session_id**: Session identifier
- **status**: Success/failure status
- **error_message**: Error details if any
- **metadata**: Additional contextual information (JSONB)
- **created_at**: Timestamp

## API Endpoints

### Get Audit Logs
```
GET /api/admin/Audits/get_audit
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `search`: Search term
- `action_type`: Filter by action type
- `action_category`: Filter by action category
- `resource_type`: Filter by resource type
- `user_id`: Filter by user ID
- `status`: Filter by status
- `start_date`: Filter by start date
- `end_date`: Filter by end date

### Create Audit Log
```
POST /api/admin/Audits/add
```

**Required Fields:**
- `action_type`
- `action_category`
- `resource_type`

## Usage Examples

### Using the AuditLogger Utility

```javascript
import AuditLogger from '@/app/lib/auditLogger';

// Log a product creation
await AuditLogger.logProductAction('create', adminUser, productId, productName, {
  metadata: { store: 'male', category: 'shirts' }
});

// Log a user login
await AuditLogger.logAuthAction('login', user, {
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0...',
  location: 'New York, US'
});

// Log a category update
await AuditLogger.logCategoryAction('update', adminUser, categoryId, categoryName, {
  oldValues: { name: 'Old Name', status: 'inactive' },
  newValues: { name: 'New Name', status: 'active' }
});
```

### Manual Audit Log Creation

```javascript
import axios from 'axios';
import { apiSummary } from '@/app/lib/apiSummary';

const auditData = {
  user_id: adminUser.id,
  user_email: adminUser.email,
  action_type: 'create',
  action_category: 'product_management',
  resource_type: 'product',
  resource_id: productId,
  resource_name: productName,
  status: 'success',
  metadata: { additional_info: 'Product created via admin panel' }
};

await axios.post(apiSummary.admin.audit.create_log, auditData);
```

## Integration Points

### Product Management
- Product creation, updates, and deletions
- Variant management
- Category operations

### User Management
- User creation, updates, and deletions
- Role changes
- Permission updates

### System Operations
- Login/logout events
- File uploads/downloads
- Data exports/imports

## Features

### Advanced Filtering
- Multiple filter combinations
- Date range filtering
- Search across multiple fields
- User-specific filtering

### Comprehensive Display
- Detailed modal view for each log entry
- JSON data formatting for complex fields
- User-friendly action descriptions
- System information display

### Performance Optimization
- Pagination support
- Database indexing
- Efficient query building
- Caching considerations

## Security Considerations

1. **Access Control**: Only users with appropriate permissions can view audit logs
2. **Data Privacy**: Sensitive information is logged but can be filtered/redacted
3. **Audit Trail**: All changes are tracked with user attribution
4. **Compliance**: Supports regulatory requirements for change tracking

## Monitoring and Maintenance

### Regular Tasks
- Monitor log table size
- Archive old logs if needed
- Review failed operations
- Analyze user activity patterns

### Performance Monitoring
- Query execution times
- Table size growth
- Index usage statistics
- Connection pool health

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure all required DATABASE_* variables are set
   - Check table names match your database schema

2. **Permission Errors**
   - Verify user has access to audit_logs table
   - Check admin user permissions

3. **Performance Issues**
   - Ensure proper database indexes exist
   - Monitor query execution plans
   - Consider pagination for large datasets

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG_AUDIT_LOGS=true
```

This will provide detailed console output for audit log operations.

## Future Enhancements

- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Analytics**: Dashboard with charts and insights
- **Export Functionality**: CSV/Excel export of audit data
- **Retention Policies**: Automated cleanup of old logs
- **Integration**: Third-party logging service integration
