// Tipos para o sistema de gestão de cobranças

export interface User {
  id: string;
  name: string;
  email: string;
  company: Company;
}

export interface Company {
  id: string;
  cnpj: string;
  name: string;
  email: string;
  phone: string;
}

export interface Document {
  id: string;
  client: Client;
  documentNumber: string;
  installment: string;
  issueDate: string;
  dueDate: string;
  value: number;
  interest: number;
  total: number;
  status: DocumentStatus;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpfCnpj: string;
}

export type DocumentStatus = 
  | 'vencido_5_dias'
  | 'vence_hoje'
  | 'vence_10_dias'
  | 'vence_15_dias'
  | 'pago';

export interface DashboardMetrics {
  overdue: {
    value: number;
    clients: number;
  };
  dueIn2Days: {
    value: number;
    clients: number;
  };
  dueIn3To10Days: {
    value: number;
    clients: number;
  };
  dueOver10Days: {
    value: number;
    clients: number;
  };
  totalOverdue: {
    value: number;
    clients: number;
  };
  dueTodayTotal: {
    value: number;
    clients: number;
  };
  totalDue: {
    value: number;
    clients: number;
  };
  totalReceivable: {
    value: number;
    clients: number;
  };
}

export interface MessageTemplate {
  id: string;
  type: 'email' | 'whatsapp' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
}

export interface SendMessageRequest {
  documentIds: string[];
  type: 'email' | 'whatsapp' | 'sms';
  template?: MessageTemplate;
}

export interface PIXKey {
  id: string;
  type: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  value: string;
  active: boolean;
}

export interface PIXTransaction {
  id: string;
  documentId: string;
  value: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  qrCode?: string;
}

export interface AuthCredentials {
  cnpj: string;
  emailOrCpf: string;
  password: string;
}

export interface ResetPasswordRequest {
  emailOrCpf: string;
}

export interface ConfigurationSettings {
  sendingPeriods: {
    beforeDue: number[];
    afterDue: number[];
    onDueDate: boolean;
  };
  messageTemplates: {
    email: MessageTemplate;
    whatsapp: MessageTemplate;
    sms: MessageTemplate;
  };
  sendingAccounts: {
    email: {
      provider: string;
      apiKey: string;
      fromEmail: string;
    };
    whatsapp: {
      provider: string;
      apiKey: string;
      phoneNumber: string;
    };
    sms: {
      provider: string;
      apiKey: string;
      fromNumber: string;
    };
  };
}

