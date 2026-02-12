import express from "express";
import { CustomerController } from "../controllers/customer.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticateToken, requirePermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All customer routes require authentication
router.use(authenticateToken);

router.post("/", requirePermission('customer_write'), asyncHandler(CustomerController.createCustomerController));
router.get("/", requirePermission('customer_read'), asyncHandler(CustomerController.getAllCustomersController));
router.get("/search", requirePermission('customer_read'), asyncHandler(CustomerController.searchCustomersController));
router.get("/stats", requirePermission('stats_view'), asyncHandler(CustomerController.getCustomerStatsController));
router.get("/category/:category", requirePermission('customer_read'), asyncHandler(CustomerController.getCustomersByCategoryController));
router.get("/status/:status", requirePermission('customer_read'), asyncHandler(CustomerController.getCustomersByStatusController));
router.get("/:id", requirePermission('customer_read'), asyncHandler(CustomerController.getCustomerByIdController));
router.put("/:id", requirePermission('customer_write'), asyncHandler(CustomerController.updateCustomerController));
router.patch("/:id/status", requirePermission('customer_write'), asyncHandler(CustomerController.updateCustomerStatusController));
router.delete("/:id", requirePermission('customer_delete'), asyncHandler(CustomerController.deleteCustomerController));

export default router;
