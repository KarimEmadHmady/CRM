"use client";
import { useState, useEffect } from 'react';
import { EmailConfig } from '../types/emailConfig.types';
import { emailConfigApi } from '../api/emailConfig.api';

export const useEmailConfig = () => {
  const [configs, setConfigs] = useState<EmailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await emailConfigApi.getAllConfigs();
      if (result.success) {
        setConfigs(result.data);
      } else {
        setError('Failed to fetch email configurations');
      }
    } catch (error) {
      setError('An error occurred while fetching configurations');
    } finally {
      setLoading(false);
    }
  };

  const createConfig = async (configData: any) => {
    try {
      const result = await emailConfigApi.createConfig(configData);
      if (result.success) {
        await fetchConfigs();
        return { success: true, data: result.data };
      }
      return { success: false, error: 'Failed to create configuration' };
    } catch (error) {
      return { success: false, error: 'An error occurred while creating configuration' };
    }
  };

  const updateConfig = async (id: string, configData: any) => {
    try {
      const result = await emailConfigApi.updateConfig(id, configData);
      if (result.success) {
        await fetchConfigs();
        return { success: true, data: result.data };
      }
      return { success: false, error: 'Failed to update configuration' };
    } catch (error) {
      return { success: false, error: 'An error occurred while updating configuration' };
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const result = await emailConfigApi.deleteConfig(id);
      if (result.success) {
        await fetchConfigs();
        return { success: true };
      }
      return { success: false, error: 'Failed to delete configuration' };
    } catch (error) {
      return { success: false, error: 'An error occurred while deleting configuration' };
    }
  };

  const setActiveConfig = async (id: string) => {
    try {
      const result = await emailConfigApi.setActiveConfig(id);
      if (result.success) {
        await fetchConfigs();
        return { success: true };
      }
      return { success: false, error: 'Failed to set active configuration' };
    } catch (error) {
      return { success: false, error: 'An error occurred while setting active configuration' };
    }
  };

  const testConfig = async (id: string, testData: any) => {
    try {
      const result = await emailConfigApi.testConfig(id, testData);
      return result;
    } catch (error) {
      return { success: false, message: 'An error occurred while testing configuration' };
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  return {
    configs,
    loading,
    error,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    setActiveConfig,
    testConfig
  };
};
