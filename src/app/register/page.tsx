'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cpf_usuario: '',
    celular: '',
    data_nascimento: '',
    gid_empresa: 1, // Valor padrão ou buscar de uma lista
    cnpj_empresa: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validar senhas
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    try {
      const { confirmarSenha, ...dadosRegistro } = formData
      const ok = await register(dadosRegistro)
      if (ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <CardDescription className="text-lg">
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium">
                    Nome Completo *
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
                    E-mail *
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
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha *
                  </Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha" className="text-sm font-medium">
                    Confirmar Senha *
                  </Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf_usuario" className="text-sm font-medium">
                    CPF
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
                  <Label htmlFor="celular" className="text-sm font-medium">
                    Celular
                  </Label>
                  <Input
                    id="celular"
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formData.celular}
                    onChange={(e) => handleInputChange('celular', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_nascimento" className="text-sm font-medium">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj_empresa" className="text-sm font-medium">
                    CNPJ da Empresa
                  </Label>
                  <Input
                    id="cnpj_empresa"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj_empresa}
                    onChange={(e) => handleInputChange('cnpj_empresa', e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
                  Conta criada com sucesso! Redirecionando...
                </div>
              )}

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-orange-600 hover:text-orange-600 underline"
                >
                  Já tenho uma conta
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 text-lg font-medium"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}