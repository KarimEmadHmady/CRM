import express from "express";
import { EmailCampaignController } from "../controllers/emailCampaign.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { authenticateToken, requirePermission } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All email campaign routes require authentication
router.use(authenticateToken);

router.post("/", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.createEmailCampaignController));
router.get("/", requirePermission('email_campaign_read'), asyncHandler(EmailCampaignController.getAllEmailCampaignsController));
router.post("/test", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.testEmailController));
router.get("/:id", requirePermission('email_campaign_read'), asyncHandler(EmailCampaignController.getEmailCampaignByIdController));
router.put("/:id", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.updateEmailCampaignController));
router.post("/:id/launch", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.launchEmailCampaignController));
router.post("/:id/schedule", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.scheduleEmailCampaignController));
router.post("/:id/pause", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.pauseEmailCampaignController));
router.post("/:id/resume", requirePermission('email_campaign_write'), asyncHandler(EmailCampaignController.resumeEmailCampaignController));
router.get("/:id/stats", requirePermission('stats_view'), asyncHandler(EmailCampaignController.getCampaignStatsController));
router.get("/:id/recipients", requirePermission('email_campaign_read'), asyncHandler(EmailCampaignController.getTargetRecipientsController));
router.delete("/:id", requirePermission('email_campaign_delete'), asyncHandler(EmailCampaignController.deleteEmailCampaignController));

export default router;
