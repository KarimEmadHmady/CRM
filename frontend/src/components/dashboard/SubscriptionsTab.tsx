'use client';

import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Eye, CreditCard, RefreshCw, Calendar, Filter, CheckSquare } from 'lucide-react';
import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';
import { CreateSubscriptionModal } from '@/features/subscriptions/components/CreateSubscriptionModal';
import { EditSubscriptionModal } from '@/features/subscriptions/components/EditSubscriptionModal';
import { SubscriptionDetailsModal } from '@/features/subscriptions/components/SubscriptionDetailsModal';
import { RenewSubscriptionModal } from '@/features/subscriptions/components/RenewSubscriptionModal';
import { Subscription, CreateSubscriptionData, UpdateSubscriptionData } from '@/features/subscriptions/types/subscription.types';
import { ToastContainer } from '@/components/ui/Toast';

export function SubscriptionsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPackageType, setSelectedPackageType] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPaymentStatusModal, setShowPaymentStatusModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
  const [subscriptionToView, setSubscriptionToView] = useState<Subscription | null>(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);
  const [subscriptionToRenew, setSubscriptionToRenew] = useState<Subscription | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState('pending');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'warning' }[]>([]);

  const {
    subscriptions,
    loading,
    error,
    stats,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    bulkDeleteSubscriptions,
    updatePaymentStatus,
    renewSubscription,
    getActiveSubscriptions,
    getExpiredSubscriptions,
    getExpiringSoonSubscriptions,
    fetchSubscriptions,
    clearError
  } = useSubscriptions();

  const statuses = ['all', 'active', 'expired', 'expiring_soon'];
  const packageTypes = ['all', 'basic', 'premium', 'vip', 'custom'];
  const paymentStatuses = ['all', 'pending', 'paid', 'overdue', 'cancelled'];

  // Filter subscriptions based on current filters
  const getFilteredSubscriptions = () => {
    let filtered = [...subscriptions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(subscription => {
        const customerName = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer?.name || '';
        const customerEmail = typeof subscription.customer === 'string'
          ? ''
          : subscription.customer?.email || '';

        return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subscription.packageType.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'active') {
        filtered = filtered.filter(sub => sub.isActive);
      } else if (selectedStatus === 'expired') {
        filtered = filtered.filter(sub => new Date(sub.endDate) < new Date());
      } else if (selectedStatus === 'expiring_soon') {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(sub => {
          const endDate = new Date(sub.endDate);
          return endDate > today && endDate <= thirtyDaysFromNow;
        });
      }
    }

    // Apply package type filter
    if (selectedPackageType !== 'all') {
      filtered = filtered.filter(sub => sub.packageType === selectedPackageType);
    }

    // Apply payment status filter
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter(sub => sub.paymentStatus === selectedPaymentStatus);
    }

    return filtered;
  };

  const addToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  const handleCreateSubscription = async (subscriptionData: CreateSubscriptionData) => {
    try {
      await createSubscription(subscriptionData);
      // Refresh subscriptions so that customer field comes populated (name/email instead of raw ID)
      await fetchSubscriptions();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateSubscription = async (id: string, subscriptionData: UpdateSubscriptionData) => {
    try {
      await updateSubscription(id, subscriptionData);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setSubscriptionToEdit(subscription);
    setShowEditModal(true);
  };

  const handleViewSubscription = (subscription: Subscription) => {
    setSubscriptionToView(subscription);
    setShowDetailsModal(true);
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    setSubscriptionToDelete(subscription);
    setShowDeleteModal(true);
  };

  const confirmDeleteSubscription = async () => {
    if (subscriptionToDelete) {
      try {
        await deleteSubscription(subscriptionToDelete._id);
        setSubscriptionToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleRenewSubscription = (subscription: Subscription) => {
    setSubscriptionToRenew(subscription);
    setShowRenewModal(true);
  };

  const handleConfirmRenewal = async (newEndDate: string, price: number) => {
    if (subscriptionToRenew) {
      try {
        await renewSubscription(subscriptionToRenew._id, newEndDate, price);
        setShowRenewModal(false);
        setSubscriptionToRenew(null);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleUpdatePaymentStatusClick = (subscription: Subscription) => {
    setSubscriptionToView(subscription);
    setNewPaymentStatus(subscription.paymentStatus);
    setShowPaymentStatusModal(true);
  };

  const confirmUpdatePaymentStatus = async () => {
    if (subscriptionToView) {
      try {
        await updatePaymentStatus(subscriptionToView._id, newPaymentStatus);
        setShowPaymentStatusModal(false);
        setSubscriptionToView(null);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleSelectSubscription = (subscriptionId: string) => {
    setSelectedSubscriptions(prev =>
      prev.includes(subscriptionId)
        ? prev.filter(id => id !== subscriptionId)
        : [...prev, subscriptionId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredSubscriptions.map(sub => sub._id);
    if (selectedSubscriptions.length === filteredSubscriptions.length) {
      // If all are selected, unselect all
      setSelectedSubscriptions([]);
    } else {
      // If not all are selected, select all
      setSelectedSubscriptions(allIds);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscriptions.length === 0) {
      addToast('Please select at least one subscription to delete', 'warning');
      return;
    }

    setShowBulkDeleteModal(true);
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      case 'custom': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Subscriptions</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subscription</span>
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
          <div className="text-sm text-gray-600 mb-1">Total Subscriptions</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.total || subscriptions.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.active || subscriptions.filter(s => s.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Expired</div>
          <div className="text-2xl font-bold text-red-600">
            {stats?.expired || subscriptions.filter(s => isExpired(s.endDate)).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-900">
            EGP { (stats?.totalRevenue || subscriptions.reduce((sum, s) => sum + s.price, 0)).toLocaleString() }
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
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
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="expiring_soon">Expiring Soon</option>
        </select>
        <select
          value={selectedPackageType}
          onChange={(e) => setSelectedPackageType(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All Packages</option>
          {packageTypes.filter(type => type !== 'all').map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={selectedPaymentStatus}
          onChange={(e) => setSelectedPaymentStatus(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All Payment Status</option>
          {paymentStatuses.filter(status => status !== 'all').map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => getActiveSubscriptions()}
          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
        >
          Active Only
        </button>
        <button
          onClick={() => getExpiredSubscriptions()}
          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
        >
          Expired Only
        </button>
        <button
          onClick={() => getExpiringSoonSubscriptions()}
          className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors"
        >
          Expiring Soon
        </button>
        <button
          onClick={() => {
            setSelectedStatus('all');
            setSelectedPackageType('all');
            setSelectedPaymentStatus('all');
            setSearchTerm('');
            // Fetch all subscriptions to clear filters
            fetchSubscriptions();
          }}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Filters
        </button>
        {selectedSubscriptions.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedSubscriptions.length})
          </button>
        )}
      </div>

      {/* Subscriptions Table */}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        {/* ── DESKTOP TABLE (hidden on mobile) ─────────────── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span>Loading subscriptions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <CreditCard className="h-12 w-12 text-gray-300" />
                      <p>No subscriptions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <tr key={subscription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSubscriptions.includes(subscription._id)}
                        onChange={() => handleSelectSubscription(subscription._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.name || 'Unknown'}
                      </div>
                      {typeof subscription.customer !== 'string' && subscription.customer && (
                        <div className="text-sm text-gray-500">{subscription.customer.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPackageColor(subscription.packageType)}`}>
                        {subscription.packageType.charAt(0).toUpperCase() + subscription.packageType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      EGP {subscription.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {subscription.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {isExpiringSoon(subscription.endDate) && <div className="text-xs text-orange-600">Expiring Soon</div>}
                        {isExpired(subscription.endDate) && <div className="text-xs text-red-600">Expired</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(subscription.paymentStatus)}`}>
                        {subscription.paymentStatus.charAt(0).toUpperCase() + subscription.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{new Date(subscription.startDate).toLocaleDateString()}</div>
                      <div className="text-xs">to {new Date(subscription.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleViewSubscription(subscription)} className="text-gray-400 hover:text-gray-600" title="View Details">          <Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEditSubscription(subscription)} className="text-gray-400 hover:text-gray-600" title="Edit Subscription">     <Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleUpdatePaymentStatusClick(subscription)} className="text-gray-400 hover:text-blue-600" title="Update Payment Status"> <CreditCard className="h-4 w-4" /></button>
                        <button onClick={() => handleRenewSubscription(subscription)} className="text-gray-400 hover:text-green-600" title="Renew Subscription">    <RefreshCw className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteSubscription(subscription)} className="text-gray-400 hover:text-red-600" title="Delete Subscription">   <Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE CARDS (hidden on desktop) ─────────────── */}
        <div className="md:hidden">

          {/* Mobile select-all bar */}
          {filteredSubscriptions.length > 0 && !loading && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedSubscriptions.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">
                {selectedSubscriptions.length > 0 ? `${selectedSubscriptions.length} selected` : 'Select all'}
              </span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading subscriptions...</span>
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-500">
              <CreditCard className="h-12 w-12 text-gray-300" />
              <p className="text-sm">No subscriptions found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 space-y-4 p-4">
              {filteredSubscriptions.map((subscription) => {
                const customerName = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.name || 'Unknown';
                const customerEmail = typeof subscription.customer !== 'string' ? subscription.customer?.email : null;
                const expiring = isExpiringSoon(subscription.endDate);
                const expired = isExpired(subscription.endDate);

                return (
                  <li key={subscription._id} className="p-4 hover:bg-gray-50 transition-colors  bg-white rounded-lg border border-gray-200 shadow-sm">

                    {/* Row 1: checkbox + customer + active badge */}
                    <div className="flex items-start gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubscriptions.includes(subscription._id)}
                        onChange={() => handleSelectSubscription(subscription._id)}
                        className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">{customerName}</p>
                          <span className={`shrink-0 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {subscription.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {customerEmail && (
                          <p className="text-xs text-gray-400 truncate">{customerEmail}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: package + payment + price */}
                    <div className="ml-7 flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPackageColor(subscription.packageType)}`}>
                        {subscription.packageType.charAt(0).toUpperCase() + subscription.packageType.slice(1)}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getPaymentStatusColor(subscription.paymentStatus)}`}>
                        {subscription.paymentStatus.charAt(0).toUpperCase() + subscription.paymentStatus.slice(1)}
                      </span>
                      <span className="ml-auto text-sm font-semibold text-gray-800">EGP {subscription.price}</span>
                    </div>

                    {/* Row 3: period + expiry warnings */}
                    <div className="ml-7 flex items-center gap-2 mb-3">
                      <span className="text-xs text-gray-400">
                        {new Date(subscription.startDate).toLocaleDateString()} → {new Date(subscription.endDate).toLocaleDateString()}
                      </span>
                      {expiring && !expired && (
                        <span className="text-xs font-medium text-orange-600">· Expiring Soon</span>
                      )}
                      {expired && (
                        <span className="text-xs font-medium text-red-600">· Expired</span>
                      )}
                    </div>

                    {/* Row 4: actions */}
                    <div className="ml-7 flex items-center gap-3 pt-2 border-t border-gray-100">
                      <button onClick={() => handleViewSubscription(subscription)} className="text-gray-400 hover:text-gray-600" title="View Details">          <Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleEditSubscription(subscription)} className="text-gray-400 hover:text-gray-600" title="Edit">                  <Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleUpdatePaymentStatusClick(subscription)} className="text-gray-400 hover:text-blue-600" title="Update Payment">        <CreditCard className="h-4 w-4" /></button>
                      <button onClick={() => handleRenewSubscription(subscription)} className="text-gray-400 hover:text-green-600" title="Renew">                 <RefreshCw className="h-4 w-4" /></button>
                      <button onClick={() => handleDeleteSubscription(subscription)} className="ml-auto text-gray-400 hover:text-red-600" title="Delete">          <Trash2 className="h-4 w-4" /></button>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>

      {/* Create Subscription Modal */}
      <CreateSubscriptionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubscription}
        loading={loading}
      />

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateSubscription}
        subscription={subscriptionToEdit}
        loading={loading}
      />

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        subscription={subscriptionToView}
        onEdit={handleEditSubscription}
        onRenew={handleRenewSubscription}
        onUpdatePaymentStatus={handleUpdatePaymentStatusClick}
      />

      {/* Renew Subscription Modal */}
      {subscriptionToRenew && (
        <RenewSubscriptionModal
          isOpen={showRenewModal}
          onClose={() => {
            setShowRenewModal(false);
            setSubscriptionToRenew(null);
          }}
          onConfirm={handleConfirmRenewal}
          loading={loading}
          currentEndDate={subscriptionToRenew.endDate}
          currentPrice={subscriptionToRenew.price}
        />
      )}

      {/* Payment Status Update Modal */}
      {showPaymentStatusModal && subscriptionToView && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Payment Status</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Payment Status
              </label>
              <select
                value={newPaymentStatus}
                onChange={(e) => setNewPaymentStatus(e.target.value)}
                className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentStatusModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdatePaymentStatus}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && subscriptionToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Subscription</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this subscription for {typeof subscriptionToDelete.customer === 'string' ? subscriptionToDelete.customer : subscriptionToDelete.customer?.name}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSubscriptionToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Delete Subscriptions</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedSubscriptions.length} subscription(s)?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await bulkDeleteSubscriptions(selectedSubscriptions);
                    setShowBulkDeleteModal(false);
                  } catch (error) {
                    // Error is handled by hook
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
