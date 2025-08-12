import { Document, DashboardMetrics, MessageTemplate, PIXKey, PIXTransaction } from '@/types/index';


export const mockDocuments: Document[] = [
  { 
    clienteId: 1,
    id: '1',
    numero: 'NF 001235',
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    emissao: '20/05/2024',
    dueDate: '20/06/2024',
    vencimento: '20/06/2024',
    valor: 850.00,
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  },

  {
    clienteId: 2,
    id: '2',
    numero: 'NF 001235',
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    emissao: '20/05/2024',
    dueDate: '20/06/2024',
    vencimento: '20/06/2024',
    valor: 850.00,
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  },
  {
    clienteId: 3,
    id: '2',
    numero: 'NF 001235',
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    emissao: '20/05/2024',
    dueDate: '20/06/2024',
    vencimento: '20/06/2024',
    valor: 850.00,
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  },

  { 
    clienteId: 4,
    id: '2',
    numero: 'NF 001235',
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    emissao: '20/05/2024',
    dueDate: '20/06/2024',
    vencimento: '20/06/2024',
    valor: 850.00,
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  },
  {
    clienteId: 5,
    id: '2',
    numero: 'NF 001235',
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    emissao: '20/05/2024',
    dueDate: '20/06/2024',
    vencimento: '20/06/2024',
    valor: 850.00,
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  overdue: 129454.00,
  totalClients: 126,
  totalInvoices: 98,
  totalAmount: 1014721.35,
  pendingInvoices: 45,
  overdueInvoices: 13,
  paidInvoices: 25,
  overdueAmount: 15898.08,
  dueIn2Days: {
    count: 5, 
    value: 1275.00,
    client: 3 // Número de clientes com documentos vencendo em 2 dias
  }
};

export const mockMessageTemplates: Record<string, MessageTemplate> = {
  email: {
    id: '1',
    type: 'email',
    subject: 'Cobrança - Documento {documento} vencido',
    content: `Olá {cliente},

Esperamos que esteja bem. Gostaríamos de informar que o documento {documento} no valor de {valor} está com vencimento em {vencimento}.

Para facilitar o pagamento, disponibilizamos o link: {link}

Caso já tenha efetuado o pagamento, desconsidere este e-mail.

Atenciosamente,
Equipe Financeira`,
    variables: ['{cliente}', '{documento}', '{valor}', '{vencimento}', '{link}']
  },
  whatsapp: {
    id: '2',
    type: 'sms',
    content: `Olá {cliente}! 👋

Seu documento {documento} no valor de {valor} está vencendo em {vencimento}.

Pague agora: {link}

Dúvidas? Responda esta mensagem.`,
    variables: ['{cliente}', '{documento}', '{valor}', '{vencimento}', '{link}']
  },
  sms: {
    id: '3',
    type: 'sms',
    content: '{cliente}, documento {documento} de {valor} vence em {vencimento}. Pague: {link}',
    variables: ['{cliente}', '{documento}', '{valor}', '{vencimento}', '{link}']
  }
};

export const mockPIXKeys: PIXKey[] = [
  {
    id: '1',
    type: 'CNPJ',
    value: '12.345.678/0001-90',
    active: true,
    key: 'chavepixempresa',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    type: 'EMAIL',
    value: 'pix@empresa.com',
    active: true,
    key: 'chavepixemail',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    type: 'PHONE',
    value: '11999999999',
    active: false,
    key: 'chavepixtelefone',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const mockPIXTransactions: PIXTransaction[] = [
  {
    id: '1',
    documentId: '1',
    value: 1275.00,
    date: '2024-06-10T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    documentId: '2',
    value: 850.00,
    date: '2024-06-12T14:15:00Z',
    status: 'pending'
  }
];

