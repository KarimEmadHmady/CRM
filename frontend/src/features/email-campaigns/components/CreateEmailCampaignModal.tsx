'use client';

import { useState } from 'react';
import { X, Mail, Calendar, Send, Users, Settings, FileText } from 'lucide-react';
import { CreateEmailCampaignRequest } from '../types/emailCampaign.types';

interface CreateEmailCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: CreateEmailCampaignRequest) => Promise<void>;
  loading?: boolean;
}

const templates = [
  { value: 'welcome', label: 'Welcome' },
  { value: 'expiry_reminder', label: 'Expiry Reminder' },
  { value: 'payment_reminder', label: 'Payment Reminder' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'survey', label: 'Survey' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'custom', label: 'Custom' }
];

const audiences = [
  { value: 'all', label: 'All Customers' },
  { value: 'subscribed', label: 'Subscribed Customers' },
  { value: 'active', label: 'Active Customers' },
  { value: 'inactive', label: 'Inactive Customers' },
  { value: 'custom', label: 'Custom Recipients' }
];

export function CreateEmailCampaignModal({ isOpen, onClose, onSubmit, loading = false }: CreateEmailCampaignModalProps) {
  const [formData, setFormData] = useState<CreateEmailCampaignRequest>({
    name: '',
    subject: '',
    template: 'promotion',
    content: '',
    targetAudience: 'subscribed',
    customRecipients: [],
    settings: {
      trackOpens: true,
      trackClicks: true,
      sendImmediately: true
    },
    notes: '',
    createdBy: 'admin' // Add createdBy field
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.targetAudience === 'custom' && (!formData.customRecipients || formData.customRecipients.length === 0)) {
      newErrors.customRecipients = 'At least one recipient is required for custom audience';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleChange = (field: keyof CreateEmailCampaignRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSettingsChange = (field: keyof CreateEmailCampaignRequest['settings']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: e.target.checked
      }
    }));
  };

  const handleCustomRecipientsChange = (value: string) => {
    const emails = value.split(',').map(email => email.trim()).filter(email => email);
    setFormData(prev => ({
      ...prev,
      customRecipients: emails || []
    }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      subject: '',
      template: 'promotion',
      content: '',
      targetAudience: 'subscribed',
      customRecipients: [],
      settings: {
        trackOpens: true,
        trackClicks: true,
        sendImmediately: true
      },
      notes: '',
      createdBy: 'admin' // Reset createdBy field
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Email Campaign</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    className={`w-full pl-10 pr-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter campaign name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={handleChange('subject')}
                    className={`w-full pl-10 pr-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter email subject"
                  />
                </div>
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              {/* Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={formData.template}
                  onChange={handleChange('template')}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                >
                  {templates.map(template => (
                    <option key={template.value} value={template.value}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={formData.targetAudience}
                    onChange={handleChange('targetAudience')}
                    className="w-full pl-10 pr-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    {audiences.map(audience => (
                      <option key={audience.value} value={audience.value}>
                        {audience.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Recipients */}
              {formData.targetAudience === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Recipients (comma-separated emails)
                  </label>
                  <textarea
                    value={formData.customRecipients?.join(', ') || ''}
                    onChange={(e) => handleCustomRecipientsChange(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                      errors.customRecipients ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="email1@example.com, email2@example.com"
                  />
                  {errors.customRecipients && <p className="text-red-500 text-xs mt-1">{errors.customRecipients}</p>}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content
                </label>
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      <strong>Personalization:</strong> You can use the following placeholders in your email content:
                    </p>
                    <div className="space-y-1 text-xs text-blue-700">
                      <p><code className="bg-white px-2 py-1 rounded">{'{{name}}'}</code> - Customer's full name</p>
                      <p><code className="bg-white px-2 py-1 rounded">{'{{email}}'}</code> - Customer's email address</p>
                      <p><code className="bg-white px-2 py-1 rounded">{'{{phone}}'}</code> - Customer's phone number</p>
                      <p><code className="bg-white px-2 py-1 rounded">{'{{category}}'}</code> - Customer's category</p>
                      <p><code className="bg-white px-2 py-1 rounded">{'{{status}}'}</code> - Customer's status</p>
                    </div>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={handleChange('content')}
                    rows={8}
                    className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none ${
                      errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Dear {{name}},&#10;&#10;Your email content here...&#10;&#10;Best regards"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{{name}}'} as placeholder for customer name
                  </p>
                  {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="Additional notes about this campaign..."
                />
              </div>

              {/* Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Settings className="inline h-4 w-4 mr-1" />
                  Campaign Settings
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.trackOpens}
                      onChange={handleSettingsChange('trackOpens')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Track email opens</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.trackClicks}
                      onChange={handleSettingsChange('trackClicks')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Track email clicks</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.sendImmediately}
                      onChange={handleSettingsChange('sendImmediately')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Send immediately</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              )}
              <span>Create Campaign</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
