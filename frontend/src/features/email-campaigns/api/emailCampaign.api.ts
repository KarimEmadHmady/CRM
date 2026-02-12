import axios from 'axios';
import { 
  EmailCampaign, 
  CreateEmailCampaignRequest, 
  UpdateEmailCampaignRequest, 
  EmailCampaignResponse, 
  EmailCampaignsListResponse, 
  CampaignStatsResponse,
  TestEmailRequest,
  TargetRecipientsResponse
} from '../types/emailCampaign.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class EmailCampaignApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Create email campaign
  async createEmailCampaign(campaignData: CreateEmailCampaignRequest): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns`, campaignData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create email campaign');
    }
  }

  // Get all email campaigns
  async getAllEmailCampaigns(): Promise<EmailCampaignsListResponse> {
    try {
      const response = await axios.get(`${API_URL}/email-campaigns`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch email campaigns');
    }
  }

  // Get email campaign by ID
  async getEmailCampaignById(id: string): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.get(`${API_URL}/email-campaigns/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch email campaign');
    }
  }

  // Update email campaign
  async updateEmailCampaign(id: string, campaignData: UpdateEmailCampaignRequest): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.put(`${API_URL}/email-campaigns/${id}`, campaignData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update email campaign');
    }
  }

  // Delete email campaign
  async deleteEmailCampaign(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${API_URL}/email-campaigns/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete email campaign');
    }
  }

  // Test email campaign
  async testEmail(testData: TestEmailRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns/test`, testData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to test email campaign');
    }
  }

  // Launch email campaign
  async launchEmailCampaign(id: string): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns/${id}/launch`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to launch email campaign');
    }
  }

  // Schedule email campaign
  async scheduleEmailCampaign(id: string, scheduledFor: string): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns/${id}/schedule`, { scheduledFor }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to schedule email campaign');
    }
  }

  // Pause email campaign
  async pauseEmailCampaign(id: string): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns/${id}/pause`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to pause email campaign');
    }
  }

  // Resume email campaign
  async resumeEmailCampaign(id: string): Promise<EmailCampaignResponse> {
    try {
      const response = await axios.post(`${API_URL}/email-campaigns/${id}/resume`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resume email campaign');
    }
  }

  // Get campaign statistics
  async getCampaignStats(id: string): Promise<CampaignStatsResponse> {
    try {
      const response = await axios.get(`${API_URL}/email-campaigns/${id}/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch campaign statistics');
    }
  }

  // Get target recipients
  async getTargetRecipients(id: string): Promise<TargetRecipientsResponse> {
    try {
      const response = await axios.get(`${API_URL}/email-campaigns/${id}/recipients`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch target recipients');
    }
  }
}

export const emailCampaignApi = new EmailCampaignApi();
