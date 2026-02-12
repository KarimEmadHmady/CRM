import { EmailService } from "../services/email.service.js";

export class EmailCampaignController {

    static async createEmailCampaignController(req, res, next) {
        try {
            const { name, subject, template, content, targetAudience, customRecipients, scheduledFor, settings, createdBy, notes } = req.body;
            const campaign = await EmailService.createEmailCampaignService({ 
                name, subject, template, content, targetAudience, customRecipients, scheduledFor, settings, createdBy, notes 
            });
            res.status(201).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    static async getAllEmailCampaignsController(req, res, next) {
        try {
            const { status } = req.query;
            let campaigns = await EmailService.getAllEmailCampaignsService();
            
            if (status) {
                campaigns = campaigns.filter(campaign => campaign.status === status);
            }

            res.status(200).json({ success: true, data: campaigns });
        } catch (error) {
            next(error);
        }
    }

    static async getEmailCampaignByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await EmailService.getEmailCampaignByIdService(id);
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    static async updateEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const { name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes } = req.body;
            
            const updatedCampaign = await EmailService.updateEmailCampaignService(id, { 
                name, subject, template, content, targetAudience, customRecipients, scheduledFor, status, settings, notes 
            });

            if (!updatedCampaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, data: updatedCampaign });
        } catch (error) {
            next(error);
        }
    }

    static async deleteEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await EmailService.deleteEmailCampaignService(id);
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, message: "Email campaign deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async launchEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const results = await EmailService.launchEmailCampaignService(id);
            res.status(200).json({ success: true, data: results });
        } catch (error) {
            next(error);
        }
    }

    static async scheduleEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const { scheduledFor } = req.body;
            
            const campaign = await EmailService.scheduleEmailCampaignService(id, scheduledFor);
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    static async getCampaignStatsController(req, res, next) {
        try {
            const { id } = req.params;
            const stats = await EmailService.getCampaignStatsService(id);
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async getTargetRecipientsController(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await EmailService.getEmailCampaignByIdService(id);
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            const recipients = await EmailService.getTargetRecipientsService(campaign);
            res.status(200).json({ success: true, data: recipients });
        } catch (error) {
            next(error);
        }
    }

    static async testEmailController(req, res, next) {
        try {
            const { campaignId, testEmails } = req.body;
            const results = await EmailService.testEmailCampaignService({ campaignId, testEmails });
            res.status(200).json({ success: true, data: results });
        } catch (error) {
            next(error);
        }
    }

    static async pauseEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await EmailService.updateEmailCampaignService(id, { status: 'paused' });
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

    static async resumeEmailCampaignController(req, res, next) {
        try {
            const { id } = req.params;
            const campaign = await EmailService.updateEmailCampaignService(id, { status: 'active' });
            
            if (!campaign) {
                return res.status(404).json({ success: false, message: "Email campaign not found" });
            }

            res.status(200).json({ success: true, data: campaign });
        } catch (error) {
            next(error);
        }
    }

}
