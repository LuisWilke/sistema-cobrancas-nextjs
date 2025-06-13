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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  QrCode, 
  Copy, 
  Eye, 
  ToggleLeft, 
  ToggleRight,
  CreditCard,
  Smartphone,
  Mail,
  Phone,
  Hash
} from 'lucide-react';
import { mockPIXKeys, mockPIXTransactions } from '@/data/mockData';
import { PIXKey, PIXTransaction } from '@/types';

export default function GestaoPixPage() {
  const [pixKeys, setPixKeys] = useState<PIXKey[]>(mockPIXKeys);
  const [transactions, setTransactions] = useState<PIXTransaction[]>(mockPIXTransactions);
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKey, setNewKey] = useState({
    type: 'cpf' as PIXKey['type'],
    value: ''
  });

  const handleToggleKey = (keyId: string) => {
    setPixKeys(prev =>
      prev.map(key =>
        key.id === keyId ? { ...key, active: !key.active } : key
      )
    );
  };

  const handleAddKey = () => {
    const key: PIXKey = {
      id: Date.now().toString(),
      type: newKey.type,
      value: newKey.value,
      active: true
    };
    setPixKeys(prev => [...prev, key]);
    setNewKey({ type: 'cpf', value: '' });
    setShowAddKeyModal(false);
  };

  const getKeyTypeIcon = (type: PIXKey['type']) => {
    switch (type) {
      case 'cpf':
      case 'cnpj':
        return <CreditCard className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'random':
        return <Hash className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getKeyTypeLabel = (type: PIXKey['type']) => {
    switch (type) {
      case 'cpf':
        return 'CPF';
      case 'cnpj':
        return 'CNPJ';
      case 'email':
        return 'E-mail';
      case 'phone':
        return 'Telefone';
      case 'random':
        return 'Chave Aleatória';
      default:
        return type;
    }
  };

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
              <p className="text-gray-600">Gerencie suas chaves PIX e acompanhe transações</p>
            </div>
          </div>

          <Tabs defaultValue="keys" className="space-y-6">
            <TabsList>
              <TabsTrigger value="keys">Chaves PIX</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
            </TabsList>

            {/* Chaves PIX */}
            <TabsContent value="keys" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Minhas Chaves PIX</CardTitle>
                    <Dialog open={showAddKeyModal} onOpenChange={setShowAddKeyModal}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Chave
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Nova Chave PIX</DialogTitle>
                          <DialogDescription>
                            Cadastre uma nova chave PIX para receber pagamentos
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="keyType">Tipo de Chave</Label>
                            <select
                              id="keyType"
                              value={newKey.type}
                              onChange={(e) => setNewKey(prev => ({ ...prev, type: e.target.value as PIXKey['type'] }))}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="cpf">CPF</option>
                              <option value="cnpj">CNPJ</option>
                              <option value="email">E-mail</option>
                              <option value="phone">Telefone</option>
                              <option value="random">Chave Aleatória</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="keyValue">Valor da Chave</Label>
                            <Input
                              id="keyValue"
                              value={newKey.value}
                              onChange={(e) => setNewKey(prev => ({ ...prev, value: e.target.value }))}
                              placeholder={`Digite ${getKeyTypeLabel(newKey.type).toLowerCase()}`}
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowAddKeyModal(false)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleAddKey} disabled={!newKey.value.trim()}>
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pixKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getKeyTypeIcon(key.type)}
                          </div>
                          <div>
                            <div className="font-medium">{getKeyTypeLabel(key.type)}</div>
                            <div className="text-sm text-gray-600">{key.value}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={key.active ? "default" : "secondary"}>
                            {key.active ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleKey(key.id)}
                          >
                            {key.active ? (
                              <ToggleRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

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
                          {pixKeys.filter(key => key.active).map(key => (
                            <option key={key.id} value={key.value}>
                              {getKeyTypeLabel(key.type)} - {key.value}
                            </option>
                          ))}
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

