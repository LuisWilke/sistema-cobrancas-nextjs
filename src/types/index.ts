export interface Usuario {
  id: number;
  email: string;
  nome: string;
  cpf_usuario?: string;
  celular?: string;
  data_nascimento?: string;
  gid_empresa?: number;
  cnpj_empresa?: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
  empresa?: Empresa;
}


export interface Empresa {
  id: number;
  cnpj_empresa: string;
  nome_empresa: string;
  razao_social?: string;
  obs?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos para autenticação - CORRIGIDOS
export interface AuthCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  cpf_usuario?: string;
  celular?: string;
  data_nascimento?: string;
  cnpj_empresa?: string;
}

// Tipo para o contexto de usuário (simplificado)
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  mensagem: string;
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

export interface ApiError {
  erro: string;
}

// Tipos existentes do sistema (mantidos para compatibilidade)
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo';
}

export interface Cobranca {
  id: number;
  clienteId: number;
  cliente: Cliente;
  valor: number;
  descricao: string;
  dataVencimento: string;
  dataCriacao: string;
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada';
  metodoPagamento?: string;
  observacoes?: string;
}

export interface DashboardStats {
  totalClientes: number;
  totalCobrancas: number;
  valorTotal: number;
  cobrancasPendentes: number;
  cobrancasVencidas: number;
  cobrancasPagas: number;
}

export interface PixTransaction {
  id: string;
  client: { name: string };
  documentId: string;
  documentNumber: string;
  emissionDate: string;
  dueDate: string;
  paymentDate: string;
  value: number;
  interest: number;
  total: number;
  status: 'pendente' | 'pago' | 'erro';
  type: string;
  pixCopyPaste: string;
  boletoLink: string;
  walletInfo: string;
}

export interface PIXKey {
  id: string;
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';
  key: string;
  value: string;
  createdAt: string;
  active: boolean;
}

export interface PIXTransaction {
  id: string;
  documentId: string;
  value: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface MessageTemplate {
  id: string;
  type: 'email' | 'sms';
  content: string;
  variables: string[];
  subject?: string; // Apenas para email
}

export interface Document {
  [x: string]: any;
  id: string;
  clienteId: number;
  numero: string;
  valor: number;
  vencimento: string;
  emissao: string;
  status: string;
  linkPagamento?: string;
  documentNumber?: string; 
  installment: string; 
  issueDate: string; 
  dueDate: string; 
  paymentDate?: string;
  value: number;
  interest?: number;
  total?: number;
}

export interface DashboardMetrics {
  [x: string]: any;
  dueIn2Days: any;
  overdue: number;
  totalClients: number;
  totalInvoices: number;
  totalAmount: number;
  pendingInvoices: number;
  overdueInvoices: number;
  paidInvoices: number;
  overdueAmount: number;
}