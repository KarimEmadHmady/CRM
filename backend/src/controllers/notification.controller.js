import { NotificationService } from "../services/notification.service.js";

export class NotificationController {

    static async createNotificationController(req, res, next) {
        try {
            const { customer, subscription, type, title, message, scheduledFor, channel, isAutomated, metadata } = req.body;
            const notification = await NotificationService.createNotificationService({ 
                customer, subscription, type, title, message, scheduledFor, channel, isAutomated, metadata 
            });
            res.status(201).json({ success: true, data: notification });
        } catch (error) {
            next(error);
        }
    }

    static async getAllNotificationsController(req, res, next) {
        try {
            const { status, customer, type } = req.query;
            let notifications;

            if (status === 'pending') {
                notifications = await NotificationService.getPendingNotificationsService();
            } else if (customer) {
                notifications = await NotificationService.getNotificationsByCustomerService(customer);
            } else {
                notifications = await NotificationService.getAllNotificationsService();
            }

            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    static async getNotificationByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.getNotificationByIdService(id);
            
            if (!notification) {
                return res.status(404).json({ success: false, message: "Notification not found" });
            }

            res.status(200).json({ success: true, data: notification });
        } catch (error) {
            next(error);
        }
    }

    static async updateNotificationController(req, res, next) {
        try {
            const { id } = req.params;
            const { title, message, status, scheduledFor, channel } = req.body;
            
            const updatedNotification = await NotificationService.updateNotificationService(id, { 
                title, message, status, scheduledFor, channel 
            });

            if (!updatedNotification) {
                return res.status(404).json({ success: false, message: "Notification not found" });
            }

            res.status(200).json({ success: true, data: updatedNotification });
        } catch (error) {
            next(error);
        }
    }

    static async deleteNotificationController(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.deleteNotificationService(id);
            
            if (!notification) {
                return res.status(404).json({ success: false, message: "Notification not found" });
            }

            res.status(200).json({ success: true, message: "Notification deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async getNotificationsByCustomerController(req, res, next) {
        try {
            const { customerId } = req.params;
            const notifications = await NotificationService.getNotificationsByCustomerService(customerId);
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    static async getPendingNotificationsController(req, res, next) {
        try {
            const notifications = await NotificationService.getPendingNotificationsService();
            res.status(200).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    static async sendNotificationController(req, res, next) {
        try {
            const { id } = req.params;
            const notification = await NotificationService.sendNotificationService(id);
            res.status(200).json({ success: true, data: notification });
        } catch (error) {
            next(error);
        }
    }

    static async createSubscriptionExpiryNotificationsController(req, res, next) {
        try {
            const { daysBefore = 5 } = req.body;
            const notifications = await NotificationService.createSubscriptionExpiryNotificationsService(daysBefore);
            res.status(201).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    static async createPaymentReminderNotificationsController(req, res, next) {
        try {
            const notifications = await NotificationService.createPaymentReminderNotificationsService();
            res.status(201).json({ success: true, data: notifications });
        } catch (error) {
            next(error);
        }
    }

    static async createWelcomeNotificationController(req, res, next) {
        try {
            const { customerId } = req.params;
            const notification = await NotificationService.createWelcomeNotificationService(customerId);
            res.status(201).json({ success: true, data: notification });
        } catch (error) {
            next(error);
        }
    }

    static async getNotificationStatsController(req, res, next) {
        try {
            const stats = await NotificationService.getNotificationStatsService();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async bulkDeleteNotificationsController(req, res, next) {
        try {
            const { notificationIds } = req.body;
            
            if (!notificationIds || !Array.isArray(notificationIds)) {
                return res.status(400).json({ 
                    success: false, 
                    message: "notificationIds array is required" 
                });
            }

            const result = await NotificationService.bulkDeleteNotificationsService(notificationIds);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

}
