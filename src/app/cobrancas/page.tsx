'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Download, 
  Search, 
  Mail, 
  MessageCircle, 
  Phone, 
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { mockDocuments } from '@/data/mockData';
import { Document } from '@/types';

export default function CobrancasPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendType, setSendType] = useState<'email' | 'whatsapp' | 'sms' | null>(null);

  const filteredDocuments = documents.filter(doc =>
    doc.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSendMessages = (type: 'email' | 'whatsapp' | 'sms') => {
    setSendType(type);
    setShowSendModal(true);
  };

  const confirmSend = () => {
    // Simular envio
    console.log(`Enviando ${sendType} para ${selectedDocuments.length} documentos`);
    setShowSendModal(false);
    setSendType(null);
    setSelectedDocuments([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vencido_5_dias':
        return <Badge variant="destructive">Vencido há 5 dias</Badge>;
      case 'vence_hoje':
        return <Badge className="bg-orange-500">Vence hoje</Badge>;
      case 'vence_10_dias':
        return <Badge className="bg-green-500">Vence em 10 dias</Badge>;
      case 'vence_15_dias':
        return <Badge className="bg-yellow-500">Vence em 15 dias</Badge>;
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

  const selectedDocumentsList = documents.filter(doc => selectedDocuments.includes(doc.id));

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cobranças</h1>
              <p className="text-gray-600">Gerencie suas cobranças e documentos a receber</p>
            </div>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>

          {/* Filtros e busca */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por cliente ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">Todos</Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações em massa */}
          {selectedDocuments.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 font-medium">
                    {selectedDocuments.length} item(s) selecionado(s)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSendMessages('email')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar E-mail
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendMessages('whatsapp')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendMessages('sms')}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Enviar SMS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabela de documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documentos a receber</span>
                <span className="text-sm font-normal text-gray-500">
                  {filteredDocuments.length} documentos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAll}
                          className="p-0"
                        >
                          {selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0 ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Emissão</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectDocument(document.id)}
                            className="p-0"
                          >
                            {selectedDocuments.includes(document.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {document.client.name}
                        </TableCell>
                        <TableCell>{document.documentNumber}</TableCell>
                        <TableCell>{document.installment}</TableCell>
                        <TableCell>{document.issueDate}</TableCell>
                        <TableCell>{document.dueDate}</TableCell>
                        <TableCell>{formatCurrency(document.value)}</TableCell>
                        <TableCell>{formatCurrency(document.interest)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(document.total)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(document.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="p-2">
                              <Mail className="w-4 h-4 text-red-600" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-2">
                              <MessageCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-2">
                              <Phone className="w-4 h-4 text-purple-600" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-2">
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Modal de confirmação de envio */}
          <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Envio em Massa - {sendType === 'email' ? 'E-mail' : sendType === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </DialogTitle>
                <DialogDescription>
                  Confirmar envio de {sendType === 'email' ? 'E-mail' : sendType === 'whatsapp' ? 'WhatsApp' : 'SMS'} para {selectedDocuments.length} cliente(s) selecionado(s)?
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {selectedDocumentsList.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{doc.client.name}</span>
                      <span className="text-sm text-gray-600">{doc.documentNumber}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowSendModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={confirmSend}>
                    Confirmar Envio
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

