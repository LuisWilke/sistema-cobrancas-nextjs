
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Calendar,
  Filter,
  Copy,
  CheckCircle,
  ArrowRight,
  Trash2,
  Eye
} from 'lucide-react';
import { mockPixTransactions } from '@/data/mockPixTransactions';
import { PixTransaction } from '@/types/index';

export default function GestaoPixPage() {
  const [transactions, setTransactions] = useState<PixTransaction[]>(mockPixTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyPending, setOnlyPending] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch =
      transaction.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPending = onlyPending ? transaction.status === 'pendente' : true;

    const transactionDueDate = new Date(transaction.dueDate);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    const matchesDateRange = (!filterStartDate || transactionDueDate >= filterStartDate) &&
                             (!filterEndDate || transactionDueDate <= filterEndDate);

    return matchesSearch && matchesPending && matchesDateRange;
  });

  const handleSelectAll = () => {
    setSelectedTransactions(prev =>
      prev.length === filteredTransactions.length ? [] : filteredTransactions.map(t => t.id)
    );
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleCopyPix = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    alert('Código PIX copiado!');
  };

  const handleMarkAsPaid = (id: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'pago' } : t))
    );
    alert('Transação marcada como paga!');
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    alert('Transação excluída!');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PIX Gerados e Recebidos</h1>
              <p className="text-gray-600">Gerencie suas transações PIX</p>
            </div>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="relative flex-1">
                  <Label htmlFor="search-client-document" className='mb-2'>Cliente ou Documento</Label>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 mt-2" />
                  <Input
                    id="search-client-document"
                    placeholder="Buscar por cliente ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2.5">
                  <Checkbox
                    id="onlyPending"
                    checked={onlyPending}
                    onCheckedChange={(checked: boolean) => setOnlyPending(checked)}
                  />
                  <Label htmlFor="onlyPending">Somente pendentes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="start-date">Vencimento - Início:</Label>
                  <Input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-auto" />
                  <Label htmlFor="end-date">Fim:</Label>
                  <Input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-auto" />
                </div>
                <Button variant="outline">Pesquisar</Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transações PIX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Emissão</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={() => handleSelectTransaction(transaction.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{transaction.client.name}</TableCell>
                        <TableCell>{transaction.documentId}</TableCell>
                        <TableCell>{transaction.documentNumber}</TableCell>
                        <TableCell>{transaction.emissionDate}</TableCell>
                        <TableCell>{transaction.dueDate}</TableCell>
                        <TableCell>{transaction.paymentDate}</TableCell>
                        <TableCell>{formatCurrency(transaction.value)}</TableCell>
                        <TableCell>{formatCurrency(transaction.interest)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(transaction.total)}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2"
                              onClick={() => handleCopyPix(transaction.pixCopyPaste)}
                              title="Copiar PIX"
                            >
                              <Copy className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2"
                              onClick={() => handleMarkAsPaid(transaction.id)}
                              title="Marcar como Pago"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2"
                              onClick={() => alert('Abrir link do boleto/carteira')}
                              title="Abrir Link"
                            >
                              <ArrowRight className="w-4 h-4 text-orange-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2"
                              onClick={() => handleDelete(transaction.id)}
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {filteredTransactions.length} Cliente(s)
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}