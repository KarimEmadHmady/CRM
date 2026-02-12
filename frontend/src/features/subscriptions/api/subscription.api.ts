import axios from 'axios';
import {
  Subscription,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  SubscriptionFilters,
  SubscriptionResponse,
  SubscriptionsResponse,
  SubscriptionStatsResponse,
  SubscriptionStats
} from '../types/subscription.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class SubscriptionApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createSubscription(data: CreateSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/subscriptions`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getAllSubscriptions(filters?: SubscriptionFilters): Promise<SubscriptionsResponse> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters?.packageType && filters.packageType !== 'all') {
        params.append('packageType', filters.packageType);
      }
      if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
        params.append('paymentStatus', filters.paymentStatus);
      }

      const url = params.toString() ? `${API_BASE_URL}/subscriptions?${params.toString()}` : `${API_BASE_URL}/subscriptions`;
      const response = await axios.get(url, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  async getSubscriptionById(id: string): Promise<SubscriptionResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  async getSubscriptionsByCustomer(customerId: string): Promise<SubscriptionsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/customer/${customerId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer subscriptions:', error);
      throw error;
    }
  }

  async getActiveSubscriptions(): Promise<SubscriptionsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/active`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      throw error;
    }
  }

  async getExpiredSubscriptions(): Promise<SubscriptionsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/expired`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expired subscriptions:', error);
      throw error;
    }
  }

  async getExpiringSoonSubscriptions(): Promise<SubscriptionsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/expiring-soon`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching expiring soon subscriptions:', error);
      throw error;
    }
  }

  async updateSubscription(id: string, data: UpdateSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/subscriptions/${id}`, data, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<SubscriptionResponse> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/subscriptions/${id}/payment-status`, {
        paymentStatus
      }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async renewSubscription(id: string, newEndDate?: string, price?: number): Promise<SubscriptionResponse> {
    try {
      const requestBody = newEndDate && price ? { newEndDate, price } : {};
      const response = await axios.post(`${API_BASE_URL}/subscriptions/${id}/renew`, requestBody, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw error;
    }
  }

  async deleteSubscription(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/subscriptions/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }

  async getSubscriptionStats(): Promise<SubscriptionStatsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/subscriptions/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      throw error;
    }
  }
}

export const subscriptionApi = new SubscriptionApi();
