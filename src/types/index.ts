// Tipos para o sistema de gestão de cobranças - Adaptado para esquema m2

export interface Usuario {
  id: number;
  email: string;
  nome: string;
  cpf_usuario?: string;
  celular?: string;
  data_nascimento?: string;
  gid_empresa: number;
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
  gid_empresa: number;
  cnpj_empresa?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  mensagem: string;
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  erro: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegistroData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf_usuario?: string;
  celular?: string;
  data_nascimento?: string;
  gid_empresa: number;
  cnpj_empresa?: string;
}

export interface AuthResponse {
  mensagem: string;
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  erro: string;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  registro: (dados: RegistroData) => Promise<void>;
  logout: () => void;
  loading: boolean;
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