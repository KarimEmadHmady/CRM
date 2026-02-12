import { useState, useEffect, useCallback } from 'react';
import { customerApi } from '../api/customer.api';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerStatsResponse } from '../types/customer.types';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CustomerStatsResponse['data'] | null>(null);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.getAllCustomers();
      setCustomers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
      console.error('Fetch customers error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create customer
  const createCustomer = useCallback(async (customerData: CreateCustomerRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.createCustomer(customerData);
      setCustomers(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer
  const updateCustomer = useCallback(async (id: string, customerData: UpdateCustomerRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.updateCustomer(id, customerData);
      setCustomers(prev => prev.map(customer => 
        customer._id === id ? response.data : customer
      ));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer status
  const updateCustomerStatus = useCallback(async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.updateCustomerStatus(id, status);
      setCustomers(prev => prev.map(customer => 
        customer._id === id ? response.data : customer
      ));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update customer status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete customer
  const deleteCustomer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await customerApi.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer._id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete customer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search customers
  const searchCustomers = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.searchCustomers(query);
      setCustomers(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to search customers';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get customers by category
  const getCustomersByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.getCustomersByCategory(category);
      setCustomers(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customers by category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get customers by status
  const getCustomersByStatus = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.getCustomersByStatus(status);
      setCustomers(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customers by status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customer stats
  const fetchCustomerStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerApi.getCustomerStats();
      setStats(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch customer stats';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, [fetchCustomers, fetchCustomerStats]);

  return {
    customers,
    loading,
    error,
    stats,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    updateCustomerStatus,
    deleteCustomer,
    searchCustomers,
    getCustomersByCategory,
    getCustomersByStatus,
    fetchCustomerStats,
    clearError
  };
}
