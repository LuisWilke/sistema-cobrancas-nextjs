'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulação de envio de e-mail de recuperação
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (err) {
      setError('Erro ao enviar e-mail de recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-700">
                E-mail Enviado!
              </CardTitle>
              <CardDescription className="text-base">
                Enviamos as instruções para recuperação de senha para o e-mail cadastrado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>Verifique sua caixa de entrada e spam.</p>
                <p>O link de recuperação expira em 24 horas.</p>
              </div>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Voltar ao Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              Recuperar Senha
            </h1>
            <p className="text-xl text-gray-600 max-w-md">
              Enviaremos um link de recuperação para seu e-mail
            </p>
          </div>
        </div>

        {/* Right side - Reset Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <span className="text-sm text-gray-600">Voltar ao login</span>
              </div>
              
              <div className="lg:hidden w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold text-center">
                Esqueci minha senha
              </CardTitle>
              <CardDescription className="text-center">
                Digite seu e-mail ou CPF para receber as instruções de recuperação
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrCpf" className="text-sm font-medium">
                    E-mail ou CPF
                  </Label>
                  <Input
                    id="emailOrCpf"
                    type="text"
                    placeholder="seu@email.com ou 000.000.000-00"
                    value={emailOrCpf}
                    onChange={(e) => {
                      setEmailOrCpf(e.target.value);
                      if (error) setError('');
                    }}
                    className="border-gray-200 focus:border-blue-500"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                  disabled={loading || !emailOrCpf.trim()}
                >
                  {loading ? 'Enviando...' : 'Enviar Instruções'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Lembrou da senha?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

