'use client';
 
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Send, Calendar, Filter, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { CreateNotificationModal } from '@/features/notifications/components/CreateNotificationModal';
import { EditNotificationModal } from '@/features/notifications/components/EditNotificationModal';
import { NotificationDetailsModal } from '@/features/notifications/components/NotificationDetailsModal';
import { Notification, CreateNotificationData, UpdateNotificationData } from '@/features/notifications/types/notification.types';
 
export function NotificationsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [notificationToEdit, setNotificationToEdit] = useState<Notification | null>(null);
  const [notificationToView, setNotificationToView] = useState<Notification | null>(null);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
 
  const {
    notifications,
    loading,
    error,
    stats,
    createNotification,
    updateNotification,
    deleteNotification,
    sendNotification,
    getPendingNotifications,
    createSubscriptionExpiryNotifications,
    createPaymentReminderNotifications,
    clearError
  } = useNotifications();
 
  const statuses = ['all', 'pending', 'sent', 'delivered', 'failed'];
  const types = ['all', 'subscription_expiry', 'payment_reminder', 'welcome', 'custom'];
  const channels = ['all', 'email', 'sms', 'push', 'all'];
 
  // Filter notifications based on current filters
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
 
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification => {
        const customerName = typeof notification.customer === 'string' 
          ? notification.customer 
          : notification.customer?.name || '';
        const customerEmail = typeof notification.customer === 'string' 
          ? '' 
          : notification.customer?.email || '';
 
        return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
               notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
 
    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(notification => notification.status === selectedStatus);
    }
 
    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType);
    }
 
    // Apply channel filter
    if (selectedChannel !== 'all') {
      filtered = filtered.filter(notification => notification.channel === selectedChannel);
    }
 
    return filtered;
  };
 
  const filteredNotifications = getFilteredNotifications();
 
  const handleCreateNotification = async (notificationData: CreateNotificationData) => {
    try {
      await createNotification(notificationData);
    } catch (error) {
      // Error is handled by the hook
    }
  };
 
  const handleUpdateNotification = async (id: string, notificationData: UpdateNotificationData) => {
    try {
      await updateNotification(id, notificationData);
    } catch (error) {
      // Error is handled by the hook
    }
  };
 
  const handleEditNotification = (notification: Notification) => {
    setNotificationToEdit(notification);
    setShowEditModal(true);
  };
 
  const handleViewNotification = (notification: Notification) => {
    setNotificationToView(notification);
    setShowDetailsModal(true);
  };
 
  const handleDeleteNotification = (notification: Notification) => {
    setNotificationToDelete(notification);
    if (confirm(`Are you sure you want to delete this notification "${notification.title}"?`)) {
      confirmDeleteNotification();
    }
  };
 
  const confirmDeleteNotification = async () => {
    if (notificationToDelete) {
      try {
        await deleteNotification(notificationToDelete._id);
        setNotificationToDelete(null);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };
 
  const handleSendNotification = async (notification: Notification) => {
    try {
      await sendNotification(notification._id);
      alert('Notification sent successfully!');
    } catch (error) {
      // Error is handled by the hook
    }
  };
 
  const handleCreateSubscriptionExpiryNotifications = async () => {
    try {
      await createSubscriptionExpiryNotifications();
      alert('Subscription expiry notifications created successfully!');
    } catch (error) {
      // Error is handled by the hook
    }
  };
 
  const handleCreatePaymentReminderNotifications = async () => {
    try {
      await createPaymentReminderNotifications();
      alert('Payment reminder notifications created successfully!');
    } catch (error) {
      // Error is handled by the hook
    }
  };
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
 
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription_expiry': return 'bg-orange-100 text-orange-800';
      case 'payment_reminder': return 'bg-purple-100 text-purple-800';
      case 'welcome': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
 
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Notifications</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Notification</span>
        </button>
      </div>
 
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-red-800">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}
 
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Notifications</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.total || notifications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats?.pending || notifications.filter(n => n.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Sent</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.sent || notifications.filter(n => n.status === 'sent').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Delivered</div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.delivered || notifications.filter(n => n.status === 'delivered').length}
          </div>
        </div>
      </div>
 
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          {statuses.filter(status => status !== 'all').map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          {types.filter(type => type !== 'all').map(type => (
            <option key={type} value={type}>
              {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All Channels</option>
          {channels.filter(channel => channel !== 'all').map(channel => (
            <option key={channel} value={channel}>
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </option>
          ))}
        </select>
      </div>
 
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => getPendingNotifications()}
          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          Pending Only
        </button>
        <button
          onClick={handleCreateSubscriptionExpiryNotifications}
          className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
        >
          Create Expiry Notifications
        </button>
        <button
          onClick={handleCreatePaymentReminderNotifications}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
        >
          Create Payment Reminders
        </button>
        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedType('all');
            setSelectedChannel('all');
            setSearchTerm('');
          }}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
      </div>
 
      {/* Notifications Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600" />
                      <span>Loading notifications...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Bell className="h-12 w-12 text-gray-300" />
                      <p>No notifications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr key={notification._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {typeof notification.customer === 'string' 
                            ? notification.customer 
                            : notification.customer?.name || 'Unknown'
                          }
                        </div>
                        {typeof notification.customer !== 'string' && notification.customer && (
                          <div className="text-sm text-gray-500">{notification.customer.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{notification.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type.replace(/_/g, ' ').charAt(0).toUpperCase() + notification.type.replace(/_/g, ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getChannelIcon(notification.channel)}
                        <span className="text-sm text-gray-600">
                          {notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notification.scheduledFor ? (
                        <div>
                          <div>{new Date(notification.scheduledFor).toLocaleDateString()}</div>
                          <div className="text-xs">{new Date(notification.scheduledFor).toLocaleTimeString()}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Immediate</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewNotification(notification)}
                          className="text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditNotification(notification)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit Notification"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {notification.status === 'pending' && (
                          <button
                            onClick={() => handleSendNotification(notification)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Send Now"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* Create Notification Modal */}
      <CreateNotificationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateNotification}
        loading={loading}
      />
 
      {/* Edit Notification Modal */}
      <EditNotificationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateNotification}
        notification={notificationToEdit}
        loading={loading}
      />
 
      {/* Notification Details Modal */}
      <NotificationDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        notification={notificationToView}
        onEdit={handleEditNotification}
        onSend={handleSendNotification}
        onDelete={handleDeleteNotification}
      />
    </div>
  );
}