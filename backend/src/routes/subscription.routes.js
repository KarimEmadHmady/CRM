import express from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticateToken, requirePermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All subscription routes require authentication
router.use(authenticateToken);

router.post("/", requirePermission('subscription_write'), asyncHandler(SubscriptionController.createSubscriptionController));
router.get("/", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getAllSubscriptionsController));
router.get("/stats", requirePermission('stats_view'), asyncHandler(SubscriptionController.getSubscriptionStatsController));
router.get("/active", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getActiveSubscriptionsController));
router.get("/expiring-soon", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getExpiringSoonController));
router.get("/expired", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getExpiredSubscriptionsController));
router.get("/customer/:customerId", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getSubscriptionsByCustomerController));
router.get("/:id", requirePermission('subscription_read'), asyncHandler(SubscriptionController.getSubscriptionByIdController));
router.put("/:id", requirePermission('subscription_write'), asyncHandler(SubscriptionController.updateSubscriptionController));
router.patch("/:id/payment-status", requirePermission('subscription_write'), asyncHandler(SubscriptionController.updatePaymentStatusController));
router.post("/:id/renew", requirePermission('subscription_write'), asyncHandler(SubscriptionController.renewSubscriptionController));
router.delete("/:id", requirePermission('subscription_delete'), asyncHandler(SubscriptionController.deleteSubscriptionController));

export default router;
