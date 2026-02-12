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
        const subscription = await Subscription.findByIdAndUpdate(
            id, 
            { paymentStatus, lastPaymentDate }, 
            { new: true }
        ).populate('customer');

        // Update customer status based on subscription
        if (subscription) {
            const isExpired = subscription.endDate < new Date();
            if (isExpired && subscription.isActive) {
                await Customer.findByIdAndUpdate(subscription.customer._id, { status: 'expired' });
            } else if (!isExpired && paymentStatus === 'paid') {
                await Customer.findByIdAndUpdate(subscription.customer._id, { status: 'subscribed' });
            }
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
        const stats = await Subscription.aggregate([
            {
                $group: {
                    _id: '$paymentStatus',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$price' }
                }
            }
        ]);

        const packageStats = await Subscription.aggregate([
            {
                $group: {
                    _id: '$packageType',
                    count: { $sum: 1 }
                }
            }
        ]);

        const activeCount = await Subscription.countDocuments({ isActive: true });
        const expiredCount = await Subscription.countDocuments({ 
            $or: [
                { endDate: { $lt: new Date() } },
                { isActive: false }
            ]
        });

        return {
            paymentStats: stats,
            packageStats: packageStats,
            activeCount,
            expiredCount,
            totalSubscriptions: await Subscription.countDocuments()
        };
    }

}
