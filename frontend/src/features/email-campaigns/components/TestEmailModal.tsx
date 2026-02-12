'use client';

import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { EmailCampaign } from '../types/emailCampaign.types';

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  onTest: (campaignId: string, testEmails: string[]) => Promise<void>;
  loading?: boolean;
}

export function TestEmailModal({ isOpen, onClose, campaign, onTest, loading = false }: TestEmailModalProps) {
  const [testEmails, setTestEmails] = useState<string[]>(['']);
  const [isSending, setIsSending] = useState(false);

  const handleAddEmail = () => {
    setTestEmails([...testEmails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = testEmails.filter((_, i) => i !== index);
    setTestEmails(newEmails);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...testEmails];
    newEmails[index] = value;
    setTestEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEmails = testEmails.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      alert('Please add at least one email address');
      return;
    }

    try {
      setIsSending(true);
      await onTest(campaign!._id, validEmails);
      setIsSending(false);
      onClose();
      setTestEmails(['']);
    } catch (error: any) {
      setIsSending(false);
      alert('Failed to send test emails: ' + error.message);
    }
  };

  const handleClose = () => {
    setTestEmails(['']);
    setIsSending(false);
    onClose();
  };

  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Send Test Email</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Campaign Info */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-sm text-gray-600">Campaign:</div>
            <div className="font-medium text-gray-900">{campaign.name}</div>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-sm text-gray-600">Subject:</div>
            <div className="font-medium text-gray-900">{campaign.subject}</div>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-sm text-gray-600">Template:</div>
            <div className="font-medium text-gray-900 capitalize">{campaign.template}</div>
          </div>
        </div>

        {/* Test Emails Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Test Email Addresses
            </label>
            <div className="space-y-3">
              {testEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Enter test email address"
                  />
                  {testEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove email"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEmail}
                className="w-full px-3 py-2 text-blue-600 hover:text-blue-700 border border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Add Email Address
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || loading}
              className="px-4 py-2 text-white bg-gray-900 hover:bg-gray-500 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSending && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{isSending ? 'Sending Test Emails...' : 'Send Test Emails'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
