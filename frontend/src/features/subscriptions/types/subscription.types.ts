export interface Subscription {
  _id: string;
  customer: string | Customer;
  packageType: 'basic' | 'premium' | 'vip' | 'custom';
  startDate: string;
  endDate: string;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  autoRenew: boolean;
  isActive: boolean;
  notes?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface SubscriptionStats {
  total: number;
  active: number;
  expired: number;
  expiringSoon: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface CreateSubscriptionData {
  customer: string;
  packageType: 'basic' | 'premium' | 'vip' | 'custom';
  startDate: string;
  endDate: string;
  price: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  autoRenew: boolean;
  notes?: string;
}

export interface UpdateSubscriptionData {
  packageType?: 'basic' | 'premium' | 'vip' | 'custom';
  startDate?: string;
  endDate?: string;
  price?: number;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer' | 'other';
  autoRenew?: boolean;
  notes?: string;
}

export interface SubscriptionFilters {
  status?: 'all' | 'active' | 'expired' | 'expiring_soon';
  packageType?: 'all' | 'basic' | 'premium' | 'vip' | 'custom';
  paymentStatus?: 'all' | 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface SubscriptionResponse {
  success: boolean;
  data: Subscription;
  message?: string;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export interface SubscriptionStatsResponse {
  success: boolean;
  data: SubscriptionStats;
}
