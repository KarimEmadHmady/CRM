'use client';

import { X, CreditCard, Calendar, DollarSign, User, Package, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Subscription } from '../types/subscription.types';

interface SubscriptionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onEdit?: (subscription: Subscription) => void;
  onRenew?: (subscription: Subscription) => void;
  onUpdatePaymentStatus?: (subscription: Subscription) => void;
}

export function SubscriptionDetailsModal({ 
  isOpen, 
  onClose, 
  subscription, 
  onEdit,
  onRenew,
  onUpdatePaymentStatus
}: SubscriptionDetailsModalProps) {
  if (!isOpen || !subscription) return null;

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

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer': return <DollarSign className="h-4 w-4" />;
      case 'cash': return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const isExpiringSoon = () => {
    if (!subscription.endDate) return false;
    const endDate = new Date(subscription.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    if (!subscription.endDate) return false;
    return new Date(subscription.endDate) < new Date();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Subscription Details</h2>
                <p className="text-gray-300 mt-1">
                  {typeof subscription.customer === 'string' 
                    ? subscription.customer 
                    : subscription.customer?.name || 'Unknown Customer'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPackageColor(subscription.packageType)}`}>
              {subscription.packageType.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(subscription.paymentStatus)}`}>
              {subscription.paymentStatus.toUpperCase()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {subscription.isActive ? 'ACTIVE' : 'INACTIVE'}
            </span>
            {isExpiringSoon() && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                EXPIRING SOON
              </span>
            )}
            {isExpired() && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                EXPIRED
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Customer ID</label>
                    <p className="text-gray-900 font-medium">
                      {typeof subscription.customer === 'string' 
                        ? subscription.customer 
                        : subscription.customer?._id || 'N/A'
                      }
                    </p>
                  </div>
                  {typeof subscription.customer !== 'string' && subscription.customer && (
                    <>
                      <div>
                        <label className="text-sm text-gray-600">Name</label>
                        <p className="text-gray-900 font-medium">{subscription.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <p className="text-gray-900 font-medium">{subscription.customer.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Package Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Package Type</label>
                    <p className="text-gray-900 font-medium capitalize">{subscription.packageType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Price</label>
                    <p className="text-gray-900 font-medium">${subscription.price}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Auto Renew</label>
                    <p className="text-gray-900 font-medium">
                      {subscription.autoRenew ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Payment Method</label>
                    <p className="text-gray-900 font-medium capitalize flex items-center">
                      {getPaymentMethodIcon(subscription.paymentMethod)}
                      <span className="ml-2">{subscription.paymentMethod.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Payment Status</label>
                    <p className="text-gray-900 font-medium capitalize">{subscription.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Dates & Actions */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-gray-600">Start:</span>
                    <span className="ml-auto text-gray-900">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {isExpired() ? (
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    ) : isExpiringSoon() ? (
                      <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    )}
                    <span className="text-gray-600">End:</span>
                    <span className="ml-auto text-gray-900">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {subscription.nextPaymentDate && (
                    <div className="flex items-center text-sm">
                      <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="ml-auto text-gray-900">
                        {new Date(subscription.nextPaymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-auto text-gray-900">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {subscription.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <p className="text-gray-700 text-sm">{subscription.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(subscription)}
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Edit Subscription
                    </button>
                  )}
                  {onUpdatePaymentStatus && (
                    <button
                      onClick={() => onUpdatePaymentStatus(subscription)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Payment Status
                    </button>
                  )}
                  {onRenew && (
                    <button
                      onClick={() => onRenew(subscription)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Renew Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
