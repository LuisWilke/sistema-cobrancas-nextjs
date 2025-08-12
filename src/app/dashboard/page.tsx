'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { mockDashboardMetrics } from '@/data/mockData';
import { DashboardMetrics } from '@/types/index';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockDashboardMetrics);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simular carregamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(mockDashboardMetrics);
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Situação atual do contas a receber</p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>

          {/* Métricas por período de vencimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vencidos */}
            <Card className="border-l-4 border-l-red-500 bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-700">
                    {formatCurrency(metrics.overdue)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A vencer em até 2 dias */}
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  a vencer em até 2 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-700">
                    {formatCurrency(metrics.dueIn2Days.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Users className="w-4 h-4" />
                    {metrics.dueIn2Days.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A vencer de 3 até 10 dias */}
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">
                  a vencer de 3 até 10 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-yellow-700">
                    {formatCurrency(metrics.dueIn3To10Days.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <Users className="w-4 h-4" />
                    {metrics.dueIn3To10Days.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A vencer acima de 10 dias */}
            <Card className="border-l-4 border-l-green-500 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  a vencer acima de 10 dias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-700">
                    {formatCurrency(metrics.dueOver10Days.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Users className="w-4 h-4" />
                    {metrics.dueOver10Days.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumos adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total vencido */}
            <Card className="bg-red-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total vencido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.totalOverdue.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <TrendingDown className="w-4 h-4" />
                    {metrics.totalOverdue.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total vencendo hoje */}
            <Card className="bg-orange-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total vencendo HOJE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.dueTodayTotal.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Users className="w-4 h-4" />
                    {metrics.dueTodayTotal.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total a vencer */}
            <Card className="bg-blue-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total a vencer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.totalDue.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <TrendingUp className="w-4 h-4" />
                    {metrics.totalDue.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total geral a receber */}
            <Card className="bg-green-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">
                  Total geral a receber
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.totalReceivable.value)}
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <DollarSign className="w-4 h-4" />
                    {metrics.totalReceivable.clients} Clientes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards de resumo por período específico */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-red-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">vencidos até 2 dias</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(9454.00)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    3 Clientes
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    $
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-orange-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">vencidos entre 3 e 10 dias</div>
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(2123.09)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    5 Clientes
                  </div>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                    $
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-yellow-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">vencidos entre 11 e 30 dias</div>
                  <div className="text-xl font-bold text-yellow-600">
                    {formatCurrency(3177.00)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    3 Clientes
                  </div>
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                    $
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">vencidos a mais de 30 dias</div>
                  <div className="text-xl font-bold text-gray-600">
                    {formatCurrency(1143.99)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    2 Clientes
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    $
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

