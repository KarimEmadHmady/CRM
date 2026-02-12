import mongoose from "mongoose";

const emailCampaignSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        subject: { type: String, required: true, trim: true },
        template: { 
            type: String, 
            enum: ['welcome', 'expiry_reminder', 'payment_reminder', 'promotion', 'custom', 'announcement', 'newsletter', 'invitation', 'survey'], 
            required: true 
        },
        content: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['draft', 'scheduled', 'active', 'completed', 'paused'], 
            default: 'draft' 
        },
        targetAudience: { 
            type: String, 
            enum: ['all', 'subscribed', 'expired', 'interested', 'custom'], 
            default: 'all' 
        },
        customRecipients: [{ type: String }], // Array of customer IDs for custom targeting
        scheduledFor: { type: Date },
        sentAt: { type: Date },
        statistics: {
            totalRecipients: { type: Number, default: 0 },
            sentCount: { type: Number, default: 0 },
            deliveredCount: { type: Number, default: 0 },
            openedCount: { type: Number, default: 0 },
            failedCount: { type: Number, default: 0 }
        },
        settings: {
            trackOpens: { type: Boolean, default: true },
            trackClicks: { type: Boolean, default: true },
            sendImmediately: { type: Boolean, default: false }
        },
        createdBy: { type: String, required: true },
        notes: { type: String, trim: true, default: "" }
    },
    { timestamps: true }
);

export const EmailCampaign = mongoose.model("EmailCampaign", emailCampaignSchema);
