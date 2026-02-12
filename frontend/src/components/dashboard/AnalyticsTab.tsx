'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Mail, DollarSign, Calendar } from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const metrics: MetricCard[] = [
  {
    title: 'Total Revenue',
    value: '$45,231',
    change: 12.5,
    icon: <DollarSign className="h-5 w-5" />,
    color: 'text-green-600'
  },
  {
    title: 'Active Customers',
    value: '1,234',
    change: 8.2,
    icon: <Users className="h-5 w-5" />,
    color: 'text-blue-600'
  },
  {
    title: 'Email Sent',
    value: '8,456',
    change: -2.4,
    icon: <Mail className="h-5 w-5" />,
    color: 'text-purple-600'
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: 5.1,
    icon: <BarChart3 className="h-5 w-5" />,
    color: 'text-orange-600'
  }
];

export function AnalyticsTab() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Analytics</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${metric.color}`}>{metric.icon}</div>
              <div className={`flex items-center text-sm ${
                metric.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                {Math.abs(metric.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-600">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Revenue chart will be displayed here</p>
              <p className="text-sm">Integration with chart library needed</p>
            </div>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Customer growth chart will be displayed here</p>
              <p className="text-sm">Integration with chart library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            {
              icon: <Users className="h-4 w-4" />,
              iconColor: 'text-blue-600',
              title: 'New customer registered',
              description: 'Ahmed Mohamed joined the platform',
              time: '2 minutes ago'
            },
            {
              icon: <Mail className="h-4 w-4" />,
              iconColor: 'text-purple-600',
              title: 'Email campaign completed',
              description: 'Winter Sale 2024 sent to 1,500 recipients',
              time: '1 hour ago'
            },
            {
              icon: <DollarSign className="h-4 w-4" />,
              iconColor: 'text-green-600',
              title: 'New purchase',
              description: 'Sarah Ali purchased items worth $250',
              time: '3 hours ago'
            },
            {
              icon: <Calendar className="h-4 w-4" />,
              iconColor: 'text-orange-600',
              title: 'Meeting scheduled',
              description: 'Client meeting scheduled for tomorrow',
              time: '5 hours ago'
            }
          ].map((activity, index) => (
            <div key={index} className="px-6 py-4 flex items-start space-x-3 hover:bg-gray-50">
              <div className={`${activity.iconColor} mt-0.5`}>{activity.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.description}</div>
                <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
