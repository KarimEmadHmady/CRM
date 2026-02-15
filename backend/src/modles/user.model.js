import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { 
            type: String, 
            enum: ['admin', 'manager', 'staff'], 
            default: 'staff' 
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
        permissions: [{
            type: String,
            enum: [
                'customer_read', 'customer_write', 'customer_delete',
                'subscription_read', 'subscription_write', 'subscription_delete',
                'notification_read', 'notification_write', 'notification_delete',
                'email_campaign_read', 'email_campaign_write', 'email_campaign_delete',
                'stats_view', 'user_management'
            ]
        }]
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
