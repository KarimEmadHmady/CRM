export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'interested' | 'not_interested' | 'subscribed' | 'expired';
  notes: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  __v: number;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  notes: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  status?: 'interested' | 'not_interested' | 'subscribed' | 'expired';
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface CustomersListResponse {
  success: boolean;
  data: Customer[];
}

export interface CustomerStatsResponse {
  success: boolean;
  data: {
    total: number;
    subscribed: number;
    expired: number;
    interested: number;
    notInterested: number;
    totalSpent: number;
  };
}
