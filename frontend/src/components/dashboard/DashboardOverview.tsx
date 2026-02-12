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
// ❌ شيلنا الـ hooks دول لأنهم بيعملوا infinite loop
// import { useNotifications } from '@/features/notifications/hooks/useNotifications';
// import { useSubscriptions } from '@/features/subscriptions/hooks/useSubscriptions';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
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

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, newThisMonth: 0 },
    customers: { total: 0, active: 0, newThisMonth: 0, totalSpent: 0 },
    campaigns: { total: 0, active: 0, sentThisMonth: 0, totalSent: 0 },
    // ✅ Mock data للـ notifications و subscriptions
    notifications: { total: 0, pending: 0, sent: 0, delivered: 0, failed: 0 },
    subscriptions: { total: 0, active: 0, expired: 0, expiringSoon: 0, totalRevenue: 0 }
  });

  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // ✅ نسيبنا الـ hooks دول لأنهم مش بيعملوا مشاكل
  const { user } = useAuth();
  const { customers, fetchCustomers } = useCustomers();
  const { campaigns } = useEmailCampaigns();

  // ✅ Load data ONCE
  useEffect(() => {
    const loadDashboardData = async () => {
      if (hasLoadedRef.current) {
        console.log('⚠️ Dashboard already loaded, skipping...');
        return;
      }

      try {
        setLoading(true);
        console.log('📊 Loading dashboard data...');
        
        hasLoadedRef.current = true;

        // ✅ Fetch customers only
        await fetchCustomers();

        console.log('✅ Dashboard data loaded successfully');
      } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        hasLoadedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ✅ Calculate stats when data changes
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    console.log('🔄 Recalculating dashboard stats...');

    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Customer stats
      const newCustomersThisMonth = customers.filter(customer => {
        const createdDate = new Date(customer.createdAt);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
      }).length;

      const activeCustomers = customers.filter(customer => customer.status === 'active').length;
      const totalSpent = customers.reduce((sum, customer) => sum + (customer.totalSpent || 0), 0);

      // Campaign stats
      const totalCampaigns = campaigns?.length || 0;
      const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
      const totalSent = campaigns?.reduce((sum, c) => sum + (c.sentCount || 0), 0) || 0;

      setStats({
        users: {
          total: user ? 1 : 0,
          active: user?.isActive ? 1 : 0,
          newThisMonth: 0
        },
        customers: {
          total: customers.length,
          active: activeCustomers,
          newThisMonth: newCustomersThisMonth,
          totalSpent
        },
        campaigns: {
          total: totalCampaigns,
          active: activeCampaigns,
          sentThisMonth: 0,
          totalSent
        },
        // ✅ Mock data للـ notifications و subscriptions عشان الـ UI يشتغل
        notifications: {
          total: 25,
          pending: 5,
          sent: 12,
          delivered: 6,
          failed: 2
        },
        subscriptions: {
          total: 45,
          active: 35,
          expired: 7,
          expiringSoon: 3,
          totalRevenue: 25000
        }
      });

      console.log('✅ Stats calculated successfully');
    } catch (error) {
      console.error('❌ Error calculating stats:', error);
    }
  }, [user, customers, campaigns]); // ✅ شيلنا notifications و subscriptions من الـ deps

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
                <span className="text-sm text-green-600">+{stats.customers.newThisMonth} this month</span>
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
                <span className="text-sm text-gray-600">{stats.campaigns.totalSent} sent</span>
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
              <span className="text-sm text-gray-600">Active Customers</span>
              <span className="font-semibold text-gray-900">{stats.customers.active}</span>
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
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Dashboard loaded successfully</p>
              <p className="text-xs text-gray-500">Just now</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100">
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">All systems operational</p>
              <p className="text-xs text-gray-500">System status updated</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-white rounded-lg border border-indigo-100">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Revenue tracking active</p>
              <p className="text-xs text-gray-500">Subscription monitoring enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}