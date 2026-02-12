import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        customer: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Customer', 
            required: true 
        },
        subscription: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Subscription' 
        },
        type: { 
            type: String, 
            enum: ['subscription_expiry', 'payment_reminder', 'welcome', 'custom'], 
            required: true 
        },
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        status: { 
            type: String, 
            enum: ['pending', 'sent', 'delivered', 'failed'], 
            default: 'pending' 
        },
        scheduledFor: { type: Date },
        sentAt: { type: Date },
        deliveryAttempts: { type: Number, default: 0 },
        channel: { 
            type: String, 
            enum: ['email', 'sms', 'push', 'all'], 
            default: 'email' 
        },
        isAutomated: { type: Boolean, default: false },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
