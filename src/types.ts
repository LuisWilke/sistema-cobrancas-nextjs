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