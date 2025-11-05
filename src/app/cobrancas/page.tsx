'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  Send,
  Loader2
} from 'lucide-react';

// Tipos baseados na resposta da API
interface Cobranca {
  id_cobranca: number;
  brcode: string;
  codigo_cliente: string;
  client_doc: string;
  nome_cliente: string;
  telefone_cliente: string;
  empresa: string;
  criado_em: string;
  emissao: string;
  data_pagamento: string | null;
  vencimento: string;
  desc_status: string;
  dias_carencia: string;
  documento_loja: string;
  idtrecparcela: string;
  juro_diario: string;
  juros: string;
  parcela_loja: string;
  company_cpf: string;
  percentage_fine: string;
  processing: boolean;
  status: string;
  atualizado_em: string;
  url_boleto: string | null;
  valor_multa: string;
  valor_pago: string;
  valor_pendente: string;
  valor: string;
}

interface ApiResponse {
  page: number;
  total_pages: number;
  total: number;
  per_page: number;
  cobrancas: Cobranca[];
}

// Função para formatar data
const formatDateToBR = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
};

// Função para calcular dias até o vencimento
const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Função segura para converter para string
const safeToString = (value: any): string => {
  if (value === null || value === undefined) return '';
  return String(value);
};

export default function CobrancasPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendente');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [total, setTotal] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendType, setSendType] = useState<'email' | 'whatsapp' | null>(null);
  
  // Estados para os modais individuais
  const [currentContactDoc, setCurrentContactDoc] = useState<Cobranca | null>(null);
  const [showIndividualSendModal, setShowIndividualSendModal] = useState(false);
  const [individualSendType, setIndividualSendType] = useState<'email' | 'whatsapp' | null>(null);
  const [individualMessageContent, setIndividualMessageContent] = useState('');
  const [individualRecipient, setIndividualRecipient] = useState('');

  // Estados para o modal de log
  const [showLogModal, setShowLogModal] = useState(false);
  const [currentLogDoc, setCurrentLogDoc] = useState<Cobranca | null>(null);

  // Função para buscar dados da API
  const fetchCobrancas = async (page: number, status: string, search: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        status,
        page: page.toString(),
        per_page: perPage.toString(),
      });

      // Adicionar search apenas se houver valor
      if (search.trim()) {
        params.append('search', search);
      }

      console.log('Buscando com parâmetros:', Object.fromEntries(params));

      const response = await fetch(`http://localhost:5000/cobrancas?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      console.log('Resposta da API:', {
        page: data.page,
        total_pages: data.total_pages,
        total: data.total,
        per_page: data.per_page,
        cobrancas_count: data.cobrancas?.length || 0
      });
      
      setCobrancas(data.cobrancas || []);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao buscar cobranças:', err);
      setCobrancas([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect para buscar dados iniciais
  useEffect(() => {
    fetchCobrancas(1, statusFilter, '');
  }, []); // Executar apenas na montagem

  // Effect para buscar quando filtros mudarem (com debounce para search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Resetar para página 1 quando filtros mudarem
      setCurrentPage(1);
      fetchCobrancas(1, statusFilter, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  // Effect para buscar quando a página mudar
  useEffect(() => {
    if (currentPage > 1) {
      fetchCobrancas(currentPage, statusFilter, searchTerm);
    }
  }, [currentPage]);

  // Funções de seleção
  const handleSelectAll = () => {
    setSelectedDocuments(prev =>
      prev.length === cobrancas.length ? [] : cobrancas.map(doc => safeToString(doc.id_cobranca))
    );
  };

  const handleSelectDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // Funções para paginação
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Funções para modais
  const openIndividualSendModal = (type: 'email' | 'whatsapp', cobranca: Cobranca) => {
    setCurrentContactDoc(cobranca);
    setIndividualSendType(type);
    setIndividualMessageContent(getDefaultMessage(type, cobranca));
    setIndividualRecipient(type === 'email' ? '' : safeToString(cobranca.telefone_cliente));
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

    console.log(`Enviando ${individualSendType} para ${currentContactDoc.nome_cliente}`, {
      message: individualMessageContent,
      recipient: individualRecipient,
    });
    closeIndividualSendModal();
  };

  const getDefaultMessage = (type: 'email' | 'whatsapp' | 'sms', cobranca: Cobranca) => {
    const clientName = safeToString(cobranca.nome_cliente).split(' ')[0];
    const dueDate = formatDateToBR(cobranca.vencimento);
    const docNumber = safeToString(cobranca.documento_loja);
    const totalValue = formatCurrency(parseFloat(safeToString(cobranca.valor_pendente)) || 0);
    
    if (type === 'email') {
      return `Prezado(a) ${clientName},\n\nLembramos que a cobrança ${docNumber} no valor de ${totalValue} vence em ${dueDate}.\n\nCaso já tenha efetuado o pagamento, por favor desconsidere este e-mail.\n\nAtenciosamente,\nEquipe de Cobrança`;
    } else if (type === 'whatsapp' || type === 'sms') {
      return `Olá ${clientName},\n\nLembramos que a cobrança ${docNumber} no valor de ${totalValue} vence em ${dueDate}.\n\n${cobranca.brcode ? 'PIX Copia e Cola: ' + cobranca.brcode : ''}\n\nAtenciosamente,\nEquipe de Cobrança`;
    }
    return '';
  };

  // Funções para envio em massa
  const handleSendMessages = (type: 'email' | 'whatsapp') => {
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
  const openLogModal = (cobranca: Cobranca) => {
    setCurrentLogDoc(cobranca);
    setShowLogModal(true);
  };

  const closeLogModal = () => {
    setShowLogModal(false);
    setCurrentLogDoc(null);
  };

  // Funções auxiliares
  const getStatusBadge = (status: string, desc_status: string, vencimento: string) => {
    const daysUntilDue = getDaysUntilDue(vencimento);
    
    if (status === 'pendente') {
      if (daysUntilDue < 0) {
        return <Badge variant="destructive">Vencido há {Math.abs(daysUntilDue)} dias</Badge>;
      } else if (daysUntilDue === 0) {
        return <Badge className="bg-orange-500">Vence hoje</Badge>;
      } else if (daysUntilDue <= 7) {
        return <Badge className="bg-yellow-500">Vence em {daysUntilDue} dias</Badge>;
      } else {
        return <Badge className="bg-green-500">Vence em {daysUntilDue} dias</Badge>;
      }
    }
    
    return <Badge variant="secondary">{desc_status}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('pendente');
    setCurrentPage(1);
  };

  const selectedCobrancasList = cobrancas.filter(doc => 
    selectedDocuments.includes(safeToString(doc.id_cobranca))
  );

  // Estatísticas
  const getFilterStats = () => {
    const overdue = cobrancas.filter(doc => getDaysUntilDue(doc.vencimento) < 0).length;
    const dueToday = cobrancas.filter(doc => getDaysUntilDue(doc.vencimento) === 0).length;
    const dueThisWeek = cobrancas.filter(doc => {
      const days = getDaysUntilDue(doc.vencimento);
      return days >= 0 && days <= 7;
    }).length;
    
    return { overdue, dueToday, dueThisWeek };
  };

  const stats = getFilterStats();

  // Renderizar páginas na paginação
  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Carregando cobranças...</span>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Erro ao carregar cobranças: {error}</p>
              <Button onClick={() => fetchCobrancas(currentPage, statusFilter, searchTerm)}>
                Tentar novamente
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
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
                    placeholder="Buscar por cliente, documento ou CPF/CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={perPage.toString()} onValueChange={(val) => {
                  setPerPage(parseInt(val));
                  setCurrentPage(1);
                  fetchCobrancas(1, statusFilter, searchTerm);
                }}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Por página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 por página</SelectItem>
                    <SelectItem value="15">15 por página</SelectItem>
                    <SelectItem value="25">25 por página</SelectItem>
                    <SelectItem value="50">50 por página</SelectItem>
                  </SelectContent>
                </Select>
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
                  Mostrando {cobrancas.length} de {total} documentos
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
                          {selectedDocuments.length === cobrancas.length && cobrancas.length > 0 ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </Button>
                      </TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Documento</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Emissão</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Juros</TableHead>
                      <TableHead>Pendente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cobrancas.map((cobranca) => (
                      <TableRow key={cobranca.id_cobranca}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectDocument(safeToString(cobranca.id_cobranca))}
                            className="p-0"
                          >
                            {selectedDocuments.includes(safeToString(cobranca.id_cobranca)) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{safeToString(cobranca.codigo_cliente)}</TableCell>
                        <TableCell className="font-medium">{safeToString(cobranca.nome_cliente)}</TableCell>
                        <TableCell>{safeToString(cobranca.client_doc)}</TableCell>
                        <TableCell>{safeToString(cobranca.parcela_loja)}</TableCell>
                        <TableCell>{formatDateToBR(cobranca.emissao)}</TableCell>
                        <TableCell>{formatDateToBR(cobranca.vencimento)}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(safeToString(cobranca.valor)) || 0)}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(safeToString(cobranca.juros)) || 0)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(parseFloat(safeToString(cobranca.valor_pendente)) || 0)}</TableCell>
                        <TableCell>
                          {getStatusBadge(cobranca.status, cobranca.desc_status, cobranca.vencimento)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-red-50"
                              onClick={() => openIndividualSendModal('email', cobranca)}
                            >
                              <Mail className="w-4 h-4 text-red-600" />
                            </Button>

                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-green-50"
                              onClick={() => openIndividualSendModal('whatsapp', cobranca)}
                            >
                              <MessageCircle className="w-4 h-4 text-green-600" />
                            </Button>

                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-2 hover:bg-blue-50" 
                              onClick={() => openLogModal(cobranca)}
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação melhorada */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t">
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} ({total} registros no total)
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="hidden sm:flex gap-1">
                    {renderPageNumbers()}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modal de Envio Individual */}
          <Dialog open={showIndividualSendModal} onOpenChange={open => !open && closeIndividualSendModal()}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {individualSendType === 'email' && 'Enviar E-mail'}
                  {individualSendType === 'whatsapp' && 'Enviar Mensagem por WhatsApp'}
                </DialogTitle>
                <DialogDescription>
                  Envio para {currentContactDoc?.nome_cliente}
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
                  />
                </div>

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
                  {individualSendType === 'email' ? 'Enviar E-mail' : 'Enviar WhatsApp'}
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
                  Detalhes da cobrança {currentLogDoc?.documento_loja}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Documento:</strong> {safeToString(currentLogDoc?.documento_loja)}</p>
                  <p><strong>Cliente:</strong> {safeToString(currentLogDoc?.nome_cliente)}</p>
                  <p><strong>Telefone:</strong> {safeToString(currentLogDoc?.telefone_cliente)}</p>
                  {currentLogDoc?.brcode && (
                    <div className="mt-2">
                      <p><strong>PIX Copia e Cola:</strong></p>
                      <div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
                        {currentLogDoc.brcode}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p><strong>Valor:</strong> {formatCurrency(parseFloat(safeToString(currentLogDoc?.valor)) || 0)}</p>
                  <p><strong>Juros:</strong> {formatCurrency(parseFloat(safeToString(currentLogDoc?.juros)) || 0)}</p>
                  <p><strong>Pendente:</strong> {formatCurrency(parseFloat(safeToString(currentLogDoc?.valor_pendente)) || 0)}</p>
                  <p><strong>Status:</strong> {safeToString(currentLogDoc?.desc_status)}</p>
                  <p><strong>Vencimento:</strong> {formatDateToBR(safeToString(currentLogDoc?.vencimento))}</p>
                </div>
              </div>

              <div className="space-y-4">
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
                {selectedCobrancasList.map((cobranca) => (
                  <div key={cobranca.id_cobranca} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{safeToString(cobranca.nome_cliente)}</span>
                    <span className="text-sm text-gray-600">
                      {safeToString(cobranca.telefone_cliente)}
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