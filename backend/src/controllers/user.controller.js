import { User } from '../modles/user.model.js';
import { validationResult } from 'express-validator';

export class UserController {
    // Get all users (admin only)
    static async getAllUsersController(req, res, next) {
        try {
            // Only admin can get all users
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin access required.' 
                });
            }

            const users = await User.find({})
                .select('-__v')
                .sort({ createdAt: -1 });

            res.status(200).json({ 
                success: true, 
                data: { users } 
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user by ID
    static async getUserByIdController(req, res, next) {
        try {
            const { id } = req.params;
            
            // Users can only get their own profile, admins can get any user
            if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied.' 
                });
            }

            const user = await User.findById(id).select('-__v');
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }

            res.status(200).json({ 
                success: true, 
                data: { user } 
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new user (admin only)
    static async createUserController(req, res, next) {
        try {
            // Only admin can create users
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin access required.' 
                });
            }

            // Validate input
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { username, email, password, role = 'user', permissions } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists.'
                });
            }

            // Set default permissions based on role
            let userPermissions = permissions;
            if (!userPermissions) {
                if (role === 'admin') {
                    userPermissions = [
                        'customer_read', 'customer_write', 'customer_delete',
                        'subscription_read', 'subscription_write', 'subscription_delete',
                        'notification_read', 'notification_write', 'notification_delete',
                        'email_campaign_read', 'email_campaign_write', 'email_campaign_delete',
                        'stats_view', 'user_management'
                    ];
                } else if (role === 'manager') {
                    userPermissions = [
                        'customer_read', 'customer_write', 'customer_delete',
                        'subscription_read', 'subscription_write', 'subscription_delete',
                        'notification_read', 'notification_write', 'notification_delete',
                        'stats_view'
                    ];
                } else {
                    userPermissions = ['customer_read', 'subscription_read'];
                }
            }

            // Create new user
            const newUser = new User({
                username,
                email,
                password, // Will be hashed by pre-save middleware
                role,
                permissions: userPermissions,
                isActive: true
            });

            await newUser.save();

            // Remove password from response
            const userResponse = newUser.toObject();
            delete userResponse.password;

            res.status(201).json({ 
                success: true, 
                data: { user: userResponse },
                message: 'User created successfully.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Update user
    static async updateUserController(req, res, next) {
        try {
            const { id } = req.params;
            const { username, email, role, permissions, isActive } = req.body;

            // Users can only update their own profile, admins can update any user
            if (req.user.role !== 'admin' && req.user._id.toString() !== id) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied.' 
                });
            }

            // Find user
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }

            // Validate input
            const errors = validationResult(req);
            if (errors && !errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            // Check if email/username is already taken by another user
            if (email || username) {
                const existingUser = await User.findOne({
                    _id: { $ne: id },
                    $or: [
                        ...(email ? [{ email }] : []),
                        ...(username ? [{ username }] : [])
                    ]
                });

                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email or username already exists.'
                    });
                }
            }

            // Update fields
            if (username) user.username = username;
            if (email) user.email = email;
            if (role !== undefined) user.role = role;
            if (permissions !== undefined) user.permissions = permissions;
            if (isActive !== undefined) user.isActive = isActive;

            user.updatedAt = new Date();
            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ 
                success: true, 
                data: { user: userResponse },
                message: 'User updated successfully.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete user (admin only)
    static async deleteUserController(req, res, next) {
        try {
            const { id } = req.params;

            // Only admin can delete users
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin access required.' 
                });
            }

            // Prevent admin from deleting themselves
            if (req.user._id.toString() === id) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cannot delete your own account.' 
                });
            }

            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }

            await User.findByIdAndDelete(id);

            res.status(200).json({ 
                success: true, 
                message: 'User deleted successfully.' 
            });
        } catch (error) {
            next(error);
        }
    }

    // Toggle user status (admin only)
    static async toggleUserStatusController(req, res, next) {
        try {
            const { id } = req.params;

            // Only admin can toggle user status
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin access required.' 
                });
            }

            // Prevent admin from deactivating themselves
            if (req.user._id.toString() === id) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Cannot deactivate your own account.' 
                });
            }

            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found.' 
                });
            }

            user.isActive = !user.isActive;
            user.updatedAt = new Date();
            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(200).json({ 
                success: true, 
                data: { user: userResponse },
                message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`
            });
        } catch (error) {
            next(error);
        }
    }

    // Get users statistics (admin only)
    static async getUsersStatsController(req, res, next) {
        try {
            // Only admin can get statistics
            if (req.user.role !== 'admin') {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Admin access required.' 
                });
            }

            const stats = await User.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
                        },
                        admins: {
                            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                        },
                        managers: {
                            $sum: { $cond: [{ $eq: ['$role', 'manager'] }, 1, 0] }
                        },
                        staff: {
                            $sum: { $cond: [{ $eq: ['$role', 'staff'] }, 1, 0] }
                        }
                    }
                }
            ]);

            const result = stats[0] || {
                total: 0,
                active: 0,
                inactive: 0,
                admins: 0,
                managers: 0,
                staff: 0
            };

            res.status(200).json({ 
                success: true, 
                data: result 
            });
        } catch (error) {
            next(error);
        }
    }
}

