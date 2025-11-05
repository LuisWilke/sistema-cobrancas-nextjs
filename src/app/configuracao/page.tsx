
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
  ChevronsUpDownIcon,
  CheckIcon,
} from 'lucide-react';
import { mockMessageTemplates } from '@/data/mockData';
import { MessageTemplate } from '@/types';
import { PixKeysSection } from '@/components/PixKeysSection'; // Importar o novo componente
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function ConfiguracaoPage() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [openBeforeDueDialog, setOpenBeforeDueDialog] = React.useState(false);
  const [openAfterDueDialog, setOpenAfterDueDialog] = React.useState(false);
  const [newPeriodValue, setNewPeriodValue] = React.useState('');

  const [sendingPeriods, setSendingPeriods] = useState({
    beforeDue: [3, 7, 15],
    afterDue: [1, 3, 7, 15],
    onDueDate: true
  });


  const configSSL = [
    {
      value: "sslNone",
      label: "slNone",
    },
    {
      value: "sslAuto",
      label: "sslAuto",
    },
    {
      value: "sslTSL",
      label: "sslTSL",
    },
    {
      value: "sslStartTSL",
      label: "sslStartTSL",
    },
  ]

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
    smtp: {
      email: 'admin',
      pass: '123456',
      userMail: 'admin',
      porta: '352'
    }
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Nome da Empresa',
    cnpj: '00.000.000/0000-00',
    address: 'Rua Exemplo, 123 - Cidade - UF',
    phone: '(00) 00000-0000',
    email: 'contato@empresa.com'
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

  const handleSaveCompanyInfo = () => {
    console.log('Salvando informações da empresa:', companyInfo);
    // Simular salvamento
  };

  const addPeriod = (type: 'beforeDue' | 'afterDue') => {
    const periodToAdd = Number(newPeriodValue);
    if (!isNaN(periodToAdd) && periodToAdd > 0) {
      setSendingPeriods(prev => ({
        ...prev,
        [type]: [...prev[type], periodToAdd].sort((a, b) => a - b)
      }));
      setNewPeriodValue(''); // Clear input
      setOpenBeforeDueDialog(false); // Close dialog
      setOpenAfterDueDialog(false); // Close dialog
    } else {
      alert('Por favor, insira um número válido para o período.');
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
                        <Dialog open={openBeforeDueDialog} onOpenChange={setOpenBeforeDueDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6"
                              onClick={() => setNewPeriodValue('')} // Clear input when opening
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adicionar Período (Antes do Vencimento)</DialogTitle>
                              <DialogDescription>
                                Insira a quantidade de dias antes do vencimento para enviar o lembrete.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-2">
                              <Input
                                type="number"
                                placeholder="Quantidade de dias"
                                value={newPeriodValue}
                                onChange={(e) => setNewPeriodValue(e.target.value)}
                                className="w-full"
                              />
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setOpenBeforeDueDialog(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={() => addPeriod('beforeDue')}>
                                Salvar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

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

                        <Dialog open={openAfterDueDialog} onOpenChange={setOpenAfterDueDialog}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6"
                              onClick={() => setNewPeriodValue('')} // Clear input when opening
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Adicionar
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adicionar Período (Após o Vencimento)</DialogTitle>
                              <DialogDescription>
                                Insira a quantidade de dias após o vencimento para enviar a cobrança.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-2">
                              <Input
                                type="number"
                                placeholder="Quantidade de dias"
                                value={newPeriodValue}
                                onChange={(e) => setNewPeriodValue(e.target.value)}
                                className="w-full"
                              />
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setOpenAfterDueDialog(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={() => addPeriod('afterDue')}>
                                Salvar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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
                      Conta de E-mail (SMTP)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 gap-3 w-120">
                    <div className="space-y-2">
                      <Label htmlFor="smtpEmail">E-mail</Label>
                      <Input
                        id="smtpEmail"
                        value={sendingAccounts.smtp.email}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, email: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPass">Senha</Label>
                      <Input
                        id="smtpPass"
                        type="password"
                        value={sendingAccounts.smtp.pass}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, pass: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUserMail">Conta</Label>
                      <Input
                        id="smtpUserMail"
                        value={sendingAccounts.smtp.userMail}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, userMail: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUserMail">SMTP</Label>
                      <Input
                        id="smtpUserMail"
                        value={sendingAccounts.smtp.email}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, userMail: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUserMail">PORTA</Label>
                      <Input
                        id="smtpUserMail"
                        value={sendingAccounts.smtp.porta}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          smtp: { ...prev.smtp, userMail: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-3">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms">Usar SSL</Label>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                          >
                            {value
                              ? configSSL.find((configSSL) => configSSL.value === value)?.label
                              : "SSL"}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[150px] p-0">
                          <Command>
                            <CommandInput placeholder="Search framework..." />
                            <CommandList>
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {configSSL.map((configSSL) => (
                                  <CommandItem
                                    key={configSSL.value}
                                    value={configSSL.value}
                                    onSelect={(currentValue) => {
                                      setValue(currentValue === value ? "" : currentValue)
                                      setOpen(false)
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        value === configSSL.value ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {configSSL.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>


                    <Button onClick={() => handleSaveAccount('smtp')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>

                {/* Conta de WhatsApp */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      Conta de WhatsApp (Twilio)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 w-120">
                    <div className="space-y-2">
                      <Label htmlFor="twilioProvider">Provedor</Label>
                      <Input
                        id="twilioProvider"
                        value={sendingAccounts.whatsapp.provider}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, provider: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilioApiKey">API Key</Label>
                      <Input
                        id="twilioApiKey"
                        value={sendingAccounts.whatsapp.apiKey}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, apiKey: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twilioPhoneNumber">Número de Telefone</Label>
                      <Input
                        id="twilioPhoneNumber"
                        value={sendingAccounts.whatsapp.phoneNumber}
                        onChange={(e) => setSendingAccounts(prev => ({
                          ...prev,
                          whatsapp: { ...prev.whatsapp, phoneNumber: e.target.value }
                        }))}
                      />
                    </div>
                    <Button onClick={() => handleSaveAccount('whatsapp')} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chaves PIX */}
            <TabsContent value="pix-keys" className="space-y-6">
              <PixKeysSection />
            </TabsContent>

            {/* Configurações Gerais */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    Configurações Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyCnpj">CNPJ</Label>
                    <Input
                      id="companyCnpj"
                      value={companyInfo.cnpj}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, cnpj: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Endereço</Label>
                    <Input
                      id="companyAddress"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Telefone</Label>
                    <Input
                      id="companyPhone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">E-mail</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleSaveCompanyInfo} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Informações da Empresa
                  </Button>
                <Button className="mt-2 bg-red-600 hover:bg-red-700 border-red-700 hover:border-red-800 text-white flex items-center " size="sm">
                  <Link href="/userlist">Gerenciar usuarios</Link>
                </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}