'use client';

import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { EmailCampaign } from '../types/emailCampaign.types';

interface ScheduleCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  onSchedule: (scheduledDate: string) => void;
  loading?: boolean;
}

export function ScheduleCampaignModal({ 
  isOpen, 
  onClose, 
  campaign, 
  onSchedule, 
  loading = false 
}: ScheduleCampaignModalProps) {
  const [scheduledDate, setScheduledDate] = useState('');

  if (!isOpen || !campaign) return null;

  // Set default date to tomorrow at 9 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  const defaultDateTime = tomorrow.toISOString().slice(0, 16);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduledDate) {
      onSchedule(new Date(scheduledDate).toISOString());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Schedule Campaign</h2>
                <p className="text-blue-100 text-sm">{campaign.name}</p>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Date & Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                value={scheduledDate || defaultDateTime}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select when you want this campaign to be sent automatically.
            </p>
          </div>

          {/* Campaign Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Campaign Details</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subject:</span>
                <span className="text-gray-900 font-medium truncate ml-2">{campaign.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Template:</span>
                <span className="text-gray-900 capitalize">{campaign.template}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Audience:</span>
                <span className="text-gray-900 capitalize">{campaign.targetAudience}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
