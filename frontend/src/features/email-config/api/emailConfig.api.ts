import { EmailConfig, CreateEmailConfigRequest, TestEmailRequest } from '../types/emailConfig.types';

class EmailConfigApi {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private baseUrl = `${this.API_BASE_URL}/email-config`;

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllConfigs(): Promise<{ success: boolean; data: EmailConfig[] }> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching email configs:', error);
      return { success: false, data: [] };
    }
  }

  async getConfigById(id: string): Promise<{ success: boolean; data: EmailConfig }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching email config:', error);
      return { success: false, data: null as any };
    }
  }

  async createConfig(config: CreateEmailConfigRequest): Promise<{ success: boolean; data: EmailConfig }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating email config:', error);
      return { success: false, data: null as any };
    }
  }

  async updateConfig(id: string, config: Partial<CreateEmailConfigRequest>): Promise<{ success: boolean; data: EmailConfig }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(config)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating email config:', error);
      return { success: false, data: null as any };
    }
  }

  async deleteConfig(id: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return { success: response.ok };
    } catch (error) {
      console.error('Error deleting email config:', error);
      return { success: false };
    }
  }

  async setActiveConfig(id: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/set-active`, {
        method: 'PUT',
        headers: this.getAuthHeaders()
      });
      return { success: response.ok };
    } catch (error) {
      console.error('Error setting active config:', error);
      return { success: false };
    }
  }

  async testConfig(id: string, testData: TestEmailRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/test`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing email config:', error);
      return { success: false, message: 'Failed to test email configuration' };
    }
  }
}

export const emailConfigApi = new EmailConfigApi();
