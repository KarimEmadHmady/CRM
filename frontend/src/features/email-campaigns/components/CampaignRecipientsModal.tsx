'use client';

import { useState } from 'react';
import { X, Users, Search, Download, Mail } from 'lucide-react';
import { EmailCampaign, Customer } from '../types/emailCampaign.types';

interface CampaignRecipientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: EmailCampaign | null;
  recipients: Customer[];
}

export function CampaignRecipientsModal({ 
  isOpen, 
  onClose, 
  campaign, 
  recipients 
}: CampaignRecipientsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen || !campaign) return null;

  const filteredRecipients = recipients.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Category', 'Notes'],
      ...filteredRecipients.map(customer => [
        customer.name,
        customer.email,
        customer.phone,
        customer.status,
        customer.category,
        customer.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_recipients.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[85vh] shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6 rounded-t-lg flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <div>
                <h2 className="text-xl font-bold">Campaign Recipients</h2>
                <p className="text-indigo-100 text-sm">{campaign.name}</p>
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
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          {/* Campaign Info & Stats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 flex-shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-600">Target Audience</span>
                <p className="text-lg font-semibold text-gray-900 capitalize">{campaign.targetAudience}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Recipients</span>
                <p className="text-lg font-semibold text-gray-900">{recipients.length}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Filtered Results</span>
                <p className="text-lg font-semibold text-gray-900">{filteredRecipients.length}</p>
              </div>
            </div>
          </div>

          {/* Search and Export */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 flex-shrink-0">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block text-gray-600 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Recipients List */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {filteredRecipients.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredRecipients.map((customer, index) => (
                    <div key={customer._id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-indigo-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.email}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{customer.phone}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              customer.status === 'subscribed' ? 'bg-green-100 text-green-800' :
                              customer.status === 'interested' ? 'bg-blue-100 text-blue-800' :
                              customer.status === 'expired' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {customer.status}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">{customer.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.targetAudience === 'custom' ? 'Custom' : 'Targeted'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? 'No recipients found matching your search.' : 'No recipients found.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <p className="text-sm text-blue-800">
                Showing {filteredRecipients.length} of {recipients.length} total recipients
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t rounded-b-lg flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Campaign: {campaign.name} • Status: <span className="capitalize">{campaign.status}</span>
            </p>
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
