'use client';

import { X, BarChart3, TrendingUp, Users, Mail, Eye, MousePointer } from 'lucide-react';
import { EmailCampaign } from '../types/emailCampaign.types';

interface CampaignStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  stats: any;
}

export function CampaignStatsModal({ 
  isOpen, 
  onClose, 
  campaign, 
  stats 
}: CampaignStatsModalProps) {
  if (!isOpen || !campaign || !stats) return null;

  const calculatePercentage = (value: number, total: number) => {
    if (!total || total === 0) return '0.0';
    return ((value / total) * 100).toFixed(1);
  };

  const openRate = calculatePercentage(stats.openedCount, stats.sentCount || stats.totalRecipients);
  const deliveryRate = calculatePercentage(stats.deliveredCount, stats.sentCount || stats.totalRecipients);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-t-lg flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Campaign Statistics</h2>
                <p className="text-purple-100 text-sm">{campaign.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Campaign Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Campaign Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Subject:</span>
                <p className="text-gray-900 font-medium truncate">{campaign.subject}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="text-gray-900 font-medium capitalize">{campaign.status}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalRecipients}</div>
              <div className="text-xs text-blue-600 font-medium">Total Recipients</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.sentCount}</div>
              <div className="text-xs text-green-600 font-medium">Sent</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.openedCount}</div>
              <div className="text-xs text-purple-600 font-medium">Opened ({openRate}%)</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.failedCount}</div>
              <div className="text-xs text-red-600 font-medium">Failed</div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Delivery Rate</span>
                  <span className="text-gray-900 font-medium">{deliveryRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${deliveryRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Open Rate</span>
                  <span className="text-gray-900 font-medium">{openRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${openRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Failure Rate</span>
                  <span className="text-gray-900 font-medium">
                    {calculatePercentage(stats.failedCount, stats.totalRecipients)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculatePercentage(stats.failedCount, stats.totalRecipients)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MousePointer className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">Click Rate</span>
              </div>
              <div className="text-xl font-bold text-indigo-600">
                {stats.deliveredCount > 0 ? calculatePercentage(stats.openedCount, stats.deliveredCount) : '0.0'}%
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Success Rate</span>
              </div>
              <div className="text-xl font-bold text-orange-600">
                {calculatePercentage(stats.deliveredCount, stats.totalRecipients)}%
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t rounded-b-lg flex-shrink-0">
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
