import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

const subscriptionSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true, default: () => uuid() },
        customer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Customer', 
            required: true 
        },
        packageType: { 
            type: String, 
            enum: ['basic', 'premium', 'vip', 'custom'], 
            required: true 
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        price: { type: Number, required: true, min: 0 },
        paymentStatus: { 
            type: String, 
            enum: ['pending', 'paid', 'overdue', 'cancelled'], 
            default: 'pending' 
        },
        autoRenew: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        paymentMethod: { 
            type: String, 
            enum: ['cash', 'card', 'bank_transfer', 'other'], 
            default: 'cash' 
        },
        notes: { type: String, trim: true, default: "" },
        lastPaymentDate: { type: Date },
        nextPaymentDate: { type: Date }
    },
    { timestamps: true }
);

// Update customer's totalSpent when subscription payment status changes to 'paid'
subscriptionSchema.post(['save', 'update'], async function() {
    if (this.paymentStatus === 'paid') {
        try {
            const Customer = mongoose.model('Customer');
            const paidSubscriptions = await mongoose.model('Subscription').find({
                customer: this.customer,
                paymentStatus: 'paid'
            });
            
            const totalSpent = paidSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
            
            await Customer.findByIdAndUpdate(this.customer, { totalSpent });
            console.log(`Updated customer ${this.customer} totalSpent to ${totalSpent}`);
        } catch (error) {
            console.error('Error updating customer totalSpent:', error);
        }
    }
});

// Update customer's totalSpent when subscription is deleted
subscriptionSchema.post(['deleteOne', 'deleteMany'], async function() {
    // For deleteOne, get the customer from the document being deleted
    if (this.paymentStatus === 'paid') {
        try {
            const Customer = mongoose.model('Customer');
            const paidSubscriptions = await mongoose.model('Subscription').find({
                customer: this.customer,
                paymentStatus: 'paid'
            });
            
            const totalSpent = paidSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
            
            await Customer.findByIdAndUpdate(this.customer, { totalSpent });
            console.log(`Updated customer ${this.customer} totalSpent after deletion to ${totalSpent}`);
        } catch (error) {
            console.error('Error updating customer totalSpent after deletion:', error);
        }
    }
});

subscriptionSchema.virtual('daysUntilExpiry').get(function() {
    if (!this.endDate) return null;
    const today = new Date();
    const expiryDate = new Date(this.endDate);
    const diffTime = expiryDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

subscriptionSchema.virtual('isExpired').get(function() {
    return this.endDate < new Date();
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
