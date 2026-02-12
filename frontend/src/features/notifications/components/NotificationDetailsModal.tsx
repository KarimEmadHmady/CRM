'use client';

import { Mail, MessageSquare, Smartphone, Bell, Calendar, User, Tag, Send, Edit, Trash2, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Notification } from '../types/notification.types';

interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
  onEdit: (notification: Notification) => void;
  onSend: (notification: Notification) => void;
  onDelete: (notification: Notification) => void;
}

export function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
  onEdit,
  onSend,
  onDelete
}: NotificationDetailsModalProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Send className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription_expiry': return 'text-orange-600 bg-orange-100';
      case 'payment_reminder': return 'text-purple-600 bg-purple-100';
      case 'welcome': return 'text-blue-600 bg-blue-100';
      case 'custom': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      case 'all': return <MessageSquare className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Notification Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Title and Message */}
          <div>
            <h4 className="text-xl font-medium text-gray-900 mb-2">{notification.title}</h4>
            <p className="text-gray-600">{notification.message}</p>
          </div>

          {/* Status and Type Badges */}
          <div className="flex flex-wrap gap-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(notification.status)}`}>
              {getStatusIcon(notification.status)}
              <span className="ml-1">{notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(notification.type)}`}>
              <Tag className="h-4 w-4 mr-1" />
              {notification.type.replace(/_/g, ' ').charAt(0).toUpperCase() + notification.type.replace(/_/g, ' ').slice(1)}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              {getChannelIcon(notification.channel)}
              <span className="ml-1">{notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <User className="inline h-4 w-4 mr-1" />
                Customer
              </label>
              <div className="text-gray-900">
                {typeof notification.customer === 'string' 
                  ? notification.customer 
                  : notification.customer?.name || 'Unknown'
                }
                {typeof notification.customer !== 'string' && notification.customer && (
                  <div className="text-sm text-gray-500">{notification.customer.email}</div>
                )}
              </div>
            </div>

            {/* Subscription */}
            {notification.subscription && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Tag className="inline h-4 w-4 mr-1" />
                  Subscription
                </label>
                <div className="text-gray-900">
                  {typeof notification.subscription === 'string' 
                    ? notification.subscription 
                    : `${notification.subscription.packageType} - $${notification.subscription.price}`
                  }
                </div>
              </div>
            )}

            {/* Scheduled For */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Scheduled For
              </label>
              <div className="text-gray-900">
                {notification.scheduledFor ? (
                  <div>
                    <div>{new Date(notification.scheduledFor).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{new Date(notification.scheduledFor).toLocaleTimeString()}</div>
                  </div>
                ) : (
                  <span className="text-gray-400">Immediate</span>
                )}
              </div>
            </div>

            {/* Sent At */}
            {notification.sentAt && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  <Send className="inline h-4 w-4 mr-1" />
                  Sent At
                </label>
                <div className="text-gray-900">
                  <div>{new Date(notification.sentAt).toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">{new Date(notification.sentAt).toLocaleTimeString()}</div>
                </div>
              </div>
            )}

            {/* Delivery Attempts */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Delivery Attempts
              </label>
              <div className="text-gray-900">{notification.deliveryAttempts}</div>
            </div>

            {/* Automated */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Automated
              </label>
              <div className="text-gray-900">
                {notification.isAutomated ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">Metadata</label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
              <div className="text-gray-900">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
              <div className="text-gray-900">
                {new Date(notification.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          {notification.status === 'pending' && (
            <button
              onClick={() => onSend(notification)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Now</span>
            </button>
          )}
          <button
            onClick={() => onEdit(notification)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(notification)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
