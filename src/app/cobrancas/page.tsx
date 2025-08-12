
'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
  Download,
  Search,
  Mail,
  MessageCircle,
  Phone,
  Eye,
  CheckSquare,
  Square,
  Calendar,
  Filter,
  X,
  Send
} from 'lucide-react';
import { mockDocuments } from '@/data/mockData';
import { Document } from '@/types/index';

// Função para parse seguro de 'dd/MM/yyyy'
const parseDate = (str: string) => {
  const [day, month, year] = str.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
};

// Função para calcular dias até o vencimento
const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = parseDate(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function CobrancasPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [dueDateFilter, setDueDateFilter] = useState<string>('all');
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendType, setSendType] = useState<'email' | 'whatsapp' | 'sms' | null>(null);
  
  // Estados para os modais individuais
  const [currentContactDoc, setCurrentContactDoc] = useState<Document | null>(null);
  const [contactType, setContactType] = useState<'email' | 'whatsapp' | 'phone' | null>(null);
  const [messageContent, setMessageContent] = useState('');

  // Novo estado para o modal de envio de SMS/WhatsApp/Email individual
  const [showIndividualSendModal, setShowIndividualSendModal] = useState(false);
  const [individualSendType, setIndividualSendType] = useState<'email' | 'whatsapp' | 'sms' | null>(null);
  const [individualMessageContent, setIndividualMessageContent] = useState('');
  const [individualRecipient, setIndividualRecipient] = useState('');

  // Novo estado para o modal de log
  const [showLogModal, setShowLogModal] = useState(false);
  const [currentLogDoc, setCurrentLogDoc] = useState<Document | null>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.documentNumber ?? '').toLowerCase().includes(searchTerm.toLowerCase());

    const dueDateObj = parseDate(doc.dueDate);

    const withinDateRange =
      (!dateStart || dueDateObj >= dateStart) &&
      (!dateEnd || dueDateObj <= dateEnd);

    const daysUntilDue = getDaysUntilDue(doc.dueDate);
    let matchesDueDateFilter = true;

    switch (dueDateFilter) {
      case 'overdue': matchesDueDateFilter = daysUntilDue < 0; break;
      case 'due_today': matchesDueDateFilter = daysUntilDue === 0; break;
      case 'due_this_week': matchesDueDateFilter = daysUntilDue >= 0 && daysUntilDue <= 7; break;
      case 'due_this_month': matchesDueDateFilter = daysUntilDue >= 0 && daysUntilDue <= 30; break;
      case 'due_next_month': matchesDueDateFilter = daysUntilDue > 30 && daysUntilDue <= 60; break;
      case 'all': default: matchesDueDateFilter = true; break;
    }

    return matchesSearch && withinDateRange && matchesDueDateFilter;
  });

  // Funções de seleção
  const handleSelectAll = () => {
    setSelectedDocuments(prev =>
      prev.length === filteredDocuments.length ? [] : filteredDocuments.map(doc => doc.id)
    );
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Funções para modais de contato (antigo)
  const openContactModal = (type: 'email' | 'whatsapp' | 'phone', doc: Document) => {
    setCurrentContactDoc(doc);
    setContactType(type);
    setMessageContent(getDefaultMessage(type, doc));
    // setShowIndividualSendModal(true); // Abrir o novo modal
    // setIndividualSendType(type); // Definir o tipo de envio
    // setIndividualMessageContent(getDefaultMessage(type, doc)); // Definir a mensagem padrão
    // setIndividualRecipient(type === 'email' ? doc.client.email : doc.client.phone); // Definir o destinatário
  };

  const closeContactModal = () => {
    setCurrentContactDoc(null);
    setContactType(null);
    setMessageContent('');
  };

  const getDefaultMessage = (type: 'email' | 'whatsapp' | 'sms' | 'phone', doc: Document) => {
    const clientName = doc.client.name.split(' ')[0];
    const dueDate = doc.dueDate;
    const docNumber = doc.documentNumber;
    const totalValue = formatCurrency(doc.total || 0);
    
    if (type === 'email') {
      return `Prezado(a) ${clientName},\n\nLembramos que a cobrança ${docNumber} no valor de ${totalValue} vence em ${dueDate}.\n\nCaso já tenha efetuado o pagamento, por favor desconsidere este e-mail.\n\nAtenciosamente,\nEquipe de Cobrança`;
    } else if (type === 'whatsapp' || type === 'sms') {
      return `Olá ${clientName},\n\nLembramos que a cobrança ${docNumber} no valor de ${totalValue} vence em ${dueDate}.\n\nClique no link para pagar: [LINK_PAGAMENTO]\n\nAtenciosamente,\nEquipe de Cobrança`;
    }
    return '';
  };

  const handleSendContactMessage = () => {
    if (!currentContactDoc || !contactType) return;
    
    console.log(`Enviando ${contactType} para ${currentContactDoc.client.name}`, {
      message: messageContent,
      contact: contactType === 'email' 
        ? currentContactDoc.client.email 
        : currentContactDoc.client.phone
    });
    
    closeContactModal();
  };

  // Funções para o novo modal de envio individual
  const openIndividualSendModal = (type: 'email' | 'whatsapp' | 'sms', doc: Document) => {
    setCurrentContactDoc(doc);
    setIndividualSendType(type);
    setIndividualMessageContent(getDefaultMessage(type, doc));
    setIndividualRecipient(type === 'email' ? doc.client.email || '' : doc.client.phone || '');
    setShowIndividualSendModal(true);
  };

  const closeIndividualSendModal = () => {
    setShowIndividualSendModal(false);
    setCurrentContactDoc(null);
    setIndividualSendType(null);
    setIndividualMessageContent('');
    setIndividualRecipient('');
  };

  const handleIndividualSendMessage = () => {
    if (!currentContactDoc || !individualSendType) return;

    console.log(`Enviando ${individualSendType} para ${currentContactDoc.client.name}`, {
      message: individualMessageContent,
      recipient: individualRecipient,
    });
    closeIndividualSendModal();
  };

  // Funções para envio em massa
  const handleSendMessages = (type: 'email' | 'whatsapp' | 'sms') => {
    setSendType(type);
    setShowSendModal(true);
  };

  const confirmSend = () => {
    console.log(`Enviando ${sendType} para ${selectedDocuments.length} documentos`);
    setShowSendModal(false);
    setSendType(null);
    setSelectedDocuments([]);
  };

  // Funções para o modal de log
  const openLogModal = (doc: Document) => {
    setCurrentLogDoc(doc);
    setShowLogModal(true);
  };

  const closeLogModal = () => {
    setShowLogModal(false);
    setCurrentLogDoc(null);
  };

  // Funções auxiliares
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vencido_5_dias': return <Badge variant="destructive">Vencido há 5 dias</Badge>;
      case 'vence_hoje': return <Badge className="bg-orange-500">Vence hoje</Badge>;
      case 'vence_10_dias': return <Badge className="bg-green-500">Vence em 10 dias</Badge>;
      case 'vence_15_dias': return <Badge className="bg-yellow-500">Vence em 15 dias</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDateStart(null);
    setDateEnd(null);
    setDueDateFilter('all');
  };

  const selectedDocumentsList = documents.filter(doc => selectedDocuments.includes(doc.id));

  // Estatísticas
  const getFilterStats = () => {
    const overdue = documents.filter(doc => getDaysUntilDue(doc.dueDate) < 0).length;
    const dueToday = documents.filter(doc => getDaysUntilDue(doc.dueDate) === 0).length;
    const dueThisWeek = documents.filter(doc => {
      const days = getDaysUntilDue(doc.dueDate);
      return days >= 0 && days <= 7;
    }).length;
    
    return { overdue, dueToday, dueThisWeek };
  };

  const stats = getFilterStats();

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

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDueDateFilter('overdue')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vencidos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-full">
                    <Calendar className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDueDateFilter('due_today')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vencem Hoje</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.dueToday}</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDueDateFilter('due_this_week')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vencem esta Semana</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.dueThisWeek}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por cliente ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filtrar por vencimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os documentos</SelectItem>
                    <SelectItem value="overdue">Vencidos</SelectItem>
                    <SelectItem value="due_today">Vencem hoje</SelectItem>
                    <SelectItem value="due_this_week">Vencem esta semana</SelectItem>
                    <SelectItem value="due_this_month">Vencem este mês</SelectItem>
                    <SelectItem value="due_next_month">Vencem próximo mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Período personalizado:</span>
                <Input
                  type="date"
                  placeholder="Data inicial"
                  onChange={(e) => setDateStart(e.target.value ? new Date(e.target.value + 'T00:00:00') : null)}
                  className="w-full sm:w-auto"
                />
                <span className="text-sm text-gray-500">até</span>
                <Input
                  type="date"
                  placeholder="Data final"
                  onChange={(e) => setDateEnd(e.target.value ? new Date(e.target.value + 'T23:59:59') : null)}
                  className="w-full sm:w-auto"
                />
                <Button variant="outline" onClick={clearAllFilters} className="w-full sm:w-auto">
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações em massa */}
          {selectedDocuments.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedDocuments.length} documento(s) selecionado(s)
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessages('email')}
                      className="flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Enviar E-mail
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessages('whatsapp')}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Enviar WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendMessages('sms')}
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Enviar SMS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabela */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documentos a receber</span>
                <span className="text-sm font-normal text-gray-500">
                  {filteredDocuments.length} de {documents.length} documentos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Button variant="ghost" size="sm" onClick={handleSelectAll} className="p-0">
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
                        <TableCell className="font-medium">{document.client.name}</TableCell>
                        <TableCell>{document.documentNumber}</TableCell>
                        <TableCell>{document.installment}</TableCell>
                        <TableCell>{document.issueDate}</TableCell>
                        <TableCell>{document.dueDate}</TableCell>
                        <TableCell>{formatCurrency(document.value)}</TableCell>
                        <TableCell>{formatCurrency(document.interest ?? 0)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(document.total ?? 0)}</TableCell>
                        <TableCell>{getStatusBadge(document.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* Botão de E-mail */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-red-50"
                              onClick={() => openIndividualSendModal('email', document)}
                            >
                              <Mail className="w-4 h-4 text-red-600" />
                            </Button>

                            {/* Botão de WhatsApp */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-green-50"
                              onClick={() => openIndividualSendModal('whatsapp', document)}
                            >
                              <MessageCircle className="w-4 h-4 text-green-600" />
                            </Button>

                            {/* Botão de Telefone (SMS) */}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-purple-50"
                              onClick={() => openIndividualSendModal('sms', document)}
                            >
                              <Phone className="w-4 h-4 text-purple-600" />
                            </Button>

                            {/* Botão de Visualizar (Log) */}
                            <Button size="sm" variant="ghost" className="p-2 hover:bg-blue-50" onClick={() => openLogModal(document)}>
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

          {/* Novo Modal de Envio Individual (SMS/WhatsApp/Email) */}
          <Dialog open={showIndividualSendModal} onOpenChange={open => !open && closeIndividualSendModal()}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {individualSendType === 'email' && 'Enviar E-mail'}
                  {individualSendType === 'whatsapp' && 'Enviar Mensagem por WhatsApp'}
                  {individualSendType === 'sms' && 'Enviar SMS'}
                </DialogTitle>
                <DialogDescription>
                  Envio para {currentContactDoc?.client.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>
                    {individualSendType === 'email' ? 'E-mail do Cliente' : 'Telefone do Cliente'}
                  </Label>
                  <Input
                    type={individualSendType === 'email' ? 'email' : 'tel'}
                    value={individualRecipient}
                    onChange={(e) => setIndividualRecipient(e.target.value)}
                    className="mt-1"
                    readOnly={individualSendType !== 'sms'} // Permitir edição apenas para telefone (se for para digitar novo número)
                  />
                </div>

                {(individualSendType === 'whatsapp' || individualSendType === 'sms') && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="useExistingNumber"
                      name="recipientOption"
                      value="existing"
                      checked={individualRecipient === currentContactDoc?.client.phone}
                      onChange={() => setIndividualRecipient(currentContactDoc?.client.phone || '')}
                      className="form-radio"
                    />
                    <Label htmlFor="useExistingNumber">Enviar para o número utilizado no momento da emissão</Label>
                  </div>
                )}

                {(individualSendType === 'whatsapp' || individualSendType === 'sms') && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="enterNewNumber"
                      name="recipientOption"
                      value="new"
                      checked={individualRecipient !== currentContactDoc?.client.phone}
                      onChange={() => setIndividualRecipient('')} // Limpar para digitar novo
                      className="form-radio"
                    />
                    <Label htmlFor="enterNewNumber">Enviar para um novo número</Label>
                    {individualRecipient !== currentContactDoc?.client.phone && (
                      <Input
                        type="tel"
                        placeholder="Digite o novo número"
                        value={individualRecipient}
                        onChange={(e) => setIndividualRecipient(e.target.value)}
                        className="flex-1"
                      />
                    )}
                  </div>
                )}

                <div>
                  <Label>Mensagem</Label>
                  <textarea
                    value={individualMessageContent}
                    onChange={(e) => setIndividualMessageContent(e.target.value)}
                    className="mt-1 w-full p-2 border rounded min-h-[250px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeIndividualSendModal}>
                  Cancelar
                </Button>
                <Button onClick={handleIndividualSendMessage} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {individualSendType === 'email' ? 'Enviar E-mail' : individualSendType === 'whatsapp' ? 'Enviar WhatsApp' : 'Enviar SMS'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de Log de Cobranças */}
          <Dialog open={showLogModal} onOpenChange={open => !open && closeLogModal()}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Dados da Cobrança</DialogTitle>
                <DialogDescription>
                  Log de atividades para a cobrança {currentLogDoc?.documentNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Cobrança:</strong> {currentLogDoc?.documentNumber}</p>
                  <p><strong>Cliente:</strong> {currentLogDoc?.client.name}</p>
                  <p><strong>Telefone:</strong> {currentLogDoc?.client.phone}</p>
                  <p><strong>Tipo:</strong> PIX | BOLETO | CARTEIRA</p>
                  <p>PIX copia e cola &gt;&gt; ou</p>
                  <p>link de download do boleto &gt;&gt; ou</p>
                  <p>Carteira: documento / parcela</p>
                </div>
                <div className="text-right">
                  <p><strong>R$:</strong> {formatCurrency(currentLogDoc?.total || 0)}</p>
                  <p><strong>CNPJ/CPF:</strong> {currentLogDoc?.client.cpfCnpj}</p>
                  <p><strong>E-mail:</strong> {currentLogDoc?.client.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Histórico de Envio</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data hora</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Agente</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Mock data for log entries - replace with actual data from currentLogDoc if available */}
                      <TableRow>
                        <TableCell>24/01/2024 - 07:15</TableCell>
                        <TableCell>Enviado e-mail para xxx@provedor.com</TableCell>
                        <TableCell>auto</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>20/01/2024 - 05:15</TableCell>
                        <TableCell>Enviado e-mail para xxx@provedor.com</TableCell>
                        <TableCell>joana</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>19/01/2024 - 09:15</TableCell>
                        <TableCell>Enviado whats para 55 45 9 9955 5555</TableCell>
                        <TableCell>auto</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>17/01/2024 - 08:15</TableCell>
                        <TableCell>Enviado whats para 55 45 9 9955 5555</TableCell>
                        <TableCell>maria</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <h3 className="text-lg font-semibold">Anotações</h3>
                <textarea
                  className="w-full p-2 border rounded min-h-[100px]"
                  placeholder="Adicione anotações sobre esta cobrança..."
                ></textarea>
                <Button className="float-right">
                  Gravar anotações
                </Button>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeLogModal}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de Envio em Massa */}
          <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Envio em Massa - {sendType === 'email' ? 'E-mail' : sendType === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </DialogTitle>
                <DialogDescription>
                  Confirmar envio para {selectedDocuments.length} cliente(s) selecionado(s)?
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-60 overflow-y-auto space-y-2 py-4">
                {selectedDocumentsList.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{doc.client.name}</span>
                    <span className="text-sm text-gray-600">
                      {sendType === 'email' 
                        ? doc.client.email 
                        : doc.client.phone}
                    </span>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSendModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmSend} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Confirmar Envio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}