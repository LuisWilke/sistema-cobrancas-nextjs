
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  QrCode,
  Eye,
} from 'lucide-react';
import { mockPIXTransactions } from '@/data/mockData';
import { PIXTransaction } from '@/types';

export default function GestaoPixPage() {
  const [transactions, setTransactions] = useState<PIXTransaction[]>(mockPIXTransactions);

  const getTransactionStatusBadge = (status: PIXTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Concluído</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestão PIX</h1>
              <p className="text-gray-600">Gerencie suas transações PIX e QR Codes</p>
            </div>
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            </TabsList>

            {/* Transações */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Transações PIX</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell>{transaction.documentId}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.value)}
                          </TableCell>
                          <TableCell>
                            {getTransactionStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* QR Codes */}
            <TabsContent value="qr-codes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerador de QR Code PIX</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="qrValue">Valor (R$)</Label>
                        <Input
                          id="qrValue"
                          type="number"
                          placeholder="0,00"
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qrDescription">Descrição</Label>
                        <Input
                          id="qrDescription"
                          placeholder="Descrição do pagamento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="qrKey">Chave PIX</Label>
                        <select className="w-full p-2 border rounded-md">
                          {/* Removido pixKeys.filter(key => key.active).map */}
                          <option value="">Selecione uma chave</option>
                        </select>
                      </div>
                      <Button className="w-full">
                        <QrCode className="w-4 h-4 mr-2" />
                        Gerar QR Code
                      </Button>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <QrCode className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">QR Code aparecerá aqui</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}