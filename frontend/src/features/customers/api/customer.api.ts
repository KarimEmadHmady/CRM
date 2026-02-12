import axios from 'axios';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerResponse, CustomersListResponse, CustomerStatsResponse } from '../types/customer.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class CustomerApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createCustomer(customerData: CreateCustomerRequest): Promise<CustomerResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/customers`, customerData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async getAllCustomers(): Promise<CustomersListResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<CustomerResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, customerData: UpdateCustomerRequest): Promise<CustomerResponse> {
    try {
      const response = await axios.put(`${API_BASE_URL}/customers/${id}`, customerData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async updateCustomerStatus(id: string, status: string): Promise<CustomerResponse> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/customers/${id}/status`, { status }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer status:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/customers/${id}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async searchCustomers(query: string): Promise<CustomersListResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/search?q=${encodeURIComponent(query)}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  async getCustomersByCategory(category: string): Promise<CustomersListResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/category/${encodeURIComponent(category)}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers by category:', error);
      throw error;
    }
  }

  async getCustomersByStatus(status: string): Promise<CustomersListResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/status/${encodeURIComponent(status)}`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers by status:', error);
      throw error;
    }
  }

  async getCustomerStats(): Promise<CustomerStatsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  }
}

export const customerApi = new CustomerApi();
