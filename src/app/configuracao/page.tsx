'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  MessageCircle,
  Save,
  Plus,
  Trash2,
  CreditCard,
  Settings2,
} from 'lucide-react';
import { mockMessageTemplates } from '@/data/mockData';
import { MessageTemplate } from '@/types';
import { PixKeysSection } from '@/components/PixKeysSection'; // Importar o novo componente

export default function ConfiguracaoPage() {
  const [sendingPeriods, setSendingPeriods] = useState({
    beforeDue: [3, 7, 15],
    afterDue: [1, 3, 7, 15],
    onDueDate: true
  });

  const [templates, setTemplates] = useState<Record<string, MessageTemplate>>(mockMessageTemplates);
  
  const [sendingAccounts, setSendingAccounts] = useState({
    email: {
      provider: 'SendGrid',
      apiKey: 'SG.xxxxxxxxxxxxxxxx',
      fromEmail: 'noreply@empresa.com'
    },
    whatsapp: {
      provider: 'Twilio',
      apiKey: 'ACxxxxxxxxxxxxxxxx',
      phoneNumber: '+5511999999999'
    },
    sms: {
      provider: 'Twilio',
      apiKey: 'ACxxxxxxxxxxxxxxxx',
      fromNumber: '+5511999999999'
    }
  });

  const handleSavePeriods = () => {
    console.log('Salvando períodos:', sendingPeriods);
    // Simular salvamento
  };

  const handleSaveTemplate = (type: string) => {
    console.log('Salvando template:', type, templates[type]);
    // Simular salvamento
  };

  const handleSaveAccount = (type: string) => {
    console.log('Salvando conta:', type, sendingAccounts[type as keyof typeof sendingAccounts]);
    // Simular salvamento
  };

  const addPeriod = (type: 'beforeDue' | 'afterDue') => {
    const newPeriod = prompt(`Adicionar período (em dias):`);
    if (newPeriod && !isNaN(Number(newPeriod))) {
      setSendingPeriods(prev => ({
        ...prev,
        [type]: [...prev[type], Number(newPeriod)].sort((a, b) => a - b)
      }));
    }
  };

  const removePeriod = (type: 'beforeDue' | 'afterDue', period: number) => {
    setSendingPeriods(prev => ({
      ...prev,
      [type]: prev[type].filter(p => p !== period)
    }));
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuração</h1>
              <p className="text-gray-600">Configure o sistema de acordo com suas necessidades</p>
            </div>
            <Settings className="w-8 h-8 text-gray-400" />
          </div>

          <Tabs defaultValue="periods" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="periods" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Períodos
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contas
              </TabsTrigger>
              <TabsTrigger value="pix-keys" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Chaves PIX
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Geral
              </TabsTrigger>
            </TabsList>

            {/* Períodos de Envio */}
            <TabsContent value="periods" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Períodos de Envio Automático</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Antes do Vencimento</Label>
                      <p className="text-sm text-gray-600 mb-3">
                        Enviar lembretes nos seguintes dias antes do vencimento:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sendingPeriods.beforeDue.map((period) => (
                          <Badge key={period} variant="secondary" className="flex items-center gap-1">
                            {period} dias
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removePeriod('beforeDue', period)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPeriod('beforeDue')}
                          className="h-6"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Após o Vencimento</Label>
                      <p className="text-sm text-gray-600 mb-3">
                        Enviar cobranças nos seguintes dias após o vencimento:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {sendingPeriods.afterDue.map((period) => (
                          <Badge key={period} variant="destructive" className="flex items-center gap-1">
                            {period} dias
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-red-100"
                              onClick={() => removePeriod('afterDue', period)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPeriod('afterDue')}
                          className="h-6"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="onDueDate"
                        checked={sendingPeriods.onDueDate}
                        onChange={(e) => setSendingPeriods(prev => ({ ...prev, onDueDate: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="onDueDate">Enviar no dia do vencimento</Label>
                    </div>
                  </div>

                  <Button onClick={handleSavePeriods} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Períodos
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates de Mensagens */}
            <TabsContent value="messages" className="space-y-6">
              <div className="grid gap-6">
                {/* Template de E-mail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-red-600" />
                      Template de E-mail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailSubject">Assunto</Label>
                      <Input
                        id="emailSubject"
                        value={templates.email.subject || ''}
                        onChange={(e) => setTemplates(prev => ({
                          ...prev,
                          email: { ...prev.email, subject: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailContent">Conteúdo</Label>
                      <Textarea
                        id="emailContent"
                        rows={8}
                        value={templates.email.content}
                        onChange={(e) => setTemplates(prev => ({
                          ...prev,
                          email: { ...prev.email, content: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Variáveis disponíveis:</p>
                      <div className="flex flex-wrap gap-1">
                        {templates.email.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => handleSaveTemplate('email')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Template
                    </Button>
                  </CardContent>
                </Card>

                {/* Template de WhatsApp */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Template de WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsappContent">Mensagem</Label>
                      <Textarea
                        id="whatsappContent"
                        rows={6}
                        value={templates.whatsapp.content}
                        onChange={(e) => setTemplates(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, content: e.target.value }
                        }))}
                      />
                      <p className="text-xs text-gray-500">
                        Caracteres: {templates.whatsapp.content.length}/1000
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Variáveis disponíveis:</p>
                      <div className="flex flex-wrap gap-1">
                        {templates.whatsapp.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => handleSaveTemplate('whatsapp')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Template
                    </Button>
                  </CardContent>
                </Card>

                {/* Template de SMS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      Template de SMS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="smsContent">Mensagem</Label>
                      <Textarea
                        id="smsContent"
                        rows={4}
                        value={templates.sms.content}
                        onChange={(e) => setTemplates(prev => ({
                          ...prev,
                          sms: { ...prev.sms, content: e.target.value }
                        }))}
                      />
                      <p className="text-xs text-gray-500">
                        Caracteres: {templates.sms.content.length}/160
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Variáveis disponíveis:</p>
                      <div className="flex flex-wrap gap-1">
                        {templates.sms.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button onClick={() => handleSaveTemplate('sms')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contas de Envio */}
            <TabsContent value="accounts" className="space-y-6">
              <div className="grid gap-6">
                {/* Conta de E-mail */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5 text-red-600" />
                      Configuração de E-mail
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailProvider">Provedor</Label>
                        <Input
                          id="emailProvider"
                          value={sendingAccounts.email.provider}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            email: { ...prev.email, provider: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emailFrom">E-mail Remetente</Label>
                        <Input
                          id="emailFrom"
                          type="email"
                          value={sendingAccounts.email.fromEmail}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            email: { ...prev.email, fromEmail: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailApiKey">API Key</Label>
                      <Input
                        id="emailApiKey"
                        type="password"
                        value={sendingAccounts.email.apiKey}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          email: { ...prev.email, apiKey: e.target.value }
                        }))}
                      />
                    </div>
                    <Button onClick={() => handleSaveAccount('email')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </CardContent>
                </Card>

                {/* Conta de WhatsApp */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Configuração de WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsappProvider">Provedor</Label>
                        <Input
                          id="whatsappProvider"
                          value={sendingAccounts.whatsapp.provider}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, provider: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsappPhone">Número de Telefone</Label>
                        <Input
                          id="whatsappPhone"
                          value={sendingAccounts.whatsapp.phoneNumber}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsappApiKey">API Key</Label>
                      <Input
                        id="whatsappApiKey"
                        type="password"
                        value={sendingAccounts.whatsapp.apiKey}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, apiKey: e.target.value }
                        }))}
                      />
                    </div>
                    <Button onClick={() => handleSaveAccount('whatsapp')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </CardContent>
                </Card>

                {/* Conta de SMS */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-600" />
                      Configuração de SMS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smsProvider">Provedor</Label>
                        <Input
                          id="smsProvider"
                          value={sendingAccounts.sms.provider}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            sms: { ...prev.sms, provider: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smsFrom">Número Remetente</Label>
                        <Input
                          id="smsFrom"
                          value={sendingAccounts.sms.fromNumber}
                          onChange={(e) => setSendingAccounts(prev => ({
                            ...prev,
                            sms: { ...prev.sms, fromNumber: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smsApiKey">API Key</Label>
                      <Input
                        id="smsApiKey"
                        type="password"
                        value={sendingAccounts.sms.apiKey}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          sms: { ...prev.sms, apiKey: e.target.value }
                        }))}
                      />
                    </div>
                    <Button onClick={() => handleSaveAccount('sms')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <select id="timezone" className="w-full p-2 border rounded-md">
                        <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                        <option value="America/New_York">América/Nova York (GMT-5)</option>
                        <option value="Europe/London">Europa/Londres (GMT+0)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <select id="currency" className="w-full p-2 border rounded-md">
                        <option value="BRL">Real Brasileiro (R$)</option>
                        <option value="USD">Dólar Americano ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyLogo">Logo da Empresa</Label>
                    <Input id="companyLogo" type="file" accept="image/*" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notifications" className="rounded" />
                    <Label htmlFor="notifications">Receber notificações por e-mail</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="autoBackup" className="rounded" />
                    <Label htmlFor="autoBackup">Backup automático diário</Label>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Chaves PIX */}
            <TabsContent value="pix-keys" className="space-y-6">
              <PixKeysSection />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}