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
  gid_empresa?: number;
  empresa_cnpj?: string;
}

// Tipo para o contexto de usuário (simplificado)
export interface User {
  id: string;
  name: string;
  email: string;
  company?: {
    empresa_nome: string;
    empresa_cnpj: string;
  };
}

export interface AuthResponse {
  mensagem: string;
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    empresa?: {
      empresa_nome: string;
      empresa_cnpj: string;
    };
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

export interface Document {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpfCnpj: string;
  };
  documentNumber: string;
  installment: string;
  issueDate: string;
  dueDate: string;
  value: number;
  interest: number;
  total: number;
  status: string;
}

export interface DashboardMetrics {
  overdue: { value: number; clients: number };
  dueIn2Days: { value: number; clients: number };
  dueIn3To10Days: { value: number; clients: number };
  dueOver10Days: { value: number; clients: number };
  totalOverdue: { value: number; clients: number };
  dueTodayTotal: { value: number; clients: number };
  totalDue: { value: number; clients: number };
  totalReceivable: { value: number; clients: number };
}

export interface MessageTemplate {
  id: string;
  type: string;
  subject?: string;
  content: string;
  variables: string[];
}

export interface PIXKey {
  id: string;
  type: string;
  value: string;
  active: boolean;
}

export interface PIXTransaction {
  id: string;
  documentId: string;
  value: number;
  date: string;
  status: string;
}