'use client';

import { useState } from 'react';
import { Search, Plus, Filter, Mail, Send, Pause, MoreHorizontal, Edit, Trash2, BarChart3, Play, Eye, Users, Calendar, Clock, RefreshCw } from 'lucide-react';
import { useEmailCampaigns } from '@/features/email-campaigns/hooks/useEmailCampaigns';
import { CreateEmailCampaignModal } from '@/features/email-campaigns/components/CreateEmailCampaignModal';
import { EditEmailCampaignModal } from '@/features/email-campaigns/components/EditEmailCampaignModal';
import { TestEmailModal } from '@/features/email-campaigns/components/TestEmailModal';
import { ViewTemplateModal } from '@/features/email-campaigns/components/ViewTemplateModal';
import { ScheduleCampaignModal } from '@/features/email-campaigns/components/ScheduleCampaignModal';
import { CampaignStatsModal } from '@/features/email-campaigns/components/CampaignStatsModal';
import { CampaignRecipientsModal } from '@/features/email-campaigns/components/CampaignRecipientsModal';
import { EmailCampaign, Customer } from '@/features/email-campaigns/types/emailCampaign.types';
import { ToastContainer } from '@/components/ui/Toast';

export function EmailCampaignsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showViewTemplateModal, setShowViewTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToEdit, setCampaignToEdit] = useState<EmailCampaign | null>(null);
  const [campaignToTest, setCampaignToTest] = useState<EmailCampaign | null>(null);
  const [campaignToView, setCampaignToView] = useState<EmailCampaign | null>(null);
  const [campaignToSchedule, setCampaignToSchedule] = useState<EmailCampaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<any>(null);
  const [campaignRecipients, setCampaignRecipients] = useState<Customer[]>([]);
  const [campaignToDelete, setCampaignToDelete] = useState<EmailCampaign | null>(null);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'warning' }[]>([]);

  const {
    campaigns,
    loading,
    error,
    stats,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    pauseCampaign,
    resumeCampaign,
    scheduleCampaign,
    getCampaignStatistics,
    getTargetRecipients,
    testCampaign,
    reuseCampaign,
    clearError
  } = useEmailCampaigns();

  const statuses = ['all', 'draft', 'scheduled', 'active', 'completed', 'paused'];

  // Filter campaigns based on current filters
  const getFilteredCampaigns = () => {
    let filtered = [...campaigns];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => (campaign.status || 'draft') === selectedStatus);
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

  const filteredCampaigns = getFilteredCampaigns();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOpenRate = (opened: number, sent: number) => {
    return sent > 0 ? Math.round((opened / sent) * 100) : 0;
  };

  const getClickRate = (clicked: number, sent: number) => {
    return sent > 0 ? Math.round((clicked / sent) * 100) : 0;
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      await createCampaign(campaignData);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateCampaign = async (id: string, campaignData: any) => {
    try {
      await updateCampaign(id, campaignData);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setCampaignToEdit(campaign);
    setShowEditModal(true);
  };

  const handleDeleteCampaign = (campaign: EmailCampaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteModal(true);
  };

  const confirmDeleteCampaign = async () => {
    if (campaignToDelete) {
      try {
        await deleteCampaign(campaignToDelete._id);
        setShowDeleteModal(false);
        setCampaignToDelete(null);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleLaunchCampaign = async (campaign: EmailCampaign) => {
    try {
      await launchCampaign(campaign._id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handlePauseCampaign = async (campaign: EmailCampaign) => {
    try {
      await pauseCampaign(campaign._id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleResumeCampaign = async (campaign: EmailCampaign) => {
    try {
      await resumeCampaign(campaign._id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleReuseCampaign = async (campaign: EmailCampaign) => {
    try {
      await reuseCampaign(campaign._id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleScheduleCampaign = (campaign: EmailCampaign) => {
    setCampaignToSchedule(campaign);
    setShowScheduleModal(true);
  };

  const handleViewStats = async (campaign: EmailCampaign) => {
    try {
      const stats = await getCampaignStatistics(campaign._id);
      setCampaignStats(stats);
      setShowStatsModal(true);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleViewRecipients = async (campaign: EmailCampaign) => {
    try {
      const recipients = await getTargetRecipients(campaign._id);
      setCampaignRecipients(recipients);
      setShowRecipientsModal(true);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleConfirmSchedule = async (scheduledDate: string) => {
    if (!campaignToSchedule) return;

    try {
      await scheduleCampaign(campaignToSchedule._id, scheduledDate);
      setShowScheduleModal(false);
      setCampaignToSchedule(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleTestCampaign = (campaign: EmailCampaign) => {
    setCampaignToTest(campaign);
    setShowTestModal(true);
  };

  const handleViewTemplate = (campaign: EmailCampaign) => {
    setCampaignToView(campaign);
    setShowViewTemplateModal(true);
  };

  const handleSendTestEmails = async (campaignId: string, testEmails: string[]) => {
    if (campaignToTest) {
      try {
        await testCampaign({
          campaignId: campaignId,
          testEmails: testEmails
        });
        setShowTestModal(false);
        setCampaignToTest(null);
        addToast('Test emails sent successfully!', 'success');
      } catch (error: any) {
        addToast('Failed to send test emails: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Email Campaigns</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Campaigns</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.total || campaigns.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Active Campaigns</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats?.active || campaigns.filter(c => c.status === 'active' || c.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Draft Campaigns</div>
          <div className="text-2xl font-bold text-gray-600">
            {stats?.draft || campaigns.filter(c => c.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Sent Campaigns</div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.completed || campaigns.filter(c => c.status === 'completed').length}
          </div>
        </div>
      </div>


      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

        {/* ── DESKTOP TABLE (hidden on mobile) ─────────────── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Click Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
                      <span className="text-gray-600">Loading campaigns...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Mail className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-600">No campaigns found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign._id || `campaign-${Math.random()}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{campaign.name || 'Untitled Campaign'}</div>
                      <div className="text-sm text-gray-500">{campaign.subject || 'No subject'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status || 'draft')}`}>
                        {(campaign.status || 'draft').charAt(0).toUpperCase() + (campaign.status || 'draft').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{(campaign.statistics?.sentCount || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {(campaign.statistics?.totalRecipients || 0) > 0
                          ? Math.round(((campaign.statistics?.sentCount || 0) / (campaign.statistics?.totalRecipients || 1)) * 100)
                          : 0}% sent
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getOpenRate(campaign.statistics?.openedCount || 0, campaign.statistics?.sentCount || 0)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getClickRate(campaign.statistics?.openedCount || 0, campaign.statistics?.sentCount || 0)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleViewTemplate(campaign)} className="text-gray-400 hover:text-blue-600" title="View Template"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleViewStats(campaign)} className="text-gray-400 hover:text-purple-600" title="Statistics">  <BarChart3 className="h-4 w-4" /></button>
                        <button onClick={() => handleViewRecipients(campaign)} className="text-gray-400 hover:text-indigo-600" title="Recipients">  <Users className="h-4 w-4" /></button>
                        <button onClick={() => handleTestCampaign(campaign)} className="text-gray-400 hover:text-gray-600" title="Test Email">  <Mail className="h-4 w-4" /></button>
                        <button onClick={() => handleEditCampaign(campaign)} className="text-gray-400 hover:text-gray-600" title="Edit">        <Edit className="h-4 w-4" /></button>
                        {((campaign.status || 'draft') === 'draft' || (campaign.status || 'draft') === 'paused') && (
                          <>
                            <button onClick={() => handleLaunchCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Launch">   <Send className="h-4 w-4" /></button>
                            <button onClick={() => handleScheduleCampaign(campaign)} className="text-gray-400 hover:text-blue-600" title="Schedule"> <Calendar className="h-4 w-4" /></button>
                            {(campaign.status || 'draft') === 'draft' && (
                              <button onClick={() => handleResumeCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Start"><Play className="h-4 w-4" /></button>
                            )}
                          </>
                        )}
                        {(campaign.status || 'draft') === 'active' && (
                          <button onClick={() => handlePauseCampaign(campaign)} className="text-gray-400 hover:text-yellow-600" title="Pause">  <Pause className="h-4 w-4" /></button>
                        )}
                        {(campaign.status || 'draft') === 'paused' && (
                          <button onClick={() => handleResumeCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Resume"> <Play className="h-4 w-4" /></button>
                        )}
                        {(campaign.status || 'draft') === 'completed' && (
                          <button onClick={() => handleReuseCampaign(campaign)} className="text-gray-400 hover:text-blue-600" title="Reuse">  <RefreshCw className="h-4 w-4" /></button>
                        )}
                        <button onClick={() => handleDeleteCampaign(campaign)} className="text-gray-400 hover:text-red-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
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
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm">Loading campaigns...</span>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-500">
              <Mail className="h-12 w-12 text-gray-300" />
              <p className="text-sm">No campaigns found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredCampaigns.map((campaign) => {
                const status = campaign.status || 'draft';
                const sent = campaign.statistics?.sentCount || 0;
                const total = campaign.statistics?.totalRecipients || 0;
                const opened = campaign.statistics?.openedCount || 0;
                const sentPct = total > 0 ? Math.round((sent / total) * 100) : 0;

                return (
                  <li key={campaign._id || `campaign-${Math.random()}`} className="p-4 hover:bg-gray-50 transition-colors">

                    {/* Row 1: name + status badge */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1">
                        {campaign.name || 'Untitled Campaign'}
                      </p>
                      <span className={`shrink-0 inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    {/* Row 2: subject */}
                    <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                      {campaign.subject || 'No subject'}
                    </p>

                    {/* Row 3: stats pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        <Users className="h-3 w-3" />
                        {sent.toLocaleString()} <span className="text-gray-400">({sentPct}%)</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        <Eye className="h-3 w-3" />
                        {getOpenRate(opened, sent)}% open
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                        <BarChart3 className="h-3 w-3" />
                        {getClickRate(opened, sent)}% click
                      </span>
                      <span className="ml-auto text-xs text-gray-400 self-center">
                        {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Row 4: action buttons */}
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                      {/* Always-visible actions */}
                      <button onClick={() => handleViewTemplate(campaign)} className="text-gray-400 hover:text-blue-600" title="View Template"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => handleViewStats(campaign)} className="text-gray-400 hover:text-purple-600" title="Statistics">  <BarChart3 className="h-4 w-4" /></button>
                      <button onClick={() => handleViewRecipients(campaign)} className="text-gray-400 hover:text-indigo-600" title="Recipients">  <Users className="h-4 w-4" /></button>
                      <button onClick={() => handleTestCampaign(campaign)} className="text-gray-400 hover:text-gray-600" title="Test Email">  <Mail className="h-4 w-4" /></button>
                      <button onClick={() => handleEditCampaign(campaign)} className="text-gray-400 hover:text-gray-600" title="Edit">        <Edit className="h-4 w-4" /></button>

                      {/* Status-conditional actions */}
                      {(status === 'draft' || status === 'paused') && (
                        <>
                          <button onClick={() => handleLaunchCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Launch">   <Send className="h-4 w-4" /></button>
                          <button onClick={() => handleScheduleCampaign(campaign)} className="text-gray-400 hover:text-blue-600" title="Schedule"> <Calendar className="h-4 w-4" /></button>
                          {status === 'draft' && (
                            <button onClick={() => handleResumeCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Start"><Play className="h-4 w-4" /></button>
                          )}
                        </>
                      )}
                      {status === 'active' && (
                        <button onClick={() => handlePauseCampaign(campaign)} className="text-gray-400 hover:text-yellow-600" title="Pause">  <Pause className="h-4 w-4" /></button>
                      )}
                      {status === 'paused' && (
                        <button onClick={() => handleResumeCampaign(campaign)} className="text-gray-400 hover:text-green-600" title="Resume"> <Play className="h-4 w-4" /></button>
                      )}
                      {status === 'completed' && (
                        <button onClick={() => handleReuseCampaign(campaign)} className="text-gray-400 hover:text-blue-600" title="Reuse">  <RefreshCw className="h-4 w-4" /></button>
                      )}

                      {/* Delete — pushed to end */}
                      <button onClick={() => handleDeleteCampaign(campaign)} className="ml-auto text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>

      {/* Create Campaign Modal */}
      <CreateEmailCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaign}
        loading={loading}
      />

      {/* Test Email Modal */}
      <TestEmailModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        campaign={campaignToTest}
        onTest={handleSendTestEmails}
        loading={loading}
      />

      {/* Edit Campaign Modal */}
      <EditEmailCampaignModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateCampaign}
        onPause={async () => {
          if (campaignToEdit) {
            await handlePauseCampaign(campaignToEdit);
          }
        }}
        onResume={async () => {
          if (campaignToEdit) {
            await handleResumeCampaign(campaignToEdit);
          }
        }}
        onLaunch={async () => {
          if (campaignToEdit) {
            await handleLaunchCampaign(campaignToEdit);
          }
        }}
        onSchedule={async () => {
          if (campaignToEdit) {
            handleScheduleCampaign(campaignToEdit);
          }
        }}
        campaign={campaignToEdit}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start mb-4">
              <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Email Campaign</h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold text-gray-900">{campaignToDelete.name}</span>?
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-6 ml-16">
              This action cannot be undone. The campaign will be permanently removed from the system.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCampaignToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCampaign}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Template Modal */}
      <ViewTemplateModal
        isOpen={showViewTemplateModal}
        onClose={() => setShowViewTemplateModal(false)}
        campaign={campaignToView}
      />

      {/* Schedule Campaign Modal */}
      <ScheduleCampaignModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        campaign={campaignToSchedule}
        onSchedule={handleConfirmSchedule}
        loading={loading}
      />

      {/* Campaign Stats Modal */}
      <CampaignStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        campaign={campaignToView}
        stats={campaignStats}
      />

      {/* Campaign Recipients Modal */}
      <CampaignRecipientsModal
        isOpen={showRecipientsModal}
        onClose={() => setShowRecipientsModal(false)}
        campaign={campaignToView}
        recipients={campaignRecipients}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
