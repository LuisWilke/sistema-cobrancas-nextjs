'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    cnpj: '',
    emailOrCpf: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Credenciais inválidas. Verifique seus dados e tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl">
            <Building2 className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Sistema de Cobranças
            </h1>
            <p className="text-xl text-gray-600 max-w-md">
              Gerencie suas cobranças de forma inteligente
            </p>
          </div>
          <div className="w-full max-w-md h-64 bg-white/20 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30">
            {/* Decorative element */}
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="lg:hidden w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">LOGO</CardTitle>
              <CardDescription className="text-lg">
                Acessar minha conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-sm font-medium text-green-700">
                    CNPJ da empresa
                  </Label>
                  <Input
                    id="cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    className="border-green-200 focus:border-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailOrCpf" className="text-sm font-medium text-orange-700">
                    E-mail ou CPF
                  </Label>
                  <Input
                    id="emailOrCpf"
                    type="text"
                    placeholder="seu@email.com ou 000.000.000-00"
                    value={formData.emailOrCpf}
                    onChange={(e) => handleInputChange('emailOrCpf', e.target.value)}
                    className="border-orange-200 focus:border-orange-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-teal-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-teal-200 focus:border-teal-500 pr-10"
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

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <div className="text-center">
                  <Link 
                    href="/reset-password" 
                    className="text-sm text-orange-600 hover:text-orange-800 underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

