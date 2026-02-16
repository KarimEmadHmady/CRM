import { EmailConfig } from "../modles/emailConfig.model.js";
import { EmailService } from "../services/email.service.js";

export class EmailConfigController {

    static async createEmailConfigController(req, res, next) {
        try {
            const {
                name,
                provider,
                gmail,
                smtp,
                fromName,
                fromEmail,
                replyTo,
                testEmail
            } = req.body;

            // If this is set as active, deactivate other configurations of the same provider
            if (req.body.isActive) {
                await EmailConfig.updateMany(
                    { provider },
                    { isActive: false }
                );
            }

            const emailConfig = await EmailConfig.create({
                name,
                provider,
                gmail,
                smtp,
                fromName,
                fromEmail,
                replyTo,
                testEmail,
                isActive: req.body.isActive || false,
                createdBy: req.user.id
            });

            res.status(201).json({ 
                success: true, 
                data: emailConfig,
                message: 'Email configuration created successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllEmailConfigsController(req, res, next) {
        try {
            const { provider, isActive } = req.query;
            let filter = {};
            
            if (provider) filter.provider = provider;
            if (isActive !== undefined) filter.isActive = isActive === 'true';

            const configs = await EmailConfig.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 });

            res.status(200).json({ success: true, data: configs });
        } catch (error) {
            next(error);
        }
    }

    static async getEmailConfigByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const config = await EmailConfig.findById(id)
                .populate('createdBy', 'name email');
            
            if (!config) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            res.status(200).json({ success: true, data: config });
        } catch (error) {
            next(error);
        }
    }

    static async updateEmailConfigController(req, res, next) {
        try {
            const { id } = req.params;
            const {
                name,
                provider,
                gmail,
                smtp,
                fromName,
                fromEmail,
                replyTo,
                testEmail,
                isActive
            } = req.body;

            // If setting as active, deactivate others of same provider
            if (isActive) {
                await EmailConfig.updateMany(
                    { 
                        provider: provider || (await EmailConfig.findById(id)).provider,
                        _id: { $ne: id }
                    },
                    { isActive: false }
                );
            }

            const updateData = {
                name,
                provider,
                gmail,
                smtp,
                fromName,
                fromEmail,
                replyTo,
                testEmail,
                isActive
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => 
                updateData[key] === undefined && delete updateData[key]
            );

            const updatedConfig = await EmailConfig.findByIdAndUpdate(
                id, 
                updateData, 
                { new: true, runValidators: true }
            ).populate('createdBy', 'name email');

            if (!updatedConfig) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            res.status(200).json({ 
                success: true, 
                data: updatedConfig,
                message: 'Email configuration updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteEmailConfigController(req, res, next) {
        try {
            const { id } = req.params;
            const config = await EmailConfig.findByIdAndDelete(id);
            
            if (!config) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            res.status(200).json({ 
                success: true, 
                message: "Email configuration deleted successfully" 
            });
        } catch (error) {
            next(error);
        }
    }

    static async testEmailConfigController(req, res, next) {
        try {
            const { id } = req.params;
            const { testEmail } = req.body;

            const config = await EmailConfig.findById(id);
            if (!config) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            // Test connection
            const connectionTest = await config.testConnection();
            if (!connectionTest.success) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Connection test failed", 
                    error: connectionTest.error 
                });
            }

            // Send test email
            const testEmailAddress = testEmail || config.testEmail;
            if (!testEmailAddress) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Test email address is required" 
                });
            }

            try {
                const result = await EmailService.sendEmailWithConfig(config, {
                    to: testEmailAddress,
                    subject: 'Test Email from CRM System',
                    text: 'This is a test email to verify your email configuration is working correctly.',
                    template: 'custom'
                });

                // Update statistics
                config.statistics.totalSent += 1;
                config.statistics.lastUsed = new Date();
                await config.save();

                res.status(200).json({ 
                    success: true, 
                    message: "Test email sent successfully",
                    messageId: result.messageId
                });
            } catch (emailError) {
                // Update failed statistics
                config.statistics.totalFailed += 1;
                await config.save();

                res.status(400).json({ 
                    success: false, 
                    message: "Failed to send test email", 
                    error: emailError.message 
                });
            }
        } catch (error) {
            next(error);
        }
    }

    static async setActiveConfigController(req, res, next) {
        try {
            const { id } = req.params;

            const config = await EmailConfig.findById(id);
            if (!config) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            // Toggle the active state
            if (config.isActive) {
                // Deactivate this config
                config.isActive = false;
                await config.save();
                
                res.status(200).json({ 
                    success: true, 
                    data: config,
                    message: `Email configuration deactivated for ${config.provider}`
                });
            } else {
                // Deactivate all configs of the same provider
                await EmailConfig.updateMany(
                    { 
                        provider: config.provider,
                        _id: { $ne: id }
                    },
                    { isActive: false }
                );

                // Activate this config
                config.isActive = true;
                await config.save();

                res.status(200).json({ 
                    success: true, 
                    data: config,
                    message: `Email configuration activated for ${config.provider}`
                });
            }
        } catch (error) {
            next(error);
        }
    }

    static async getActiveConfigsController(req, res, next) {
        try {
            const activeConfigs = await EmailConfig.find({ isActive: true })
                .populate('createdBy', 'name email')
                .sort({ provider: 1 });

            res.status(200).json({ success: true, data: activeConfigs });
        } catch (error) {
            next(error);
        }
    }

    static async getEmailConfigStatsController(req, res, next) {
        try {
            const { id } = req.params;
            const config = await EmailConfig.findById(id);
            
            if (!config) {
                return res.status(404).json({ success: false, message: "Email configuration not found" });
            }

            res.status(200).json({ 
                success: true, 
                data: {
                    statistics: config.statistics,
                    provider: config.provider,
                    name: config.name,
                    isActive: config.isActive
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
