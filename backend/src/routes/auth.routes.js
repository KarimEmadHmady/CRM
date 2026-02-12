import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { UserController } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateCreateUser, validateUpdateUser, validateUserId } from "../middlewares/userValidation.js";

const router = express.Router();

// Public routes
router.post("/register", asyncHandler(AuthController.registerController));
router.post("/login", asyncHandler(AuthController.loginController));

// Protected routes
router.get("/profile", authenticateToken, asyncHandler(AuthController.getProfileController));
router.put("/profile", authenticateToken, asyncHandler(AuthController.updateProfileController));
router.put("/change-password", authenticateToken, asyncHandler(AuthController.changePasswordController));
router.post("/refresh-token", authenticateToken, asyncHandler(AuthController.refreshTokenController));

// User management routes (admin only for most operations)
router.get("/users", authenticateToken, asyncHandler(UserController.getAllUsersController));
router.get("/users/:id", authenticateToken,  asyncHandler(UserController.getUserByIdController));
router.post("/users", authenticateToken,  asyncHandler(UserController.createUserController));
router.put("/users/:id", authenticateToken,  asyncHandler(UserController.updateUserController)); // validateUpdateUser
router.delete("/users/:id", authenticateToken,  asyncHandler(UserController.deleteUserController));
router.patch("/users/:id/toggle-status", authenticateToken,  asyncHandler(UserController.toggleUserStatusController));
router.get("/users/stats", authenticateToken, asyncHandler(UserController.getUsersStatsController));

export default router;
