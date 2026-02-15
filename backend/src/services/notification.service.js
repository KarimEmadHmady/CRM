import { Notification } from "../modles/notification.model.js";
import { Subscription } from "../modles/subscription.model.js";
import { Customer } from "../modles/customer.model.js";
import { EmailService } from "./email.service.js";
import { SubscriptionService } from "./subscription.service.js";
import { v4 as uuid } from "uuid";

export class NotificationService {

    /**
     * ✅ Create notification with validation
     */
    static async createNotificationService({ customer, subscription, type, title, message, scheduledFor, channel, isAutomated, metadata }) {
        try {
            // ✅ Validate customer exists
            if (customer) {
                const customerExists = await Customer.findById(customer);
                if (!customerExists) {
                    throw new Error('Customer not found');
                }
                if (!customerExists.email) {
                    console.warn(`⚠️ Customer ${customer} has no email address`);
                }
            }

            const id = uuid();
            const notification = await Notification.create({ 
                id, 
                customer, 
                subscription, 
                type, 
                title, 
                message, 
                scheduledFor, 
                channel, 
                isAutomated, 
                metadata 
            });

            console.log(`✅ Notification created: ${notification._id} (Type: ${type})`);
            return notification;

        } catch (error) {
            console.error('❌ Error creating notification:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Get all notifications
     */
    static async getAllNotificationsService() {
        try {
            return await Notification.find()
                .populate('customer')
                .populate('subscription')
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error('❌ Error getting all notifications:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Get notification by ID
     */
    static async getNotificationByIdService(id) {
        try {
            const notification = await Notification.findById(id)
                .populate('customer')
                .populate('subscription');
            
            if (!notification) {
                throw new Error('Notification not found');
            }

            return notification;
        } catch (error) {
            console.error('❌ Error getting notification:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Update notification
     */
    static async updateNotificationService(id, { title, message, status, scheduledFor, channel }) {
        try {
            const updateData = { title, message, status, scheduledFor, channel };
            Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
            
            const notification = await Notification.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true }
            ).populate('customer').populate('subscription');

            if (!notification) {
                throw new Error('Notification not found');
            }

            console.log(`✅ Notification updated: ${id}`);
            return notification;

        } catch (error) {
            console.error('❌ Error updating notification:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Delete notification
     */
    static async deleteNotificationService(id) {
        try {
            const notification = await Notification.findByIdAndDelete(id);
            
            if (!notification) {
                throw new Error('Notification not found');
            }

            console.log(`✅ Notification deleted: ${id}`);
            return notification;

        } catch (error) {
            console.error('❌ Error deleting notification:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Get notifications by customer
     */
    static async getNotificationsByCustomerService(customerId) {
        try {
            return await Notification.find({ customer: customerId })
                .populate('subscription')
                .sort({ createdAt: -1 });
        } catch (error) {
            console.error('❌ Error getting customer notifications:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Get pending notifications with NULL checks
     */
    static async getPendingNotificationsService() {
        try {
            const notifications = await Notification.find({ 
                status: 'pending',
                $or: [
                    { scheduledFor: { $lte: new Date() } },
                    { scheduledFor: null }
                ]
            })
            .populate('customer')
            .populate('subscription')
            .sort({ createdAt: 1 });

            // ✅ Filter out notifications with missing customer/email
            const validNotifications = notifications.filter(n => {
                if (!n.customer) {
                    console.warn(`⚠️ Notification ${n._id} has no customer - will be skipped`);
                    return false;
                }
                if (!n.customer.email) {
                    console.warn(`⚠️ Notification ${n._id} customer has no email - will be skipped`);
                    return false;
                }
                return true;
            });

            console.log(`📦 Found ${validNotifications.length} valid pending notifications (filtered from ${notifications.length})`);
            return validNotifications;

        } catch (error) {
            console.error('❌ Error getting pending notifications:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Send notification with NULL checks
     */
    static async sendNotificationService(notificationId) {
        try {
            const notification = await Notification.findById(notificationId)
                .populate('customer')
                .populate('subscription');
            
            if (!notification) {
                throw new Error('Notification not found');
            }

            // ✅ NULL CHECKS
            if (!notification.customer) {
                throw new Error('Notification has no customer');
            }

            if (!notification.customer.email) {
                throw new Error('Customer has no email address');
            }

            let sent = false;
            
            // Send email if channel is email or all
            if (notification.channel === 'email' || notification.channel === 'all') {
                await EmailService.sendEmail({
                    to: notification.customer.email,
                    subject: notification.title,
                    text: notification.message,
                    template: notification.type,
                    metadata: notification.metadata
                });
                sent = true;
                console.log(`✅ Email sent to ${notification.customer.email}`);
            }

            // Update notification status
            const updatedNotification = await Notification.findByIdAndUpdate(
                notificationId,
                {
                    status: sent ? 'sent' : 'failed',
                    sentAt: new Date(),
                    deliveryAttempts: (notification.deliveryAttempts || 0) + 1
                },
                { new: true }
            ).populate('customer').populate('subscription');

            return updatedNotification;

        } catch (error) {
            console.error(`❌ Error sending notification ${notificationId}:`, error.message);
            
            // Update delivery attempts on failure
            try {
                await Notification.findByIdAndUpdate(
                    notificationId,
                    {
                        status: 'failed',
                        $inc: { deliveryAttempts: 1 }
                    }
                );
            } catch (updateError) {
                console.error('Failed to update notification status:', updateError.message);
            }

            throw error;
        }
    }

    /**
     * ✅ Create subscription expiry notifications with NULL checks
     */
    static async createSubscriptionExpiryNotificationsService(daysBefore = 5) {
        try {
            const expiringSubscriptions = await SubscriptionService.getExpiringSoonService(daysBefore);
            
            if (!expiringSubscriptions || expiringSubscriptions.length === 0) {
                console.log('ℹ️ No subscriptions expiring soon');
                return { created: 0, skipped: 0, notifications: [] };
            }

            const notifications = [];
            let created = 0;
            let skipped = 0;

            for (const subscription of expiringSubscriptions) {
                try {
                    // ✅ NULL CHECKS
                    if (!subscription.customer) {
                        console.warn(`⚠️ Subscription ${subscription._id} has no customer - SKIPPING`);
                        skipped++;
                        continue;
                    }

                    if (!subscription.customer.email) {
                        console.warn(`⚠️ Customer ${subscription.customer._id} has no email - SKIPPING`);
                        skipped++;
                        continue;
                    }

                    // Check if notification already exists
                    const existingNotification = await Notification.findOne({
                        customer: subscription.customer._id,
                        subscription: subscription._id,
                        type: 'subscription_expiry',
                        status: { $in: ['pending', 'sent'] }
                    });

                    if (existingNotification) {
                        console.log(`ℹ️ Notification already exists for subscription ${subscription._id}`);
                        skipped++;
                        continue;
                    }

                    // Create notification
                    const notification = await this.createNotificationService({
                        customer: subscription.customer._id,
                        subscription: subscription._id,
                        type: 'subscription_expiry',
                        title: 'تنبيه انتهاء الاشتراك / Subscription Expiring Soon',
                        message: `عزيزي ${subscription.customer.name}، اشتراكك سينتهي في تاريخ ${subscription.endDate.toLocaleDateString()}. يرجى التجديد لمواصلة الاستمتاع بخدماتنا.\n\nDear ${subscription.customer.name}, your subscription will expire on ${subscription.endDate.toLocaleDateString()}. Please renew to continue enjoying our services.`,
                        scheduledFor: new Date(),
                        channel: 'email',
                        isAutomated: true,
                        metadata: { daysUntilExpiry: subscription.daysUntilExpiry }
                    });

                    notifications.push(notification);
                    created++;
                    console.log(`✅ Expiry notification created for ${subscription.customer.email}`);

                } catch (error) {
                    console.error(`❌ Error creating notification for subscription ${subscription._id}:`, error.message);
                    skipped++;
                }
            }

            console.log(`📊 Expiry Notifications Summary: Created ${created}, Skipped ${skipped}`);
            return { created, skipped, notifications };

        } catch (error) {
            console.error('❌ Error in createSubscriptionExpiryNotificationsService:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Create payment reminder notifications with NULL checks
     */
    static async createPaymentReminderNotificationsService() {
        try {
            const overdueSubscriptions = await Subscription.find({
                paymentStatus: 'pending',
                isActive: true,
                endDate: { $gte: new Date() }
            }).populate('customer');

            if (!overdueSubscriptions || overdueSubscriptions.length === 0) {
                console.log('ℹ️ No payment reminders needed');
                return { created: 0, skipped: 0, notifications: [] };
            }

            const notifications = [];
            let created = 0;
            let skipped = 0;

            for (const subscription of overdueSubscriptions) {
                try {
                    // ✅ NULL CHECKS
                    if (!subscription.customer) {
                        console.warn(`⚠️ Subscription ${subscription._id} has no customer - SKIPPING`);
                        skipped++;
                        continue;
                    }

                    if (!subscription.customer.email) {
                        console.warn(`⚠️ Customer ${subscription.customer._id} has no email - SKIPPING`);
                        skipped++;
                        continue;
                    }

                    // Check if reminder already sent in the last 7 days
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                    const existingNotification = await Notification.findOne({
                        customer: subscription.customer._id,
                        subscription: subscription._id,
                        type: 'payment_reminder',
                        status: 'sent',
                        sentAt: { $gte: sevenDaysAgo }
                    });

                    if (existingNotification) {
                        console.log(`ℹ️ Payment reminder already sent recently for subscription ${subscription._id}`);
                        skipped++;
                        continue;
                    }

                    // Create notification
                    const notification = await this.createNotificationService({
                        customer: subscription.customer._id,
                        subscription: subscription._id,
                        type: 'payment_reminder',
                        title: 'تذكير بالدفع / Payment Reminder',
                        message: `عزيزي ${subscription.customer.name}، هذا تذكير بأن دفع اشتراكك معلق. يرجى إكمال الدفع لتجنب انقطاع الخدمة.\n\nDear ${subscription.customer.name}, this is a reminder that your subscription payment is pending. Please complete your payment to avoid service interruption.`,
                        scheduledFor: new Date(),
                        channel: 'email',
                        isAutomated: true,
                        metadata: { 
                            amount: subscription.price, 
                            dueDate: subscription.nextPaymentDate 
                        }
                    });

                    notifications.push(notification);
                    created++;
                    console.log(`✅ Payment reminder created for ${subscription.customer.email}`);

                } catch (error) {
                    console.error(`❌ Error creating payment reminder:`, error.message);
                    skipped++;
                }
            }

            console.log(`📊 Payment Reminders Summary: Created ${created}, Skipped ${skipped}`);
            return { created, skipped, notifications };

        } catch (error) {
            console.error('❌ Error in createPaymentReminderNotificationsService:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Create and send welcome notification immediately with NULL checks
     */
    static async createWelcomeNotificationService(customerId) {
        try {
            const customer = await Customer.findById(customerId);
            
            if (!customer) {
                throw new Error('Customer not found');
            }

            if (!customer.email) {
                throw new Error('Customer has no email address');
            }

            // Generate category-specific content
            let categorySpecificContent = '';
            let categorySpecificImage = '';
            let categorySpecificLink = '';

            if (customer.category === 'gym') {
                categorySpecificContent = 'نحن متحمسون لمساعدتك في تحقيق أهدافك اللياقية! يقدم نادينا معدات حديثة ومدربين محترفين لدعم رحلتك.\n\nWe\'re excited to help you achieve your fitness goals! Our gym offers state-of-the-art equipment and professional trainers to support your journey.';
                categorySpecificImage = 'https://gymcore-system.netlify.app/234345555.jpg';
                categorySpecificLink = 'https://gymcore-system.netlify.app';
            } else if (customer.category === 'restaurant') {
                categorySpecificContent = 'يسرنا أن نرحب بك في عائلتنا الطهوية! استمتع بأطباق رائعة وخدمة استثنائية في أجواء أنيقة.\n\nWe\'re delighted to welcome you to our culinary family! Experience exquisite dishes and exceptional service in an elegant atmosphere.';
                categorySpecificImage = 'https://qrx-menu.vercel.app/1.PNG';
                categorySpecificLink = 'https://qrx-menu.vercel.app';
            } else {
                categorySpecificContent = 'نحن سعداء بانضمامك إلى مجتمعنا! نتطلع إلى تزويدك بخدمة ودعم ممتازين.\n\nWe\'re thrilled to have you join our community! We look forward to providing you with excellent service and support.';
                categorySpecificImage = 'https://gymcore-system.netlify.app/234345555.jpg';
                categorySpecificLink = 'https://gymcore-system.netlify.app';
            }

            const message = `عزيزي ${customer.name}، مرحباً بك في خدمتنا! ${categorySpecificContent} إذا كان لديك أي أسئلة، فلا تتردد في التواصل معنا.\n\nDear ${customer.name}, welcome to our service! ${categorySpecificContent} If you have any questions, please don't hesitate to reach out.`;

            // Create notification record
            const notification = await this.createNotificationService({
                customer: customerId,
                type: 'welcome',
                title: 'مرحباً بك في خدمتنا! / Welcome to our Service!',
                message: message,
                scheduledFor: new Date(),
                channel: 'email',
                isAutomated: true,
                metadata: { 
                    category: customer.category,
                    categorySpecificContent,
                    categorySpecificImage,
                    categorySpecificLink
                }
            });

            // ✅ Send welcome email IMMEDIATELY
            try {
                await EmailService.sendEmail({
                    to: customer.email,
                    subject: 'مرحباً بك في خدمتنا! / Welcome to our Service!',
                    text: message,
                    template: 'welcome',
                    metadata: notification.metadata
                });

                // Update notification status to sent
                await Notification.findByIdAndUpdate(notification._id, {
                    status: 'sent',
                    sentAt: new Date()
                });

                console.log(`✅ Welcome email sent immediately to ${customer.email}`);

            } catch (emailError) {
                console.error(`❌ Failed to send welcome email to ${customer.email}:`, emailError.message);
                
                // Update notification status to failed
                await Notification.findByIdAndUpdate(notification._id, {
                    status: 'failed'
                });

                throw emailError;
            }
            
            return notification;

        } catch (error) {
            console.error('❌ Error in createWelcomeNotificationService:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Get notification statistics
     */
    static async getNotificationStatsService() {
        try {
            const stats = await Notification.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const typeStats = await Notification.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const totalNotifications = await Notification.countDocuments();
            const pendingCount = await Notification.countDocuments({ status: 'pending' });
            const sentCount = await Notification.countDocuments({ status: 'sent' });
            const deliveredCount = await Notification.countDocuments({ status: 'delivered' });
            const failedCount = await Notification.countDocuments({ status: 'failed' });

            return {
                total: totalNotifications,
                pending: pendingCount,
                sent: sentCount,
                delivered: deliveredCount,
                failed: failedCount,
                statusStats: stats,
                typeStats: typeStats
            };

        } catch (error) {
            console.error('❌ Error getting notification stats:', error.message);
            throw error;
        }
    }

    /**
     * ✅ Bulk delete notifications
     */
    static async bulkDeleteNotificationsService(notificationIds) {
        try {
            if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
                throw new Error('Invalid notification IDs array');
            }

            // Validate that all notifications exist (try both id and _id for backward compatibility)
            let existingNotifications = await Notification.find({ id: { $in: notificationIds } });
            if (existingNotifications.length !== notificationIds.length) {
                // Try with _id if id didn't work
                const notificationsById = await Notification.find({ _id: { $in: notificationIds } });
                existingNotifications = [...existingNotifications, ...notificationsById];
            }
            
            if (existingNotifications.length !== notificationIds.length) {
                throw new Error('Some notifications not found');
            }

            // Delete notifications (try both id and _id)
            let result;
            const resultById = await Notification.deleteMany({ id: { $in: notificationIds } });
            const resultBy_id = await Notification.deleteMany({ _id: { $in: notificationIds } });
            
            result = {
                deletedCount: resultById.deletedCount + resultBy_id.deletedCount
            };
            
            console.log(`✅ Bulk deleted ${result.deletedCount} notifications`);
            return {
                success: true,
                deletedCount: result.deletedCount,
                message: `Successfully deleted ${result.deletedCount} notifications`
            };

        } catch (error) {
            console.error('❌ Error bulk deleting notifications:', error.message);
            throw error;
        }
    }

}