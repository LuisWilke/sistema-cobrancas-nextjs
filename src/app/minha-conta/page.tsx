'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Building, 
  Lock, 
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

export default function MinhaContaPage() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [personalData, setPersonalData] = useState({
    name: 'Maria Valentina',
    email: 'maria@empresa.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    avatar: ''
  });

  const [companyData, setCompanyData] = useState({
    name: 'HMC Serviços LTDA',
    cnpj: '12.435.974/0001-74',
    phone: '(11) 3333-4444',
    email: 'contato@empresa.com',
    address: 'Rua das Empresas, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSavePersonalData = () => {
    console.log('Salvando dados pessoais:', personalData);
    // Simular salvamento
  };

  const handleSaveCompanyData = () => {
    console.log('Salvando dados da empresa:', companyData);
    // Simular salvamento
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Alterando senha');
    // Simular alteração de senha
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonalData(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais e da empresa</p>
            </div>
            <User className="w-8 h-8 text-gray-400" />
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dados Pessoais
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Dados da Empresa
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Segurança
              </TabsTrigger>
            </TabsList>

            {/* Dados Pessoais */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={personalData.avatar} alt={personalData.name} />
                      <AvatarFallback className="text-lg">
                        {personalData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Alterar Foto
                        </Button>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG ou GIF. Máximo 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Formulário */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={personalData.name}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalData.email}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        value={personalData.cpf}
                        onChange={(e) => setPersonalData(prev => ({ ...prev, cpf: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSavePersonalData} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Dados Pessoais
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dados da Empresa */}
            <TabsContent value="company" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Razão Social</Label>
                      <Input
                        id="companyName"
                        value={companyData.name}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        value={companyData.cnpj}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, cnpj: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyPhone">Telefone</Label>
                      <Input
                        id="companyPhone"
                        value={companyData.phone}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyEmail">E-mail</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={companyData.address}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={companyData.city}
                          onChange={(e) => setCompanyData(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={companyData.state}
                          onChange={(e) => setCompanyData(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">CEP</Label>
                        <Input
                          id="zipCode"
                          value={companyData.zipCode}
                          onChange={(e) => setCompanyData(prev => ({ ...prev, zipCode: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveCompanyData} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Dados da Empresa
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Segurança */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          value={passwordData.current}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPassword.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPassword.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPassword.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Requisitos da senha:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Mínimo de 8 caracteres</li>
                      <li>• Pelo menos uma letra maiúscula</li>
                      <li>• Pelo menos uma letra minúscula</li>
                      <li>• Pelo menos um número</li>
                      <li>• Pelo menos um caractere especial</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleChangePassword} 
                    className="flex items-center gap-2"
                    disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
                  >
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                </CardContent>
              </Card>

              {/* Sessões Ativas */}
              <Card>
                <CardHeader>
                  <CardTitle>Sessões Ativas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sessão Atual</p>
                        <p className="text-sm text-gray-600">Chrome • São Paulo, SP</p>
                        <p className="text-xs text-gray-500">Última atividade: agora</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Ativa
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-gray-600">iPhone • São Paulo, SP</p>
                        <p className="text-xs text-gray-500">Última atividade: 2 horas atrás</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Encerrar
                      </Button>
                    </div>
                  </div>

                  <Button variant="destructive" size="sm">
                    Encerrar Todas as Outras Sessões
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

