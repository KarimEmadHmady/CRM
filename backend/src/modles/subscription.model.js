import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
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
