'use client';

import { X, Mail, Users, Calendar, Settings, BarChart3, Clock, Send } from 'lucide-react';
import { EmailCampaign } from '../types/emailCampaign.types';

interface ViewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
}

export function ViewTemplateModal({ isOpen, onClose, campaign }: ViewTemplateModalProps) {
  if (!isOpen || !campaign) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': case 'sending': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'bg-indigo-100 text-indigo-800';
      case 'subscribed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-orange-100 text-orange-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">{campaign.name}</h2>
                <p className="text-blue-100 mt-1">Template Details & Configuration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Status & Audience */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Campaign Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAudienceColor(campaign.targetAudience)}`}>
                    Target: {campaign.targetAudience.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Email Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Subject</label>
                    <p className="text-gray-900 mt-1 font-medium">{campaign.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Template</label>
                    <p className="text-gray-900 mt-1 capitalize">{campaign.template}</p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Campaign Settings
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Track Opens</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.settings.trackOpens ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {campaign.settings.trackOpens ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Track Clicks</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.settings.trackClicks ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {campaign.settings.trackClicks ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Send Immediately</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      campaign.settings.sendImmediately ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {campaign.settings.sendImmediately ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Timeline
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-auto text-gray-900">
                      {new Date(campaign.createdAt).toLocaleDateString()} {new Date(campaign.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-auto text-gray-900">
                      {new Date(campaign.updatedAt).toLocaleDateString()} {new Date(campaign.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {campaign.scheduledFor && (
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="ml-auto text-gray-900">
                        {new Date(campaign.scheduledFor).toLocaleDateString()} {new Date(campaign.scheduledFor).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Content & Stats */}
            <div className="space-y-6">
              {/* Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{campaign.statistics.totalRecipients}</div>
                    <div className="text-xs text-gray-600">Total Recipients</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{campaign.statistics.sentCount}</div>
                    <div className="text-xs text-gray-600">Sent</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{campaign.statistics.deliveredCount}</div>
                    <div className="text-xs text-gray-600">Delivered</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-600">{campaign.statistics.openedCount}</div>
                    <div className="text-xs text-gray-600">Opened</div>
                  </div>
                </div>
              </div>

              {/* Email Content Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Content Preview
                </h3>
                <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                    {campaign.content}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created By</label>
                    <p className="text-gray-900 mt-1">{campaign.createdBy}</p>
                  </div>
                  {campaign.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <p className="text-gray-900 mt-1">{campaign.notes}</p>
                    </div>
                  )}
                  {campaign.customRecipients && campaign.customRecipients.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Custom Recipients</label>
                      <p className="text-gray-900 mt-1">{campaign.customRecipients.length} recipients</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
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
