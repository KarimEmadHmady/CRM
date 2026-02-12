export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'interested' | 'active' | 'inactive' | 'pending';
  notes: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
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
  status?: 'interested' | 'active' | 'inactive' | 'pending';
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
    active: number;
    inactive: number;
    interested: number;
    pending: number;
    totalSpent: number;
  };
}
