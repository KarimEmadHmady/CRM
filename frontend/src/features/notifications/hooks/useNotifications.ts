import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notification.api';
import {
  Notification,
  CreateNotificationData,
  UpdateNotificationData,
  NotificationFilters,
  NotificationStats,
  NotificationsResponse,
  NotificationStatsResponse
} from '../types/notification.types';

export function useNotifications(initialFilters?: NotificationFilters) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>(initialFilters || {});

  const fetchNotifications = useCallback(async (newFilters?: NotificationFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getAllNotifications(newFilters || filters);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await notificationApi.getNotificationStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch notification stats:', err);
    }
  }, []);

  const createNotification = useCallback(async (data: CreateNotificationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.createNotification(data);
      if (response.success) {
        setNotifications(prev => [response.data, ...prev]);
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const updateNotification = useCallback(async (id: string, data: UpdateNotificationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.updateNotification(id, data);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => notification._id === id ? response.data : notification)
        );
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const deleteNotification = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(notification => notification._id !== id));
        await fetchStats();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const sendNotification = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.sendNotification(id);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => notification._id === id ? response.data : notification)
        );
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const getPendingNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getPendingNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pending notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const getNotificationsByCustomer = useCallback(async (customerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.getNotificationsByCustomer(customerId);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch customer notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscriptionExpiryNotifications = useCallback(async (daysBefore: number = 3) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.createSubscriptionExpiryNotifications(daysBefore);
      if (response.success) {
        await fetchNotifications();
        await fetchStats();
      }
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create subscription expiry notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, fetchStats]);

  const createPaymentReminderNotifications = useCallback(async (daysBefore: number = 3) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.createPaymentReminderNotifications(daysBefore);
      if (response.success) {
        await fetchNotifications();
        await fetchStats();
      }
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment reminder notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, fetchStats]);

  const createWelcomeNotification = useCallback(async (customerId: string, message?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationApi.createWelcomeNotification(customerId, message);
      if (response.success) {
        setNotifications(prev => [response.data, ...prev]);
        await fetchStats();
        return response.data;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create welcome notification');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateFilters = useCallback((newFilters: NotificationFilters) => {
    setFilters(newFilters);
    fetchNotifications(newFilters);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  return {
    notifications,
    loading,
    error,
    stats,
    filters,
    fetchNotifications,
    fetchStats,
    createNotification,
    updateNotification,
    deleteNotification,
    sendNotification,
    getPendingNotifications,
    getNotificationsByCustomer,
    createSubscriptionExpiryNotifications,
    createPaymentReminderNotifications,
    createWelcomeNotification,
    clearError,
    updateFilters
  };
}
