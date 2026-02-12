import { body, param } from 'express-validator';

// Validation for creating a user
export const validateCreateUser = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Username can only contain letters, numbers, and spaces'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
    
    body('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array')
        .custom((value) => {
            const validPermissions = [
                'customer_read', 'customer_write', 'customer_delete',
                'subscription_read', 'subscription_write', 'subscription_delete',
                'notification_read', 'notification_write', 'notification_delete',
                'email_campaign_read', 'email_campaign_write', 'email_campaign_delete',
                'stats_view', 'user_management'
            ];
            
            if (value && value.length > 0) {
                const invalidPermissions = value.filter(perm => !validPermissions.includes(perm));
                if (invalidPermissions.length > 0) {
                    throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`);
                }
            }
            return true;
        })
];

// Validation for updating a user
export const validateUpdateUser = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9\s]+$/)
        .withMessage('Username can only contain letters, numbers, and spaces'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('role')
        .optional()
        .isIn(['admin', 'user'])
        .withMessage('Role must be either admin or user'),
    
    body('permissions')
        .optional()
        .isArray()
        .withMessage('Permissions must be an array')
        .custom((value) => {
            const validPermissions = [
                'customer_read', 'customer_write', 'customer_delete',
                'subscription_read', 'subscription_write', 'subscription_delete',
                'notification_read', 'notification_write', 'notification_delete',
                'email_campaign_read', 'email_campaign_write', 'email_campaign_delete',
                'stats_view', 'user_management'
            ];
            
            if (value && value.length > 0) {
                const invalidPermissions = value.filter(perm => !validPermissions.includes(perm));
                if (invalidPermissions.length > 0) {
                    throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`);
                }
            }
            return true;
        }),
    
    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean value')
];

// Validation for user ID parameter
export const validateUserId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid user ID format')
];

