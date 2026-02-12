import { AuthService } from "../services/auth.service.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Access token required" 
            });
        }

        const user = await AuthService.verifyTokenService(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: error.message || "Invalid token" 
        });
    }
};

export const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        if (!req.user.permissions.includes(permission)) {
            return res.status(403).json({ 
                success: false, 
                message: "Insufficient permissions" 
            });
        }

        next();
    };
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        if (req.user.role !== role) {
            return res.status(403).json({ 
                success: false, 
                message: `${role} role required` 
            });
        }

        next();
    };
};

export const requireAnyRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication required" 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `One of these roles required: ${roles.join(', ')}` 
            });
        }

        next();
    };
};
