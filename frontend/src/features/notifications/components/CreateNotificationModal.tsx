'use client';

import { useState, useEffect } from 'react';
import { Calendar, Mail, MessageSquare, Smartphone, Bell, User, Tag, FileText } from 'lucide-react';
import { CreateNotificationData } from '../types/notification.types';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';
import { Customer } from '@/features/customers/types/customer.types';
import { Subscription } from '@/features/subscriptions/types/subscription.types';

interface CreateNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNotificationData) => void;
  loading?: boolean;
}

export function CreateNotificationModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}: CreateNotificationModalProps) {
  const [formData, setFormData] = useState<CreateNotificationData>({
    customer: '',
    subscription: '',
    type: 'custom',
    title: '',
    message: '',
    channel: 'email',
    scheduledFor: ''
  });

  const { customers, fetchCustomers } = useCustomers();
  const { subscriptions, fetchSubscriptions } = useSubscriptions();
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      fetchSubscriptions();
    }
  }, [isOpen, fetchCustomers, fetchSubscriptions]);

  useEffect(() => {
    // Filter subscriptions based on selected customer
    if (formData.customer) {
      const filtered = subscriptions.filter(sub => 
        typeof sub.customer === 'string' 
          ? sub.customer === formData.customer
          : sub.customer._id === formData.customer
      );
      setFilteredSubscriptions(filtered);
    } else {
      setFilteredSubscriptions(subscriptions);
    }
  }, [formData.customer, subscriptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subscription when customer changes
      subscription: name === 'customer' ? '' : prev.subscription
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Notification</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" />
              Customer *
            </label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            >
              <option value="">Select a customer</option>
              {customers.map((customer: Customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          {/* Subscription Selection (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              Subscription (Optional)
            </label>
            <select
              name="subscription"
              value={formData.subscription}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">No subscription</option>
              {filteredSubscriptions.map((subscription: Subscription) => (
                <option key={subscription._id} value={subscription._id}>
                  {subscription.packageType.charAt(0).toUpperCase() + subscription.packageType.slice(1)} - 
                  ${subscription.price} - 
                  {new Date(subscription.endDate).toLocaleDateString()}
                </option>
              ))}
            </select>
            {formData.customer && filteredSubscriptions.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No subscriptions found for this customer</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Notification Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            >
              <option value="subscription_expiry">Subscription Expiry</option>
              <option value="payment_reminder">Payment Reminder</option>
              <option value="welcome">Welcome</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter notification title"
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter notification message"
              rows={4}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel *
            </label>
            <select
              name="channel"
              value={formData.channel}
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
              <option value="all">All Channels</option>
            </select>
          </div>

          {/* Scheduled For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Schedule For (Optional)
            </label>
            <input
              type="datetime-local"
              name="scheduledFor"
              value={formData.scheduledFor}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for immediate delivery</p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Notification</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
