import axios from 'axios';
import {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
  NotificationFilters,
  NotificationResponse,
  NotificationsResponse,
  NotificationStatsResponse,
  NotificationStats
} from '../types/notification.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class NotificationApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createNotification(data: CreateNotificationData): Promise<NotificationResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getAllNotifications(filters?: NotificationFilters): Promise<NotificationsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters?.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters?.channel && filters.channel !== 'all') {
        params.append('channel', filters.channel);
      }
      if (filters?.customer) {
        params.append('customer', filters.customer);
      }

      const url = params.toString() ? `${API_BASE_URL}/notifications?${params.toString()}` : `${API_BASE_URL}/notifications`;
      const response = await axios.get(url, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async getNotificationById(id: string): Promise<NotificationResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  }

  async getNotificationsByCustomer(customerId: string): Promise<NotificationsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/customer/${customerId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer notifications:', error);
      throw error;
    }
  }

  async getPendingNotifications(): Promise<NotificationsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/pending`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending notifications:', error);
      throw error;
    }
  }

  async updateNotification(id: string, data: UpdateNotificationData): Promise<NotificationResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${id}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  }

  async sendNotification(id: string): Promise<NotificationResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/${id}/send`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async deleteNotification(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async getNotificationStats(): Promise<NotificationStatsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  }

  async createSubscriptionExpiryNotifications(daysBefore: number = 3): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/subscription-expiry`, { daysBefore }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription expiry notifications:', error);
      throw error;
    }
  }

  async createPaymentReminderNotifications(daysBefore: number = 3): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/notifications/payment-reminders`, { daysBefore }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment reminder notifications:', error);
      throw error;
    }
  }

  async createWelcomeNotification(customerId: string, message?: string): Promise<NotificationResponse> {
    try {
      const payload = message ? { message } : {};
      const response = await axios.post(`${API_BASE_URL}/notifications/customer/${customerId}/welcome`, payload, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating welcome notification:', error);
      throw error;
    }
  }
}

export const notificationApi = new NotificationApi();
