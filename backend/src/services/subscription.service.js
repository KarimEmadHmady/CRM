import { Subscription } from "../modles/subscription.model.js";
import { Customer } from "../modles/customer.model.js";
import { v4 as uuid } from "uuid";

export class SubscriptionService {

    static async createSubscriptionService({ customer, packageType, startDate, endDate, price, paymentMethod, autoRenew, notes }) {
        const id = uuid();
        const subscription = await Subscription.create({ 
            id, 
            customer, 
            packageType, 
            startDate, 
            endDate, 
            price, 
            paymentMethod, 
            autoRenew, 
            notes,
            nextPaymentDate: endDate
        });

        // Update customer status to subscribed
        await Customer.findByIdAndUpdate(customer, { status: 'subscribed' });
        
        return subscription;
    }

    static async getAllSubscriptionsService() {
        return await Subscription.find().populate('customer').sort({ createdAt: -1 });
    }

    static async getSubscriptionByIdService(id) {
        return await Subscription.findById(id).populate('customer');
    }

    static async updateSubscriptionService(id, { packageType, startDate, endDate, price, paymentStatus, autoRenew, notes, isActive }) {
        const updateData = { packageType, startDate, endDate, price, paymentStatus, autoRenew, notes, isActive };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        
        if (endDate) {
            updateData.nextPaymentDate = endDate;
        }
        
        return await Subscription.findByIdAndUpdate(id, updateData, { new: true }).populate('customer');
    }

    static async deleteSubscriptionService(id) {
        const subscription = await Subscription.findById(id);
        if (subscription) {
            // Update customer status back to interested
            await Customer.findByIdAndUpdate(subscription.customer, { status: 'interested' });
        }
        return await Subscription.findByIdAndDelete(id);
    }

    static async getSubscriptionsByCustomerService(customerId) {
        return await Subscription.find({ customer: customerId }).populate('customer').sort({ createdAt: -1 });
    }

    static async getActiveSubscriptionsService() {
        return await Subscription.find({ isActive: true }).populate('customer').sort({ endDate: 1 });
    }

    static async getExpiringSoonService(days = 5) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + days);
        
        return await Subscription.find({
            isActive: true,
            endDate: { $lte: futureDate, $gte: new Date() }
        }).populate('customer').sort({ endDate: 1 });
    }

    static async getExpiredSubscriptionsService() {
        return await Subscription.find({
            $or: [
                { endDate: { $lt: new Date() } },
                { isActive: false }
            ]
        }).populate('customer').sort({ endDate: -1 });
    }

    static async updatePaymentStatusService(id, paymentStatus, lastPaymentDate = new Date()) {
        const subscription = await Subscription.findById(id).populate('customer');
        
        if (!subscription) throw new Error('Subscription not found');

        // Update subscription fields
        subscription.paymentStatus = paymentStatus;
        subscription.lastPaymentDate = lastPaymentDate;

        // Save to trigger middleware
        await subscription.save();

        // Update customer status based on subscription
        const isExpired = subscription.endDate < new Date();
        if (isExpired && subscription.isActive) {
            await Customer.findByIdAndUpdate(subscription.customer._id, { status: 'expired' });
        } else if (!isExpired && paymentStatus === 'paid') {
            await Customer.findByIdAndUpdate(subscription.customer._id, { status: 'subscribed' });
        }

        return subscription;
    }

    static async renewSubscriptionService(id, newEndDate, price) {
        const subscription = await Subscription.findById(id);
        if (!subscription) throw new Error('Subscription not found');

        const updatedSubscription = await Subscription.findByIdAndUpdate(
            id,
            {
                endDate: newEndDate,
                nextPaymentDate: newEndDate,
                price: price || subscription.price,
                paymentStatus: 'pending',
                isActive: true
            },
            { new: true }
        ).populate('customer');

        // Update customer status
        await Customer.findByIdAndUpdate(subscription.customer, { status: 'subscribed' });

        return updatedSubscription;
    }

    static async getSubscriptionStatsService() {
        const activeCount = await Subscription.countDocuments({ isActive: true });
        const expiredCount = await Subscription.countDocuments({ 
            $or: [
                { endDate: { $lt: new Date() } },
                { isActive: false }
            ]
        });

        // Get expiring soon subscriptions (within 30 days)
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const expiringSoonCount = await Subscription.countDocuments({
            isActive: true,
            endDate: { $lte: futureDate, $gte: new Date() }
        });

        // Calculate total revenue from paid subscriptions
        const revenueStats = await Subscription.aggregate([
            {
                $match: { paymentStatus: 'paid' }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' }
                }
            }
        ]);

        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
        const totalCount = await Subscription.countDocuments();

        return {
            total: totalCount,
            active: activeCount,
            expired: expiredCount,
            expiringSoon: expiringSoonCount,
            totalRevenue: totalRevenue
        };
    }

    /**
     * ✅ Bulk delete subscriptions
     */
    static async bulkDeleteSubscriptionsService(subscriptionIds) {
        try {
            if (!Array.isArray(subscriptionIds) || subscriptionIds.length === 0) {
                throw new Error('Invalid subscription IDs array');
            }

            // Validate that all subscriptions exist (try both id and _id for backward compatibility)
            let existingSubscriptions = await Subscription.find({ id: { $in: subscriptionIds } });
            if (existingSubscriptions.length !== subscriptionIds.length) {
                // Try with _id if id didn't work
                const subscriptionsById = await Subscription.find({ _id: { $in: subscriptionIds } });
                existingSubscriptions = [...existingSubscriptions, ...subscriptionsById];
            }
            
            if (existingSubscriptions.length !== subscriptionIds.length) {
                throw new Error('Some subscriptions not found');
            }

            // Update customer status back to interested for each subscription being deleted
            const customerIds = existingSubscriptions.map(sub => sub.customer);
            await Customer.updateMany(
                { _id: { $in: customerIds } },
                { status: 'interested' }
            );

            // Delete subscriptions (try both id and _id)
            let result;
            const resultById = await Subscription.deleteMany({ id: { $in: subscriptionIds } });
            const resultBy_id = await Subscription.deleteMany({ _id: { $in: subscriptionIds } });
            
            result = {
                deletedCount: resultById.deletedCount + resultBy_id.deletedCount
            };
            
            console.log(`✅ Bulk deleted ${result.deletedCount} subscriptions`);
            return {
                success: true,
                deletedCount: result.deletedCount,
                message: `Successfully deleted ${result.deletedCount} subscriptions`
            };

        } catch (error) {
            console.error('❌ Error bulk deleting subscriptions:', error.message);
            throw error;
        }
    }

}
