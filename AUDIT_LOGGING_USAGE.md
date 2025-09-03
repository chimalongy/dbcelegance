# Audit Logging Usage Guide

## Overview

The `createAuditLog` function has been moved to `DBFunctions` and is now reusable across your entire application. This guide shows you how to use it effectively.

## What Was Changed

1. **Removed duplicate code**: The local `createAuditLog` function in `login/route.js` has been replaced with a call to `DBFunctions.createAuditLog`
2. **Centralized audit logging**: All audit logging now goes through the centralized `DBFunctions.createAuditLog` method
3. **Created helper utilities**: Added `AuditHelper` class for easier audit logging throughout the app

## How to Use

### Option 1: Direct DBFunctions Usage

```javascript
import DBFunctions from '../../../utils/DB/DBFunctions';

export async function POST(request) {
  const dbActions = new DBFunctions();
  
  // Create audit log directly
  const auditResult = await dbActions.createAuditLog({
    user_id: userId,
    user_email: userEmail,
    action_type: 'create',
    action_category: 'product_management',
    resource_type: 'product',
    resource_id: productId,
    resource_name: productName,
    status: 'success',
    ip_address: clientIP,
    user_agent: userAgent,
    metadata: { additional_info: 'some data' }
  });
  
  if (auditResult.success) {
    console.log('Audit log created:', auditResult.data.audit_id);
  }
}
```

### Option 2: Using AuditHelper (Recommended)

```javascript
import { auditHelper } from '@/app/lib/auditHelper';

export async function POST(request) {
  // Log a product creation
  await auditHelper.logProductAction(
    'create',           // actionType
    userId,             // userId
    userEmail,          // userEmail
    productId,          // productId
    productName,        // productName
    {
      ip_address: clientIP,
      user_agent: userAgent,
      metadata: { category: 'fashion' }
    }
  );
  
  // Log a user action
  await auditHelper.logUserAction(
    'update',           // actionType
    adminId,            // userId
    adminEmail,         // userEmail
    'user',             // resourceType
    targetUserId,       // resourceId
    'User profile update', // resourceName
    {
      old_values: oldUserData,
      new_values: newUserData,
      ip_address: clientIP
    }
  );
  
  // Log a system action
  await auditHelper.logSystemAction(
    'backup',           // actionType
    systemUserId,       // userId
    systemEmail,        // userEmail
    'database',         // resourceType
    null,               // resourceId
    'Database backup completed', // resourceName
    {
      metadata: { backup_size: '2.5GB', duration: '15min' }
    }
  );
}
```

### Option 3: Custom AuditHelper Instance

```javascript
import AuditHelper from '@/app/lib/auditHelper';

export async function POST(request) {
  const customAuditHelper = new AuditHelper();
  
  // Use custom instance
  await customAuditHelper.createAuditLog({
    user_id: userId,
    user_email: userEmail,
    action_type: 'custom_action',
    action_category: 'custom_category',
    resource_type: 'custom_resource',
    status: 'success',
    metadata: { custom_field: 'custom_value' }
  });
}
```

## Audit Data Structure

### Required Fields
- `action_type`: Type of action (create, update, delete, login, etc.)
- `action_category`: Category of action (user_management, product_management, etc.)
- `resource_type`: Type of resource being acted upon
- `status`: Status of the action (success, failure)

### Optional Fields
- `user_id`: ID of the user performing the action
- `user_email`: Email of the user performing the action
- `resource_id`: ID of the resource being acted upon
- `resource_name`: Name/description of the resource
- `old_values`: Previous values (for updates) - automatically JSON stringified
- `new_values`: New values (for updates) - automatically JSON stringified
- `ip_address`: IP address of the user
- `user_agent`: User agent string
- `location`: Geographic location
- `session_id`: Session identifier
- `error_message`: Error message if status is failure
- `metadata`: Additional contextual information - automatically JSON stringified

## Examples by Use Case

### User Management
```javascript
// User creation
await auditHelper.logUserAction('create', adminId, adminEmail, 'user', newUserId, 'New user account', {
  new_values: { email: 'user@example.com', role: 'customer' },
  ip_address: clientIP
});

// User update
await auditHelper.logUserAction('update', adminId, adminEmail, 'user', userId, 'User profile update', {
  old_values: { role: 'customer' },
  new_values: { role: 'admin' },
  ip_address: clientIP
});

// User deletion
await auditHelper.logUserAction('delete', adminId, adminEmail, 'user', userId, 'User account deletion', {
  old_values: { email: 'user@example.com', role: 'admin' },
  ip_address: clientIP
});
```

### Product Management
```javascript
// Product creation
await auditHelper.logProductAction('create', adminId, adminEmail, productId, productName, {
  new_values: { name: productName, price: productPrice, category: categoryId },
  ip_address: clientIP
});

// Product update
await auditHelper.logProductAction('update', adminId, adminEmail, productId, productName, {
  old_values: { price: oldPrice },
  new_values: { price: newPrice },
  ip_address: clientIP
});
```

### Authentication
```javascript
// Login attempts
await auditHelper.logLoginAttempt(email, 'success', {
  ip_address: clientIP,
  location: clientLocation,
  user_agent: userAgent,
  metadata: { login_method: 'password' }
});

await auditHelper.logLoginAttempt(email, 'failure', {
  ip_address: clientIP,
  error_message: 'Invalid password',
  metadata: { attempt_count: 3 }
});
```

## Best Practices

1. **Always log important actions**: User management, product changes, authentication attempts
2. **Include context**: Add relevant metadata for debugging and auditing
3. **Handle errors gracefully**: Don't let audit logging failures break your main functionality
4. **Use consistent naming**: Stick to the predefined action types and categories
5. **Include user context**: Always log who performed the action and from where

## Migration from Old Code

If you have existing audit logging code, replace it like this:

### Before (Old way)
```javascript
// Direct database query
const result = await pool.query(
  `INSERT INTO audit_logs (...) VALUES (...)`,
  [user_id, action_type, ...]
);
```

### After (New way)
```javascript
// Using DBFunctions
const result = await dbActions.createAuditLog({
  user_id,
  action_type,
  // ... other fields
});

// Or using AuditHelper
await auditHelper.logUserAction('create', userId, userEmail, 'user', resourceId, resourceName);
```

## Error Handling

The audit logging methods include built-in error handling:

```javascript
const auditResult = await auditHelper.logProductAction('create', userId, userEmail, productId, productName);

if (!auditResult.success) {
  console.error('Failed to create audit log:', auditResult.error);
  // Don't break your main functionality - audit logging failures shouldn't stop the app
}
```

## Performance Considerations

- Audit logging is asynchronous and won't block your main operations
- The `DBFunctions.createAuditLog` method is optimized for performance
- Consider batching audit logs for high-volume operations if needed

## Testing

You can test audit logging by checking the database:

```sql
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

Or use the existing audit API endpoint:

```javascript
// Get audit logs
const response = await fetch('/api/admin/Audits/get_audit');
const auditLogs = await response.json();
```
