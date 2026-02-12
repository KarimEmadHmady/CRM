import { SubscriptionService } from "../services/subscription.service.js";

export class SubscriptionController {

    static async createSubscriptionController(req, res, next) {
        try {
            const { customer, packageType, startDate, endDate, price, paymentMethod, autoRenew, notes } = req.body;
            const subscription = await SubscriptionService.createSubscriptionService({ 
                customer, packageType, startDate, endDate, price, paymentMethod, autoRenew, notes 
            });
            res.status(201).json({ success: true, data: subscription });
        } catch (error) {
            next(error);
        }
    }

    static async getAllSubscriptionsController(req, res, next) {
        try {
            const { status, customer } = req.query;
            let subscriptions;

            if (status === 'active') {
                subscriptions = await SubscriptionService.getActiveSubscriptionsService();
            } else if (status === 'expired') {
                subscriptions = await SubscriptionService.getExpiredSubscriptionsService();
            } else if (customer) {
                subscriptions = await SubscriptionService.getSubscriptionsByCustomerService(customer);
            } else {
                subscriptions = await SubscriptionService.getAllSubscriptionsService();
            }

            res.status(200).json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    static async getSubscriptionByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const subscription = await SubscriptionService.getSubscriptionByIdService(id);
            
            if (!subscription) {
                return res.status(404).json({ success: false, message: "Subscription not found" });
            }

            res.status(200).json({ success: true, data: subscription });
        } catch (error) {
            next(error);
        }
    }

    static async updateSubscriptionController(req, res, next) {
        try {
            const { id } = req.params;
            const { packageType, startDate, endDate, price, paymentStatus, autoRenew, notes, isActive } = req.body;
            
            const updatedSubscription = await SubscriptionService.updateSubscriptionService(id, { 
                packageType, startDate, endDate, price, paymentStatus, autoRenew, notes, isActive 
            });

            if (!updatedSubscription) {
                return res.status(404).json({ success: false, message: "Subscription not found" });
            }

            res.status(200).json({ success: true, data: updatedSubscription });
        } catch (error) {
            next(error);
        }
    }

    static async deleteSubscriptionController(req, res, next) {
        try {
            const { id } = req.params;
            const subscription = await SubscriptionService.deleteSubscriptionService(id);
            
            if (!subscription) {
                return res.status(404).json({ success: false, message: "Subscription not found" });
            }

            res.status(200).json({ success: true, message: "Subscription deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async getSubscriptionsByCustomerController(req, res, next) {
        try {
            const { customerId } = req.params;
            const subscriptions = await SubscriptionService.getSubscriptionsByCustomerService(customerId);
            res.status(200).json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    static async getActiveSubscriptionsController(req, res, next) {
        try {
            const subscriptions = await SubscriptionService.getActiveSubscriptionsService();
            res.status(200).json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    static async getExpiringSoonController(req, res, next) {
        try {
            const { days } = req.query;
            const subscriptions = await SubscriptionService.getExpiringSoonService(parseInt(days) || 5);
            res.status(200).json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    static async getExpiredSubscriptionsController(req, res, next) {
        try {
            const subscriptions = await SubscriptionService.getExpiredSubscriptionsService();
            res.status(200).json({ success: true, data: subscriptions });
        } catch (error) {
            next(error);
        }
    }

    static async updatePaymentStatusController(req, res, next) {
        try {
            const { id } = req.params;
            const { paymentStatus, lastPaymentDate } = req.body;
            
            const updatedSubscription = await SubscriptionService.updatePaymentStatusService(id, paymentStatus, lastPaymentDate);
            
            if (!updatedSubscription) {
                return res.status(404).json({ success: false, message: "Subscription not found" });
            }

            res.status(200).json({ success: true, data: updatedSubscription });
        } catch (error) {
            next(error);
        }
    }

    static async renewSubscriptionController(req, res, next) {
        try {
            const { id } = req.params;
            const { newEndDate, price } = req.body;
            
            const renewedSubscription = await SubscriptionService.renewSubscriptionService(id, newEndDate, price);
            
            if (!renewedSubscription) {
                return res.status(404).json({ success: false, message: "Subscription not found" });
            }

            res.status(200).json({ success: true, data: renewedSubscription });
        } catch (error) {
            next(error);
        }
    }

    static async getSubscriptionStatsController(req, res, next) {
        try {
            const stats = await SubscriptionService.getSubscriptionStatsService();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

}
