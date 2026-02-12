import cron from 'node-cron';
import { NotificationService } from './notification.service.js';
import { EmailService } from './email.service.js';

export class CronService {

    static initializeCronJobs() {
        console.log('🚀 Initializing cron jobs...');

        // ============================================
        // 1. Daily at 9:00 AM - Check subscription expirations
        // ============================================
        cron.schedule('0 9 * * *', async () => {
            console.log('⏰ [CRON] Running daily subscription expiry check...');
            try {
                const result = await NotificationService.createSubscriptionExpiryNotificationsService();
                console.log(`✅ [CRON] Created ${result?.created || 0} subscription expiry notifications`);
            } catch (error) {
                console.error('❌ [CRON] Error creating subscription expiry notifications:', error.message);
            }
        });

        // ============================================
        // 2. Every Monday at 10:00 AM - Payment reminders
        // ============================================
        cron.schedule('0 10 * * 1', async () => {
            console.log('⏰ [CRON] Running weekly payment reminder check...');
            try {
                const result = await NotificationService.createPaymentReminderNotificationsService();
                console.log(`✅ [CRON] Created ${result?.created || 0} payment reminder notifications`);
            } catch (error) {
                console.error('❌ [CRON] Error creating payment reminder notifications:', error.message);
            }
        });

        // ============================================
        // 3. Every hour - Process pending notifications with NULL checks
        // ============================================
        cron.schedule('0 * * * *', async () => {
            console.log('⏰ [CRON] Processing pending notifications...');
            try {
                const pendingNotifications = await NotificationService.getPendingNotificationsService();
                
                if (!pendingNotifications || pendingNotifications.length === 0) {
                    console.log('ℹ️ [CRON] No pending notifications to process');
                    return;
                }

                let successCount = 0;
                let failCount = 0;
                let skippedCount = 0;

                for (const notification of pendingNotifications) {
                    try {
                        // ✅ NULL CHECKS - Critical for preventing crashes
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

                        // ✅ Try to send the notification
                        await NotificationService.sendNotificationService(notification._id);
                        console.log(`✅ [CRON] Notification sent to ${notification.customer.email}`);
                        successCount++;

                    } catch (error) {
                        console.error(`❌ [CRON] Failed to send notification to ${notification.customer?.email || 'unknown'}:`, error.message);
                        failCount++;
                    }
                }
                
                console.log(`📊 [CRON] Notification Processing Summary:`);
                console.log(`   ✅ Success: ${successCount}`);
                console.log(`   ❌ Failed: ${failCount}`);
                console.log(`   ⚠️ Skipped: ${skippedCount}`);
                console.log(`   📦 Total: ${pendingNotifications.length}`);

            } catch (error) {
                console.error('❌ [CRON] Error processing pending notifications:', error.message);
            }
        });

        // ============================================
        // 4. Daily at 8:00 AM - Launch scheduled email campaigns
        // ============================================
        cron.schedule('0 8 * * *', async () => {
            console.log('⏰ [CRON] Checking scheduled email campaigns...');
            try {
                const { EmailCampaign } = await import('../modles/emailCampaign.model.js');
                
                const scheduledCampaigns = await EmailCampaign.find({
                    status: 'scheduled',
                    scheduledFor: { $lte: new Date() }
                });

                if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
                    console.log('ℹ️ [CRON] No scheduled campaigns to launch');
                    return;
                }

                let successCount = 0;
                let failCount = 0;

                for (const campaign of scheduledCampaigns) {
                    try {
                        await EmailService.launchEmailCampaignService(campaign._id);
                        console.log(`✅ [CRON] Email campaign "${campaign.name}" launched successfully`);
                        successCount++;
                    } catch (error) {
                        console.error(`❌ [CRON] Failed to launch campaign "${campaign.name}":`, error.message);
                        failCount++;
                    }
                }
                
                console.log(`📊 [CRON] Campaign Launch Summary:`);
                console.log(`   ✅ Success: ${successCount}`);
                console.log(`   ❌ Failed: ${failCount}`);
                console.log(`   📦 Total: ${scheduledCampaigns.length}`);

            } catch (error) {
                console.error('❌ [CRON] Error processing scheduled campaigns:', error.message);
            }
        });

        console.log('✅ Cron jobs initialized successfully');
        console.log('📅 Schedule:');
        console.log('   - Subscription expiry check: Daily at 9:00 AM');
        console.log('   - Payment reminders: Every Monday at 10:00 AM');
        console.log('   - Process notifications: Every hour');
        console.log('   - Launch campaigns: Daily at 8:00 AM');
    }

    /**
     * Stop all running cron jobs
     */
    static stopAllCronJobs() {
        try {
            const tasks = cron.getTasks();
            let count = 0;
            
            tasks.forEach(task => {
                task.stop();
                count++;
            });
            
            console.log(`🛑 Stopped ${count} cron jobs`);
        } catch (error) {
            console.error('❌ Error stopping cron jobs:', error.message);
        }
    }

    /**
     * Manually trigger subscription expiry check (for testing)
     */
    static async triggerSubscriptionExpiryCheck() {
        console.log('🔧 [MANUAL] Triggering subscription expiry check...');
        try {
            const result = await NotificationService.createSubscriptionExpiryNotificationsService();
            console.log(`✅ [MANUAL] Created ${result?.created || 0} notifications`);
            return result;
        } catch (error) {
            console.error('❌ [MANUAL] Error:', error.message);
            throw error;
        }
    }

    /**
     * Manually trigger payment reminder check (for testing)
     */
    static async triggerPaymentReminderCheck() {
        console.log('🔧 [MANUAL] Triggering payment reminder check...');
        try {
            const result = await NotificationService.createPaymentReminderNotificationsService();
            console.log(`✅ [MANUAL] Created ${result?.created || 0} notifications`);
            return result;
        } catch (error) {
            console.error('❌ [MANUAL] Error:', error.message);
            throw error;
        }
    }

    /**
     * Manually process pending notifications (for testing)
     */
    static async triggerNotificationProcessing() {
        console.log('🔧 [MANUAL] Processing pending notifications...');
        try {
            const pendingNotifications = await NotificationService.getPendingNotificationsService();
            
            if (!pendingNotifications || pendingNotifications.length === 0) {
                console.log('ℹ️ [MANUAL] No pending notifications');
                return { success: 0, failed: 0, skipped: 0 };
            }

            let successCount = 0;
            let failCount = 0;
            let skippedCount = 0;

            for (const notification of pendingNotifications) {
                try {
                    if (!notification.customer?.email) {
                        skippedCount++;
                        continue;
                    }

                    await NotificationService.sendNotificationService(notification._id);
                    successCount++;
                } catch (error) {
                    failCount++;
                }
            }

            const result = { 
                success: successCount, 
                failed: failCount, 
                skipped: skippedCount,
                total: pendingNotifications.length 
            };

            console.log(`✅ [MANUAL] Processed notifications:`, result);
            return result;

        } catch (error) {
            console.error('❌ [MANUAL] Error:', error.message);
            throw error;
        }
    }

}