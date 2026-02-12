export interface EmailCampaignSettings {
  trackOpens: boolean;
  trackClicks: boolean;
  sendImmediately: boolean;
}

export interface CampaignStatistics {
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  failedCount: number;
}

export interface EmailCampaign {
  sentCount: number;
  _id: string;
  name: string;
  subject: string;
  template: string;
  content: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetAudience: 'all' | 'subscribed' | 'active' | 'inactive' | 'custom';
  customRecipients: string[];
  scheduledFor?: string;
  statistics: CampaignStatistics;
  settings: EmailCampaignSettings;
  createdBy: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateEmailCampaignRequest {
  name: string;
  subject: string;
  template: string;
  content: string;
  targetAudience: 'all' | 'subscribed' | 'active' | 'inactive' | 'custom';
  customRecipients?: string[];
  scheduledFor?: string;
  settings: EmailCampaignSettings;
  notes?: string;
  createdBy: string;
}

export interface UpdateEmailCampaignRequest {
  name?: string;
  subject?: string;
  template?: string;
  content?: string;
  targetAudience?: 'all' | 'subscribed' | 'active' | 'inactive' | 'custom';
  customRecipients?: string[];
  scheduledFor?: string;
  settings?: EmailCampaignSettings;
  notes?: string;
}

export interface EmailCampaignResponse {
  success: boolean;
  data: EmailCampaign;
}

export interface EmailCampaignsListResponse {
  success: boolean;
  data: EmailCampaign[];
}

export interface CampaignStatsResponse {
  success: boolean;
  data: CampaignStatistics;
}

export interface TestEmailRequest {
  campaignId: string;
  testEmails: string[];
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: string;
  notes: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TargetRecipientsResponse {
  success: boolean;
  data: Customer[];
}
