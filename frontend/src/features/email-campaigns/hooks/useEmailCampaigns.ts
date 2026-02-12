import { useState, useEffect, useCallback } from 'react';
import { emailCampaignApi } from '../api/emailCampaign.api';
import { 
  EmailCampaign, 
  CreateEmailCampaignRequest, 
  UpdateEmailCampaignRequest,
  CampaignStatistics,
  TestEmailRequest,
  TargetRecipientsResponse,
  Customer
} from '../types/emailCampaign.types';

export const useEmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    draft: number;
    scheduled: number;
    active: number;
    completed: number;
  } | null>(null);

  // Fetch all campaigns
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.getAllEmailCampaigns();
      if (response.success) {
        setCampaigns(response.data);
        calculateStats(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create campaign
  const createCampaign = useCallback(async (campaignData: CreateEmailCampaignRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.createEmailCampaign(campaignData);
      if (response.success) {
        setCampaigns(prev => [response.data, ...prev]);
        calculateStats([response.data, ...campaigns]);
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Update campaign
  const updateCampaign = useCallback(async (id: string, campaignData: UpdateEmailCampaignRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.updateEmailCampaign(id, campaignData);
      if (response.success) {
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === id ? response.data : campaign
        ));
        calculateStats(campaigns.map(c => c._id === id ? response.data : c));
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Delete campaign
  const deleteCampaign = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await emailCampaignApi.deleteEmailCampaign(id);
      setCampaigns(prev => prev.filter(campaign => campaign._id !== id));
      calculateStats(campaigns.filter(c => c._id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Test campaign
  const testCampaign = useCallback(async (testData: TestEmailRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.testEmail(testData);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Launch campaign
  const launchCampaign = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.launchEmailCampaign(id);
      if (response.success) {
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === id ? response.data : campaign
        ));
        calculateStats(campaigns.map(c => c._id === id ? response.data : c));
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Schedule campaign
  const scheduleCampaign = useCallback(async (id: string, scheduledFor: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.scheduleEmailCampaign(id, scheduledFor);
      if (response.success) {
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === id ? response.data : campaign
        ));
        calculateStats(campaigns.map(c => c._id === id ? response.data : c));
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Pause campaign
  const pauseCampaign = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.pauseEmailCampaign(id);
      if (response.success) {
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === id ? response.data : campaign
        ));
        calculateStats(campaigns.map(c => c._id === id ? response.data : c));
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Resume campaign
  const resumeCampaign = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.resumeEmailCampaign(id);
      if (response.success) {
        setCampaigns(prev => prev.map(campaign => 
          campaign._id === id ? response.data : campaign
        ));
        calculateStats(campaigns.map(c => c._id === id ? response.data : c));
      }
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [campaigns]);

  // Get campaign statistics
  const getCampaignStatistics = useCallback(async (id: string): Promise<CampaignStatistics> => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.getCampaignStats(id);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to get statistics');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get target recipients
  const getTargetRecipients = useCallback(async (id: string): Promise<Customer[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailCampaignApi.getTargetRecipients(id);
      if (response.success) {
        return response.data;
      }
      throw new Error('Failed to get recipients');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((campaignList: EmailCampaign[]) => {
    const newStats = {
      total: campaignList.length,
      draft: campaignList.filter(c => c.status === 'draft').length,
      scheduled: campaignList.filter(c => c.status === 'scheduled').length,
      active: campaignList.filter(c => c.status === 'active').length,
      completed: campaignList.filter(c => c.status === 'completed').length
    };
    setStats(newStats);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    campaigns,
    loading,
    error,
    stats,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    testCampaign,
    launchCampaign,
    scheduleCampaign,
    pauseCampaign,
    resumeCampaign,
    getCampaignStatistics,
    getTargetRecipients,
    clearError
  };
};
