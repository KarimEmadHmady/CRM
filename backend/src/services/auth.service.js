import jwt from "jsonwebtoken";
import { User } from "../modles/user.model.js";

export class AuthService {

    static generateToken(userId) {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
    }

    static async registerService({ username, email, password }) {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }

        // Public self-registration always creates a 'staff' account with default
        // permissions. Role/permissions can only be elevated by an existing admin
        // via POST /api/auth/users (UserController.createUserController).
        const defaultPermissions = [
            'customer_read', 'customer_write',
            'subscription_read',
            'notification_read',
            'stats_view'
        ];

        const user = await User.create({
            username,
            email,
            password,
            role: 'staff',
            permissions: defaultPermissions
        });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return {
            user: userResponse,
            token: this.generateToken(user._id)
        };
    }

    static async loginService({ email, password }) {
        // Find user by email
        const user = await User.findOne({ email, isActive: true });
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return {
            user: userResponse,
            token: this.generateToken(user._id)
        };
    }

    static async verifyTokenService(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user || !user.isActive) {
                throw new Error('User not found or inactive');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static async changePasswordService(userId, { currentPassword, newPassword }) {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
        
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        return { message: 'Password changed successfully' };
    }

    static async updateProfileService(userId, { username, email }) {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new Error('User not found');
        }

        // Check if username or email is already taken by another user
        if (username !== user.username) {
            const existingUser = await User.findOne({ username, _id: { $ne: userId } });
            if (existingUser) {
                throw new Error('Username already taken');
            }
        }

        if (email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                throw new Error('Email already taken');
            }
        }

        user.username = username;
        user.email = email;
        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    }

}
