import nodemailer from "nodemailer";
import { EmailCampaign } from "../modles/emailCampaign.model.js";
import { Customer } from "../modles/customer.model.js";
import { Notification } from "../modles/notification.model.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config()


// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export class EmailService {

    static async sendEmail({ to, subject, text, template, html, metadata }) {
        try {
            let finalHtml = html;
            
            // Generate HTML with category-specific content for welcome emails
            if (template === 'welcome' && metadata) {
                const { category, categorySpecificContent, categorySpecificImage, categorySpecificLink } = metadata;
                
                finalHtml = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
                        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <img src="${categorySpecificImage}" alt="Welcome Image" style="max-width: 200px; border-radius: 8px;">
                            </div>
                            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Welcome to Our Service!</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${text}</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${categorySpecificLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                    Visit Our Website
                                </a>
                            </div>
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                                <p style="color: #888; font-size: 14px; margin: 0;">
                                    Best regards,<br>
                                    <strong>${process.env.APP_NAME || 'System'}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }

            const mailOptions = {
                from: {
                    name: process.env.APP_NAME || 'System',
                    address: process.env.EMAIL_USER
                },
                to,
                subject,
                text,
                html: finalHtml || this.generateTemplate(template, text, metadata),
                // Add list headers for better email client support
                list: {
                    help: `mailto:${process.env.EMAIL_USER}`,
                    unsubscribe: `mailto:${process.env.EMAIL_USER}?subject=Unsubscribe`
                },
                headers: {
                    'X-Priority': '1',
                    'X-Mailer': 'NodeMailer',
                    'X-MS-Exchange-Organization-SCL': '-1',
                    'X-Auto-Response-Suppress': 'All',
                    'X-Google-App-Id': process.env.EMAIL_USER
                }
            };

            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }

    static generateTemplate(template, content) {
        const templates = {
            welcome: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Our Service!</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>We're excited to have you with us. If you have any questions, please don't hesitate to reach out.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            expiry_reminder: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff6b6b;">Subscription Expiring Soon</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>Please renew your subscription to continue enjoying our services.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            payment_reminder: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffa500;">Payment Reminder</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>Please complete your payment to avoid service interruption.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            newsletter: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #007bff;">Monthly Newsletter</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>Here are our latest updates and news for this month.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            announcement: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc3545;">Important Announcement</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>We wanted to inform you about this important update.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            survey: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6f42c1;">Customer Survey</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>Your feedback is important to us. Please take a moment to complete our survey.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            invitation: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Special Invitation</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>We'd like to invite you to this special event.</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            promotion: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Special Offer!</h2>
                    <p>Dear Customer,</p>
                    <p>${content}</p>
                    <p>Don't miss out on this amazing opportunity!</p>
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `,
            custom: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    ${content}
                    <br>
                    <p>Best regards,<br>${process.env.APP_NAME || 'System'}</p>
                </div>
            `
        };

        return templates[template] || templates.custom;
    }

    static async createEmailCampaignService({ name, subject, template, content, targetAudience, customRecipients, scheduledFor, settings, createdBy, notes }) {
        const id = uuid();
        return await EmailCampaign.create({ 
            id, 
            name, 
            subject, 
            template, 
            content, 
            targetAudience, 
            customRecipients, 
            scheduledFor, 
            settings, 
            createdBy, 
            notes 
        });
    }

    static async getAllEmailCampaignsService() {
        return await EmailCampaign.find().sort({ createdAt: -1 });
    }

    static async getEmailCampaignByIdService(id) {
        return await EmailCampaign.findById(id);
    }

    static async updateEmailCampaignService(id, { name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes }) {
        const updateData = { name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        return await EmailCampaign.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteEmailCampaignService(id) {
        return await EmailCampaign.findByIdAndDelete(id);
    }

    static async getTargetRecipientsService(campaign) {
        let recipients = [];

        switch (campaign.targetAudience) {
            case 'all':
                recipients = await Customer.find({});
                break;
            case 'subscribed':
                recipients = await Customer.find({ status: 'subscribed' });
                break;
            case 'expired':
                recipients = await Customer.find({ status: 'expired' });
                break;
            case 'interested':
                recipients = await Customer.find({ status: 'interested' });
                break;
            case 'custom':
                recipients = await Customer.find({ _id: { $in: campaign.customRecipients } });
                break;
        }

        return recipients;
    }

    static async launchEmailCampaignService(campaignId) {
        const campaign = await EmailCampaign.findById(campaignId);
        if (!campaign) throw new Error('Campaign not found');

        const recipients = await this.getTargetRecipientsService(campaign);
        
        // Update campaign statistics
        campaign.statistics.totalRecipients = recipients.length;
        campaign.status = 'active';
        campaign.sentAt = new Date();
        await campaign.save();

        const results = {
            sent: 0,
            failed: 0,
            errors: []
        };

        for (const recipient of recipients) {
            try {
                await this.sendEmail({
                    to: recipient.email,
                    subject: campaign.subject,
                    text: campaign.content.replace('{{name}}', recipient.name),
                    template: campaign.template,
                    html: campaign.content.replace('{{name}}', recipient.name)
                });

                // Create notification record
                await Notification.create({
                    customer: recipient._id,
                    type: 'custom',
                    title: campaign.subject,
                    message: campaign.content,
                    status: 'sent',
                    sentAt: new Date(),
                    channel: 'email',
                    isAutomated: false,
                    metadata: { campaignId: campaign._id }
                });

                results.sent++;

            } catch (error) {
                results.failed++;
                results.errors.push({ email: recipient.email, error: error.message });
                
                // Create failed notification record
                await Notification.create({
                    customer: recipient._id,
                    type: 'custom',
                    title: campaign.subject,
                    message: campaign.content,
                    status: 'failed',
                    channel: 'email',
                    isAutomated: false,
                    metadata: { campaignId: campaign._id, error: error.message }
                });
            }
        }

        // Update final statistics
        campaign.statistics.sentCount = results.sent;
        campaign.statistics.failedCount = results.failed;
        campaign.status = 'completed';
        await campaign.save();

        return results;
    }

    static async scheduleEmailCampaignService(campaignId, scheduledFor) {
        const campaign = await EmailCampaign.findByIdAndUpdate(
            campaignId,
            { 
                status: 'scheduled',
                scheduledFor 
            },
            { new: true }
        );

        return campaign;
    }

    static async getCampaignStatsService(campaignId) {
        const campaign = await EmailCampaign.findById(campaignId);
        if (!campaign) throw new Error('Campaign not found');

        const notifications = await Notification.find({
            'metadata.campaignId': campaignId
        });

        const stats = {
            ...campaign.statistics,
            openedCount: notifications.filter(n => n.status === 'delivered').length,
            deliveredCount: notifications.filter(n => n.status === 'sent').length
        };

        return stats;
    }

    static async testEmailCampaignService({ campaignId, testEmails }) {
        if (!campaignId || !testEmails || testEmails.length === 0) {
            throw new Error("Campaign ID and test emails are required");
        }

        // Get the campaign details
        const campaign = await this.getEmailCampaignByIdService(campaignId);
        if (!campaign) {
            throw new Error("Campaign not found");
        }

        // Send test emails to all provided email addresses
        const results = [];
        for (const email of testEmails) {
            if (email.trim()) {
                const result = await this.testEmailService({ 
                    to: email.trim(), 
                    subject: campaign.subject, 
                    content: campaign.content, 
                    template: campaign.template 
                });
                results.push({ email: email.trim(), result });
            }
        }

        return results;
    }

    static async testEmailService({ to, subject, content, template }) {
        try {
            const result = await this.sendEmail({
                to,
                subject: `[TEST] ${subject}`,
                text: content,
                template
            });

            return { success: true, messageId: result.messageId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

}
