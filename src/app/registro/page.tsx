'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Empresa } from '@/types/index';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf_usuario: '',
    celular: '',
    data_nascimento: '',
    gid_empresa: '',
    cnpj_empresa: ''
  });
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  // Carregar lista de empresas
  useEffect(() => {
    const carregarEmpresas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/empresas`);
        if (response.ok) {
          const data = await response.json();
          setEmpresas(data.empresas);
        }
      } catch (error) {
        console.error('Erro ao carregar empresas:', error);
      }
    };

    carregarEmpresas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmpresaChange = (value: string) => {
    const empresaSelecionada = empresas.find(emp => emp.id.toString() === value);
    setFormData(prev => ({
      ...prev,
      gid_empresa: value,
      cnpj_empresa: empresaSelecionada?.cnpj_empresa || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.gid_empresa) {
      setErro('Selecione uma empresa');
      return;
    }

    setLoading(true);

    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,

        cpf_usuario: formData.cpf_usuario,
        celular: formData.celular,
        data_nascimento: formData.data_nascimento,
        gid_empresa: parseInt(formData.gid_empresa),
        cnpj_empresa: formData.cnpj_empresa
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {erro}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gid_empresa">Empresa</Label>
              <Select value={formData.gid_empresa} onValueChange={handleEmpresaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.nome_empresa} - {empresa.cnpj_empresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf_usuario">CPF (opcional)</Label>
              <Input
                id="cpf_usuario"
                name="cpf_usuario"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf_usuario}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular">Celular (opcional)</Label>
              <Input
                id="celular"
                name="celular"
                type="text"
                placeholder="(11) 99999-9999"
                value={formData.celular}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de nascimento (opcional)</Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha (mín. 6 caracteres)"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar senha</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}