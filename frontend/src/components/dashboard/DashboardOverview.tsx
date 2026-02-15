'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  UserCheck, 
  Mail, 
  Send, 
  Bell, 
  CreditCard, 
  TrendingUp,
  Calendar,
  Activity,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { useEmailCampaigns } from '@/features/email-campaigns/hooks/useEmailCampaigns';
import { customerApi } from '@/features/customers/api/customer.api';
import { notificationApi } from '@/features/notifications/api/notification.api';
import { subscriptionApi } from '@/features/subscriptions/api/subscription.api';
import { emailCampaignApi } from '@/features/email-campaigns/api/emailCampaign.api';
import { usersApi } from '@/features/auth/api/users.api';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  customers: {
    total: number;
    subscribed: number;
    interested: number;
    expired: number;
    notInterested: number;
    totalSpent: number;
  };
  campaigns: {
    total: number;
    active: number;
    sentThisMonth: number;
    totalSent: number;
  };
  notifications: {
    total: number;
    pending: number;
    sent: number;
    delivered: number;
    failed: number;
  };
  subscriptions: {
    total: number;
    active: number;
    expired: number;
    expiringSoon: number;
    totalRevenue: number;
  };
}

interface ActivityItem {
  id: string;
  type: 'customer' | 'notification' | 'subscription' | 'campaign' | 'user';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, newThisMonth: 0 },
    customers: { total: 0, subscribed: 0, interested: 0, expired: 0, notInterested: 0, totalSpent: 0 },
    campaigns: { total: 0, active: 0, sentThisMonth: 0, totalSent: 0 },
    notifications: { total: 0, pending: 0, sent: 0, delivered: 0, failed: 0 },
    subscriptions: { total: 0, active: 0, expired: 0, expiringSoon: 0, totalRevenue: 0 }
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  const { user } = useAuth();
  const { customers, fetchCustomers } = useCustomers();
  const { campaigns } = useEmailCampaigns();

  // Utility function to format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Function to generate activities from real data
  const generateActivities = (
    notificationsData: any[],
    campaignsData: any[],
    usersData: any[],
    customerStats: any,
    subscriptionStats: any
  ): ActivityItem[] => {
    const activities: ActivityItem[] = [];
    const now = new Date();

    // Add recent notifications as activities
    const recentNotifications = (notificationsData || [])
      .filter((n: any) => n.createdAt && new Date(n.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000))
      .slice(0, 3);

    recentNotifications.forEach((notification: any) => {
      activities.push({
        id: `notification-${notification._id}`,
        type: 'notification',
        title: `Notification ${notification.status}`,
        description: `${notification.type} notification ${notification.status === 'sent' ? 'sent to' : 'for'} ${notification.customer?.email || 'customer'}`,
        timestamp: new Date(notification.createdAt),
        icon: 'Bell',
        color: notification.status === 'sent' ? 'green' : notification.status === 'pending' ? 'yellow' : 'red'
      });
    });

    // Add recent campaigns as activities
    const recentCampaigns = (campaignsData || [])
      .filter((c: any) => c.createdAt && new Date(c.createdAt) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
      .slice(0, 2);

    recentCampaigns.forEach((campaign: any) => {
      activities.push({
        id: `campaign-${campaign._id}`,
        type: 'campaign',
        title: `Email Campaign "${campaign.name}"`,
        description: `Campaign ${campaign.status} with ${campaign.statistics?.sentCount || 0} emails sent`,
        timestamp: new Date(campaign.createdAt),
        icon: 'Mail',
        color: campaign.status === 'active' ? 'blue' : 'gray'
      });
    });

    // Add subscription summary as activity
    if (subscriptionStats?.expiringSoon > 0) {
      activities.push({
        id: 'subscription-expiring',
        type: 'subscription',
        title: 'Subscriptions Expiring Soon',
        description: `${subscriptionStats.expiringSoon} subscriptions need attention`,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'AlertCircle',
        color: 'orange'
      });
    }

    // Add customer summary as activity
    if (customerStats?.subscribed > 0) {
      activities.push({
        id: 'customer-summary',
        type: 'customer',
        title: 'Customer Activity',
        description: `${customerStats.subscribed} subscribed customers this period`,
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: 'Target',
        color: 'blue'
      });
    }

    // Add system status
    activities.push({
      id: 'system-status',
      type: 'user',
      title: 'System Status',
      description: `All systems operational with ${usersData?.length || 0} active users`,
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      icon: 'CheckCircle',
      color: 'green'
    });

    // Sort by timestamp (most recent first) and limit to 6 items
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (hasLoadedRef.current) {
        console.log('⚠️ Dashboard already loaded, skipping...');
        return;
      }

      try {
        setLoading(true);
        console.log('📊 Loading dashboard data from real APIs...');
        
        hasLoadedRef.current = true;

        const [
          customerStatsResponse,
          notificationsResponse,
          subscriptionStatsResponse,
          emailCampaignsResponse,
          notificationStatsResponse,
          usersResponse
        ] = await Promise.all([
          customerApi.getCustomerStats(),
          notificationApi.getAllNotifications(),
          subscriptionApi.getSubscriptionStats(),
          emailCampaignApi.getAllEmailCampaigns(),
          notificationApi.getNotificationStats(),
          usersApi.getAllUsers()
        ]);


        const customerStats = customerStatsResponse.data;
        const subscriptionStats = subscriptionStatsResponse.data;
        const campaignsData = emailCampaignsResponse.data || [];
        const notificationStats = notificationStatsResponse.data;
        const notificationsData = notificationsResponse.data;
        const usersData = Array.isArray(usersResponse) ? usersResponse : [];

        const totalCampaigns = campaignsData.length || 0;
        const activeCampaigns = campaignsData.filter((c: any) => c.status === 'active').length || 0;
        const totalSent = campaignsData.reduce((sum: number, c: any) => sum + (c.statistics?.sentCount || 0), 0);
        const totalUsers = usersData.length;
        const activeUsers = usersData.filter((u: any) => u.isActive).length;

        // Generate activities from real data
        const generatedActivities = generateActivities(
          notificationsData,
          campaignsData,
          usersData,
          customerStats,
          subscriptionStats
        );

        setStats({
          users: {
            total: totalUsers,
            active: activeUsers,
            newThisMonth: 0
          },
          customers: {
            total: customerStats?.total || 0,
            subscribed: customerStats?.subscribed || 0,
            interested: customerStats?.interested || 0,
            expired: customerStats?.expired || 0,
            notInterested: customerStats?.notInterested || 0,
            totalSpent: customerStats?.totalSpent || 0
          },
          campaigns: {
            total: totalCampaigns,
            active: activeCampaigns,
            sentThisMonth: 0,
            totalSent: totalSent
          },
          notifications: {
            total: notificationStats?.total || notificationsData?.length || 0,
            pending: notificationStats?.pending || 0,
            sent: notificationStats?.sent || 0,
            delivered: notificationStats?.delivered || 0,
            failed: notificationStats?.failed || 0
          },
          subscriptions: {
            total: subscriptionStats?.total || 0,
            active: subscriptionStats?.active || 0,
            expired: subscriptionStats?.expired || 0,
            expiringSoon: subscriptionStats?.expiringSoon || 0,
            totalRevenue: subscriptionStats?.totalRevenue || 0
          }
        });

        setActivities(generatedActivities);

        console.log('✅ Real dashboard stats calculated successfully');
      } catch (error) {
        console.error('❌ Error loading real dashboard data:', error);
        hasLoadedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []); // Remove dependencies to prevent refetching

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-700"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome to your CRM Dashboard</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
          <Calendar className="h-4 w-4" />
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.users.total}</p>
              <div className="flex items-center mt-2">
                <UserCheck className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-gray-600">{stats.users.active} active</span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.customers.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{stats.customers.subscribed} subscribed</span>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Campaigns Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Email Campaigns</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.campaigns.total}</p>
              <div className="flex items-center mt-2">
                <Send className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-gray-600">{stats.notifications.sent} sent</span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notifications</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.notifications.total}</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">{stats.notifications.pending} pending</span>
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl">
              <Bell className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Subscriptions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.subscriptions.total}</p>
              <div className="flex items-center mt-2">
                <DollarSign className="h-4 w-4 text-indigo-500 mr-1" />
                <span className="text-sm text-gray-600">${stats.subscriptions.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

{/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer & Subscription Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Customers & Subscriptions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Subscribed Customers</span>
              <span className="font-semibold text-gray-900">{stats.customers.subscribed}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Interested Customers</span>
              <span className="font-semibold text-blue-600">{stats.customers.interested}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Expired Customers</span>
              <span className="font-semibold text-red-600">{stats.customers.expired}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Not Interested Customers</span>
              <span className="font-semibold text-gray-600">{stats.customers.notInterested}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Spent</span>
              <span className="font-semibold text-gray-900">${stats.customers.totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Subscriptions</span>
              <span className="font-semibold text-green-600">{stats.subscriptions.active}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Expired Subscriptions</span>
              <span className="font-semibold text-red-600">{stats.subscriptions.expired}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expiring Soon</span>
              <span className="font-semibold text-orange-600">{stats.subscriptions.expiringSoon}</span>
            </div>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-yellow-600" />
            Notifications Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="font-semibold text-yellow-600">{stats.notifications.pending}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <Send className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Sent</span>
              </div>
              <span className="font-semibold text-blue-600">{stats.notifications.sent}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Delivered</span>
              </div>
              <span className="font-semibold text-green-600">{stats.notifications.delivered}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <span className="font-semibold text-red-600">{stats.notifications.failed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity to display</p>
            </div>
          ) : (
            activities.map((activity) => {
              const getIconComponent = (iconName: string) => {
                switch (iconName) {
                  case 'Bell': return Bell;
                  case 'Mail': return Mail;
                  case 'AlertCircle': return AlertCircle;
                  case 'Target': return Target;
                  case 'CheckCircle': return CheckCircle;
                  default: return Activity;
                }
              };

              const getColorClasses = (color: string) => {
                switch (color) {
                  case 'green': return 'from-green-50 to-white border-green-100 bg-green-100 text-green-600';
                  case 'blue': return 'from-blue-50 to-white border-blue-100 bg-blue-100 text-blue-600';
                  case 'yellow': return 'from-yellow-50 to-white border-yellow-100 bg-yellow-100 text-yellow-600';
                  case 'red': return 'from-red-50 to-white border-red-100 bg-red-100 text-red-600';
                  case 'orange': return 'from-orange-50 to-white border-orange-100 bg-orange-100 text-orange-600';
                  case 'gray': return 'from-gray-50 to-white border-gray-100 bg-gray-100 text-gray-600';
                  default: return 'from-gray-50 to-white border-gray-100 bg-gray-100 text-gray-600';
                }
              };

              const IconComponent = getIconComponent(activity.icon);
              const colorClasses = getColorClasses(activity.color);

              return (
                <div key={activity.id} className={`flex items-center space-x-3 p-4 bg-gradient-to-r ${colorClasses} rounded-lg border`}>
                  <div className={`p-2 rounded-lg ${colorClasses.includes('bg-') ? colorClasses.split(' ').find(c => c.startsWith('bg-')) : 'bg-gray-100'}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}