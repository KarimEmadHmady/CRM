export interface EmailConfig {
  _id: string;
  name: string;
  provider: 'gmail' | 'smtp';
  isActive: boolean;
  fromName: string;
  fromEmail: string;
  gmail?: {
    email: string;
    password: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  statistics: {
    totalSent: number;
    totalFailed: number;
    lastUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailConfigRequest {
  name: string;
  provider: 'gmail' | 'smtp';
  fromName: string;
  fromEmail: string;
  gmail?: {
    email: string;
    password: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface EmailConfigFormData {
  name: string;
  provider: 'gmail' | 'smtp';
  fromName: string;
  fromEmail: string;
  isActive: boolean;
  gmail: {
    email: string;
    password: string;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
}

export interface TestEmailRequest {
  to: string;
  subject?: string;
  text?: string;
}
