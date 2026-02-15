import express from "express";
import { connectDB } from "../config/db.js";
import { NotificationService } from "../services/notification.service.js";
import { EmailService } from "../services/email.service.js";

const router = express.Router();

// ============================================
// Security: Verify requests from Vercel Cron
// ============================================
const verifyCronSecret = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (process.env.CRON_SECRET) {
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            console.error('❌ Unauthorized cron request');
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    
    next();
};

router.use(verifyCronSecret);

// ============================================
// 1. Daily at 9:00 AM - Check subscription expirations
// ============================================
router.get("/subscription-expiry-check", async (req, res) => {
    console.log('⏰ [CRON] Running subscription expiry check...');
    
    try {
        await connectDB();
        
        const result = await NotificationService.createSubscriptionExpiryNotificationsService();
        
        console.log(`✅ [CRON] Created ${result?.created || 0} subscription expiry notifications`);
        
        return res.status(200).json({
            success: true,
            message: 'Subscription expiry check completed',
            created: result?.created || 0
        });
        
    } catch (error) {
        console.error('❌ [CRON] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// 2. Every Monday at 10:00 AM - Payment reminders
// ============================================
router.get("/payment-reminders", async (req, res) => {
    console.log('⏰ [CRON] Running payment reminder check...');
    
    try {
        await connectDB();
        
        const result = await NotificationService.createPaymentReminderNotificationsService();
        
        console.log(`✅ [CRON] Created ${result?.created || 0} payment reminder notifications`);
        
        return res.status(200).json({
            success: true,
            message: 'Payment reminder check completed',
            created: result?.created || 0
        });
        
    } catch (error) {
        console.error('❌ [CRON] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// 3. Every hour - Process pending notifications
// ============================================
router.get("/process-notifications", async (req, res) => {
    console.log('⏰ [CRON] Processing pending notifications...');
    
    try {
        await connectDB();
        
        const pendingNotifications = await NotificationService.getPendingNotificationsService();
        
        if (!pendingNotifications || pendingNotifications.length === 0) {
            console.log('ℹ️ [CRON] No pending notifications to process');
            return res.status(200).json({
                success: true,
                message: 'No pending notifications',
                stats: { success: 0, failed: 0, skipped: 0, total: 0 }
            });
        }

        let successCount = 0;
        let failCount = 0;
        let skippedCount = 0;

        for (const notification of pendingNotifications) {
            try {
                // NULL CHECKS
                if (!notification.customer) {
                    console.warn(`⚠️ [CRON] Notification ${notification._id} has no customer - SKIPPING`);
                    skippedCount++;
                    continue;
                }

                if (!notification.customer.email) {
                    console.warn(`⚠️ [CRON] Customer ${notification.customer._id} has no email - SKIPPING`);
                    skippedCount++;
                    continue;
                }

                await NotificationService.sendNotificationService(notification._id);
                console.log(`✅ [CRON] Notification sent to ${notification.customer.email}`);
                successCount++;

            } catch (error) {
                console.error(`❌ [CRON] Failed to send notification:`, error.message);
                failCount++;
            }
        }
        
        const stats = {
            success: successCount,
            failed: failCount,
            skipped: skippedCount,
            total: pendingNotifications.length
        };

        console.log(`📊 [CRON] Notification Processing Summary:`, stats);
        
        return res.status(200).json({
            success: true,
            message: 'Notification processing completed',
            stats
        });

    } catch (error) {
        console.error('❌ [CRON] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// 4. Daily at 8:00 AM - Launch scheduled campaigns
// ============================================
router.get("/launch-campaigns", async (req, res) => {
    console.log('⏰ [CRON] Checking scheduled email campaigns...');
    
    try {
        await connectDB();
        
        const { EmailCampaign } = await import('../modles/emailCampaign.model.js');
        
        const scheduledCampaigns = await EmailCampaign.find({
            status: 'scheduled',
            scheduledFor: { $lte: new Date() }
        });

        if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
            console.log('ℹ️ [CRON] No scheduled campaigns to launch');
            return res.status(200).json({
                success: true,
                message: 'No scheduled campaigns',
                stats: { success: 0, failed: 0, total: 0 }
            });
        }

        let successCount = 0;
        let failCount = 0;

        for (const campaign of scheduledCampaigns) {
            try {
                await EmailService.launchEmailCampaignService(campaign._id);
                console.log(`✅ [CRON] Campaign "${campaign.name}" launched`);
                successCount++;
            } catch (error) {
                console.error(`❌ [CRON] Failed to launch "${campaign.name}":`, error.message);
                failCount++;
            }
        }
        
        const stats = {
            success: successCount,
            failed: failCount,
            total: scheduledCampaigns.length
        };

        console.log(`📊 [CRON] Campaign Launch Summary:`, stats);
        
        return res.status(200).json({
            success: true,
            message: 'Campaign launch completed',
            stats
        });

    } catch (error) {
        console.error('❌ [CRON] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ============================================
// Manual triggers (للتجربة)
// ============================================
router.post("/trigger/subscription-expiry", async (req, res) => {
    console.log('🔧 [MANUAL] Triggering subscription expiry check...');
    try {
        await connectDB();
        const result = await NotificationService.createSubscriptionExpiryNotificationsService();
        return res.status(200).json({ success: true, created: result?.created || 0 });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/trigger/payment-reminders", async (req, res) => {
    console.log('🔧 [MANUAL] Triggering payment reminders...');
    try {
        await connectDB();
        const result = await NotificationService.createPaymentReminderNotificationsService();
        return res.status(200).json({ success: true, created: result?.created || 0 });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;