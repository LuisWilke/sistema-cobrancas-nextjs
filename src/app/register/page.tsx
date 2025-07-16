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
    emailOrCpf: '',
    password: '',
    cnpj: ''
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

    try {
      const ok = await register(formData)
      if (ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError('Erro ao criar conta. Verifique os dados.')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
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
              Criar nova conta
            </h1>
            <p className="text-1xl text-gray-700 max-w-md">
              Cadastre-se e comece a usar a régua de cobrança
            </p>
          </div>
          <div className="w-full max-w-md h-64 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl/25 border border-white/30 mb-14" />
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="lg:hidden w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Registro</CardTitle>
              <CardDescription className="text-lg">
                Crie sua conta para começar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrCpf" className="text-sm font-medium">
                    E-mail ou CPF
                  </Label>
                  <Input
                    id="emailOrCpf"
                    type="text"
                    placeholder="seu@email.com ou 000.000.000-00"
                    value={formData.emailOrCpf}
                    onChange={(e) => handleInputChange('emailOrCpf', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
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
    </div>
  )
}