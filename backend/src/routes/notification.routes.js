import express from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticateToken, requirePermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

router.post("/", requirePermission('notification_write'), asyncHandler(NotificationController.createNotificationController));
router.get("/", requirePermission('notification_read'), asyncHandler(NotificationController.getAllNotificationsController));
router.get("/stats", requirePermission('stats_view'), asyncHandler(NotificationController.getNotificationStatsController));
router.get("/pending", requirePermission('notification_read'), asyncHandler(NotificationController.getPendingNotificationsController));
router.post("/subscription-expiry", requirePermission('notification_write'), asyncHandler(NotificationController.createSubscriptionExpiryNotificationsController));
router.post("/payment-reminders", requirePermission('notification_write'), asyncHandler(NotificationController.createPaymentReminderNotificationsController));
router.get("/customer/:customerId", requirePermission('notification_read'), asyncHandler(NotificationController.getNotificationsByCustomerController));
router.post("/customer/:customerId/welcome", requirePermission('notification_write'), asyncHandler(NotificationController.createWelcomeNotificationController));
router.delete("/bulk", requirePermission('notification_delete'), asyncHandler(NotificationController.bulkDeleteNotificationsController));
router.get("/:id", requirePermission('notification_read'), asyncHandler(NotificationController.getNotificationByIdController));
router.put("/:id", requirePermission('notification_write'), asyncHandler(NotificationController.updateNotificationController));
router.post("/:id/send", requirePermission('notification_write'), asyncHandler(NotificationController.sendNotificationController));
router.delete("/:id", requirePermission('notification_delete'), asyncHandler(NotificationController.deleteNotificationController));

export default router;
