"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  TestTube, 
  Power,
  PowerOff,
  Mail,
  Send,
  XCircle,
  ArrowLeft,
  Server,
  Clock
  
} from 'lucide-react';
import { EmailConfig, EmailConfigFormData } from '../types/emailConfig.types';
import { useEmailConfig } from '../hooks/useEmailConfig';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatTimeAgo, validateEmailConfig } from '../utils/emailConfig.utils';

// CreateEmailConfigModal component
const CreateEmailConfigModal: React.FC<{
  onClose: () => void;
  config?: EmailConfig | null;
}> = ({ onClose, config }) => {
  const [formData, setFormData] = useState<EmailConfigFormData>({
    name: config?.name || '',
    provider: config?.provider || 'gmail',
    fromName: config?.fromName || '',
    fromEmail: config?.fromEmail || '',
    isActive: config?.isActive || false,
    gmail: {
      email: config?.gmail?.email || '',
      password: '' // Always empty for security - user must re-enter
    },
    smtp: {
      host: config?.smtp?.host || '',
      port: config?.smtp?.port || 587,
      secure: config?.smtp?.secure !== undefined ? config.smtp.secure : true,
      auth: {
        user: config?.smtp?.auth?.user || '',
        pass: '' // Always empty for security - user must re-enter
      }
    }
  });

  const { createConfig, updateConfig } = useEmailConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateEmailConfig(formData);
    if (!validation.isValid) {
      alert('Please fix the following errors:\n' + validation.errors.join('\n'));
      return;
    }

    try {
      const configData = {
        name: formData.name,
        provider: formData.provider,
        fromName: formData.fromName,
        fromEmail: formData.fromEmail,
        ...(formData.provider === 'gmail' 
          ? { gmail: formData.gmail }
          : { smtp: formData.smtp }
        )
      };

      if (config) {
        await updateConfig(config._id, configData);
      } else {
        await createConfig(configData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">
            {config ? 'Edit Email Configuration' : 'Create Email Configuration'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {config ? 'Update your email settings' : 'Configure a new email provider'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {config && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-amber-800">Security Notice</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    For your security, sensitive fields like passwords and authentication credentials are hidden. 
                    You only need to re-enter them if you want to change them.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Configuration Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Primary Gmail Account"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Provider
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value as 'gmail' | 'smtp' })}
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="gmail">Gmail</option>
              <option value="smtp">SMTP Server</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                From Name
              </label>
              <input
                type="text"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                placeholder="Your Company Name"
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                From Email Address
              </label>
              <input
                type="email"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                placeholder="noreply@example.com"
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
          </div>

          {formData.provider === 'gmail' ? (
            <div className="space-y-5 pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Gmail Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Gmail Email
                    {config && <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">••••••••@gmail.com</span>}
                  </label>
                  <input
                    type="email"
                    value={formData.gmail.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      gmail: { ...formData.gmail, email: e.target.value }
                    })}
                    placeholder={config ? "Enter new email or leave unchanged" : "your-email@gmail.com"}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required={!config}
                  />
                  {config && (
                    <p className="text-xs text-gray-500 mt-1">
                      For security, email is masked. Re-enter only if you want to change it.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Gmail App Password
                    {config && <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Hidden</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.gmail.password}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      gmail: { ...formData.gmail, password: e.target.value }
                    })}
                    placeholder={config ? "••••••••••••••••" : "••••••••••••••••"}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required={!config}
                  />
                  {config && (
                    <p className="text-xs text-gray-500 mt-1">
                      For security, password is hidden. You must re-enter it to save changes.
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Use an App Password from your Google Account settings for enhanced security
              </p>
            </div>
          ) : (
            <div className="space-y-5 pt-4 border-t border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">SMTP Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={formData.smtp.host}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      smtp: { ...formData.smtp, host: e.target.value }
                    })}
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.smtp.port}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      smtp: { ...formData.smtp, port: parseInt(e.target.value) }
                    })}
                    placeholder="587"
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="secure"
                  checked={formData.smtp.secure}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    smtp: { ...formData.smtp, secure: e.target.checked }
                  })}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <label htmlFor="secure" className="ml-2 text-sm font-medium text-gray-900">
                  Use SSL/TLS encryption
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    SMTP Username
                    {config && <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">••••••••</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.smtp.auth.user}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      smtp: { 
                        ...formData.smtp, 
                        auth: { ...formData.smtp.auth, user: e.target.value }
                      }
                    })}
                    placeholder={config ? "Enter new username or leave unchanged" : "smtp-username"}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required={!config}
                  />
                  {config && (
                    <p className="text-xs text-gray-500 mt-1">
                      For security, username is masked. Re-enter only if you want to change it.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    SMTP Password
                    {config && <span className="ml-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">Hidden</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.smtp.auth.pass}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      smtp: { 
                        ...formData.smtp, 
                        auth: { ...formData.smtp.auth, pass: e.target.value }
                      }
                    })}
                    placeholder={config ? "••••••••••••••••" : "••••••••••••••••"}
                    className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required={!config}
                  />
                  {config && (
                    <p className="text-xs text-gray-500 mt-1">
                      For security, password is hidden. You must re-enter it to save changes.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              {config ? 'Update Configuration' : 'Create Configuration'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// TestEmailModal component
const TestEmailModal: React.FC<{
  configId: string;
  onClose: () => void;
}> = ({ configId, onClose }) => {
  const [testData, setTestData] = useState({
    testEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const { testConfig } = useEmailConfig();

  const handleTest = async () => {
    if (!testData.testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setLoading(true);
    try {
      const result = await testConfig(configId, testData);
      if (result.success) {
        alert('Test email sent successfully!');
        onClose();
      } else {
        alert(`Failed to send test email: ${result.message}`);
      }
    } catch (error) {
      console.error('Error testing config:', error);
      alert('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Mail className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Test Email Configuration</h2>
              <p className="text-sm text-gray-600 mt-0.5">Send a test email to verify your setup</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Send Test Email To
            </label>
            <input
              type="email"
              value={testData.testEmail}
              onChange={(e) => setTestData({ testEmail: e.target.value })}
              placeholder="test@example.com"
              className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={handleTest}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Test Email
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component
export const EmailConfigListSimpleRefactored: React.FC = () => {
  const router = useRouter();
  const { configs, loading, deleteConfig, setActiveConfig, fetchConfigs, createConfig, updateConfig } = useEmailConfig();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<EmailConfig | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email configuration?')) {
      return;
    }

    const result = await deleteConfig(id);
    if (!result.success) {
      alert(result.error || 'Failed to delete configuration');
    }
  };

  const handleToggleActive = async (id: string) => {
    const result = await setActiveConfig(id);
    if (!result.success) {
      alert(result.error || 'Failed to set active configuration');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner 
        text="Loading email configurations..." 
        size='lg'
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Configuration</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your email sending configurations and monitor performance
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Configurations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{configs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Power className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {configs.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Send className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {configs.reduce((sum, c) => sum + c.statistics.totalSent, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {configs.reduce((sum, c) => sum + c.statistics.totalFailed, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Configurations List */}
        {configs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <div className="text-center max-w-md mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Email Configurations</h3>
              <p className="text-gray-600 mb-8">
                Configure your email settings to start sending campaigns and notifications to your customers.
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Configuration
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {configs.map((config) => (
              <div 
                key={config._id} 
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {config.provider === 'gmail' ? (
                          <Mail className="w-5 h-5 text-red-600" />
                        ) : (
                          <Server className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5 capitalize">{config.provider}</p>
                      </div>
                    </div>
                    
                    {config.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <Power className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                        <PowerOff className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{config.fromName}</p>
                        <p className="text-gray-500 truncate">{config.fromEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">
                        Last used {config.statistics.lastUsed ? formatTimeAgo(config.statistics.lastUsed) : 'never'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Send className="w-4 h-4 text-green-600" />
                        <p className="text-2xl font-bold text-gray-900">{config.statistics.totalSent}</p>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Emails Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <p className="text-2xl font-bold text-gray-900">{config.statistics.totalFailed}</p>
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Failed</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 flex gap-2">
                  <button
                    onClick={() => setEditingConfig(config)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => setShowTestModal(config._id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Test
                  </button>

                  <button
                    onClick={() => handleToggleActive(config._id)}
                    className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                      config.isActive
                        ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    title={config.isActive ? "Deactivate" : "Set as active"}
                  >
                    {config.isActive ? (
                      <div className="flex items-center gap-2 text-sm">
                        <PowerOff className="w-4 h-4" />
                        Deactivate
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Power className="w-4 h-4 text-green-600" />
                        Activate
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(config._id)}
                    className="px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {(showCreateModal || editingConfig) && (
          <CreateEmailConfigModal
            onClose={() => {
              setShowCreateModal(false);
              setEditingConfig(null);
              fetchConfigs(); // Refresh data after modal closes
            }}
            config={editingConfig}
          />
        )}

        {showTestModal && (
          <TestEmailModal
            configId={showTestModal}
            onClose={() => setShowTestModal(null)}
          />
        )}
      </div>
    </div>
  );
};