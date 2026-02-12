import { useState, useEffect, useCallback } from 'react';
import { subscriptionApi } from '../api/subscription.api';
import {
  Subscription,
  CreateSubscriptionData,
  UpdateSubscriptionData,
  SubscriptionFilters,
  SubscriptionStats,
  SubscriptionsResponse,
  SubscriptionStatsResponse
} from '../types/subscription.types';

export function useSubscriptions(initialFilters?: SubscriptionFilters) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [filters, setFilters] = useState<SubscriptionFilters>(initialFilters || {});

  const fetchSubscriptions = useCallback(async (newFilters?: SubscriptionFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.getAllSubscriptions(newFilters || filters);
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await subscriptionApi.getSubscriptionStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch subscription stats:', err);
    }
  }, []);

  const createSubscription = useCallback(async (data: CreateSubscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.createSubscription(data);
      if (response.success) {
        setSubscriptions(prev => [response.data, ...prev]);
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.updateSubscription(id, data);
      if (response.success) {
        setSubscriptions(prev => 
          prev.map(sub => sub._id === id ? response.data : sub)
        );
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const deleteSubscription = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.deleteSubscription(id);
      if (response.success) {
        setSubscriptions(prev => prev.filter(sub => sub._id !== id));
        await fetchStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.updatePaymentStatus(id, paymentStatus);
      if (response.success) {
        setSubscriptions(prev => 
          prev.map(sub => sub._id === id ? response.data : sub)
        );
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payment status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const renewSubscription = useCallback(async (id: string, newEndDate?: string, price?: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.renewSubscription(id, newEndDate, price);
      if (response.success) {
        setSubscriptions(prev => 
          prev.map(sub => sub._id === id ? response.data : sub)
        );
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to renew subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const getActiveSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.getActiveSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch active subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpiredSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.getExpiredSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expired subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpiringSoonSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionApi.getExpiringSoonSubscriptions();
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch expiring soon subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateFilters = useCallback((newFilters: SubscriptionFilters) => {
    setFilters(newFilters);
    fetchSubscriptions(newFilters);
  }, [fetchSubscriptions]);

  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    stats,
    filters,
    fetchSubscriptions,
    fetchStats,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    updatePaymentStatus,
    renewSubscription,
    getActiveSubscriptions,
    getExpiredSubscriptions,
    getExpiringSoonSubscriptions,
    clearError,
    updateFilters
  };
}
