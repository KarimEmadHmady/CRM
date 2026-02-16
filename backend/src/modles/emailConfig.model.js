import mongoose from 'mongoose';
import nodemailer from 'nodemailer';  

const emailConfigSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    provider: {
        type: String,
        required: true,
        enum: ['gmail', 'smtp'],
        default: 'gmail'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    // Gmail specific settings
    gmail: {
        email: {
            type: String,
            required: function() { return this.provider === 'gmail'; }
        },
        password: {
            type: String,
            required: function() { return this.provider === 'gmail'; }
        },
        clientId: String,
        clientSecret: String,
        refreshToken: String
    },
    // SMTP specific settings
    smtp: {
        host: {
            type: String,
            required: function() { return this.provider === 'smtp'; }
        },
        port: {
            type: Number,
            required: function() { return this.provider === 'smtp'; }
        },
        secure: {
            type: Boolean,
            default: true
        },
        auth: {
            user: {
                type: String,
                required: function() { return this.provider === 'smtp'; }
            },
            pass: {
                type: String,
                required: function() { return this.provider === 'smtp'; }
            }
        }
    },
    // Common settings
    fromName: {
        type: String,
        default: 'CRM System'
    },
    fromEmail: {
        type: String,
        required: true
    },
    replyTo: String,
    // Test settings
    testEmail: String,
    // Statistics
    statistics: {
        totalSent: {
            type: Number,
            default: 0
        },
        totalFailed: {
            type: Number,
            default: 0
        },
        lastUsed: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Ensure only one active configuration per provider
emailConfigSchema.index(
    { provider: 1, isActive: 1 }, 
    { unique: true, partialFilterExpression: { isActive: true } }
);

// Method to create transporter
emailConfigSchema.methods.createTransporter = function() {
    // ⬅️ شيلنا const nodemailer = require('nodemailer');
    // واستخدمنا nodemailer من الـ import اللي فوق
    
    if (this.provider === 'gmail') {
        const gmailConfig = {
            service: 'gmail',
            auth: {
                user: this.gmail.email,
                pass: this.gmail.password
            }
        };

        // أضف OAuth2 credentials لو موجودين
        if (this.gmail.clientId && this.gmail.clientSecret && this.gmail.refreshToken) {
            gmailConfig.auth.clientId = this.gmail.clientId;
            gmailConfig.auth.clientSecret = this.gmail.clientSecret;
            gmailConfig.auth.refreshToken = this.gmail.refreshToken;
        }

        return nodemailer.createTransport(gmailConfig);
    } 
    
    if (this.provider === 'smtp') {
        return nodemailer.createTransport({
            host: this.smtp.host,
            port: this.smtp.port,
            secure: this.smtp.secure,
            auth: {
                user: this.smtp.auth.user,
                pass: this.smtp.auth.pass
            }
        });
    }
    
    throw new Error(`Unsupported provider: ${this.provider}`);
};

// Method to test connection
emailConfigSchema.methods.testConnection = async function() {
    try {
        const transporter = this.createTransporter();
        await transporter.verify();
        return { 
            success: true, 
            message: 'Connection successful' 
        };
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    }
};

export const EmailConfig = mongoose.model('EmailConfig', emailConfigSchema);