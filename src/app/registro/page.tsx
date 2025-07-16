'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Building2, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf_usuario: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');

    // Validações locais
    if (formData.senha !== formData.confirmarSenha) {
      setLocalError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { confirmarSenha, ...registerData } = formData;
      const success = await register(registerData);
      if (success) {
        router.push('/dashboard');
      }
    } catch (err) {
      // Erro já é tratado no contexto
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError('');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <User className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Criar Conta
            </h1>
            <p className="text-xl text-gray-700 max-w-md">
              Junte-se ao nosso sistema de gestão de cobranças
            </p>
          </div>
          <div className="w-full max-w-md h-64 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl/25 border border-white/30 mb-14">
            {/* Decorative element */}
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="lg:hidden w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
              <CardDescription className="text-lg">
                Preencha os dados para se cadastrar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf_usuario" className="text-sm font-medium">
                    CPF (opcional)
                  </Label>
                  <Input
                    id="cpf_usuario"
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf_usuario}
                    onChange={(e) => handleInputChange('cpf_usuario', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha (mín. 6 caracteres)"
                      value={formData.senha}
                      onChange={(e) => handleInputChange('senha', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha" className="text-sm font-medium">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {displayError && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {displayError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-green-700 cursor-pointer text-white py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link 
                      href="/login" 
                      className="font-bold text-blue-600 hover:text-green-700 underline"
                    >
                      Fazer login
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

