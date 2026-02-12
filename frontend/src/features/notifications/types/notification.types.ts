export interface Notification {
  _id: string;
  customer: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  subscription?: string | {
    _id: string;
    packageType: string;
    price: number;
    endDate: string;
  };
  type: 'subscription_expiry' | 'payment_reminder' | 'welcome' | 'custom';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  deliveryAttempts: number;
  channel: 'email' | 'sms' | 'push' | 'all';
  isAutomated: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationData {
  customer: string;
  subscription?: string;
  type: 'subscription_expiry' | 'payment_reminder' | 'welcome' | 'custom';
  title: string;
  message: string;
  channel: 'email' | 'sms' | 'push' | 'all';
  scheduledFor?: string;
}

export interface UpdateNotificationData {
  type?: 'subscription_expiry' | 'payment_reminder' | 'welcome' | 'custom';
  title?: string;
  message?: string;
  status?: 'pending' | 'sent' | 'delivered' | 'failed';
  scheduledFor?: string;
  channel?: 'email' | 'sms' | 'push' | 'all';
  metadata?: Record<string, any>;
}

export interface NotificationFilters {
  status?: string;
  type?: string;
  channel?: string;
  customer?: string;
}

export interface NotificationStats {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  todaySent: number;
  scheduled: number;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
  message?: string;
}

export interface NotificationStatsResponse {
  success: boolean;
  data: NotificationStats;
  message?: string;
}
