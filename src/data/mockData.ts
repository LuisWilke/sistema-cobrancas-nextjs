import { Document, DashboardMetrics, MessageTemplate, PIXKey, PIXTransaction } from '@/types';

export const mockDocuments: Document[] = [
  {
    id: '1',
    client: {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-1111',
      cpfCnpj: '123.456.789-00'
    },
    documentNumber: 'NF 001234',
    installment: '1/3',
    issueDate: '15/05/2024',
    dueDate: '15/06/2024',
    value: 1250.00,
    interest: 25.00,
    total: 1275.00,
    status: 'vencido_5_dias'
  },
  {
    id: '2',
    client: {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '(11) 99999-2222',
      cpfCnpj: '987.654.321-00'
    },
    documentNumber: 'NF 001235',
    installment: '2/2',
    issueDate: '20/05/2024',
    dueDate: '20/06/2024',
    value: 850.00,
    interest: 0.00,
    total: 850.00,
    status: 'vence_hoje'
  },
  {
    id: '3',
    client: {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      phone: '(11) 99999-3333',
      cpfCnpj: '456.789.123-00'
    },
    documentNumber: 'NF 001236',
    installment: '1/1',
    issueDate: '25/05/2024',
    dueDate: '25/06/2024',
    value: 2100.00,
    interest: 0.00,
    total: 2100.00,
    status: 'vence_10_dias'
  },
  {
    id: '4',
    client: {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 99999-4444',
      cpfCnpj: '789.123.456-00'
    },
    documentNumber: 'NF 001237',
    installment: '3/3',
    issueDate: '10/05/2024',
    dueDate: '10/06/2024',
    value: 750.00,
    interest: 45.00,
    total: 795.00,
    status: 'vencido_5_dias'
  },
  {
    id: '5',
    client: {
      id: '5',
      name: 'Carlos Ferreira',
      email: 'carlos@email.com',
      phone: '(11) 99999-5555',
      cpfCnpj: '321.654.987-00'
    },
    documentNumber: 'NF 001238',
    installment: '1/2',
    issueDate: '30/05/2024',
    dueDate: '30/06/2024',
    value: 1800.00,
    interest: 0.00,
    total: 1800.00,
    status: 'vence_15_dias'
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  overdue: {
    value: 129454.00,
    clients: 15
  },
  dueIn2Days: {
    value: 545123.09,
    clients: 45
  },
  dueIn3To10Days: {
    value: 232123.09,
    clients: 25
  },
  dueOver10Days: {
    value: 125123.09,
    clients: 28
  },
  totalOverdue: {
    value: 15898.08,
    clients: 13
  },
  dueTodayTotal: {
    value: 129454.00,
    clients: 15
  },
  totalDue: {
    value: 902369.27,
    clients: 98
  },
  totalReceivable: {
    value: 1014721.35,
    clients: 126
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
    type: 'whatsapp',
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
    type: 'cnpj',
    value: '12.345.678/0001-90',
    active: true
  },
  {
    id: '2',
    type: 'email',
    value: 'pix@empresa.com',
    active: true
  },
  {
    id: '3',
    type: 'phone',
    value: '11999999999',
    active: false
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