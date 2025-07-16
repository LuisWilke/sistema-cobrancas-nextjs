'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Home,
  FileText,
  CreditCard,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { href: '/dashboard', icon: Home, label: 'Início' },
  { href: '/cobrancas', icon: FileText, label: 'Cobranças' },
  { href: '/gestao-pix', icon: CreditCard, label: 'Gestão PIX' },
  { href: '/configuracao', icon: Settings, label: 'Configuração' },
  { href: '/minha-conta', icon: User, label: 'Minha conta' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">LOGO</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0.5">
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Olá, {user?.name}
              </h2>
              <p className="text-sm text-gray-600">
                Empresa Logada: {user?.company?.name || 'N/A'} - {user?.company?.cnpj || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="hidden sm:flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
            
            <p className="text-sm text-gray-500 hidden sm:block">
              Atualizado há 15:10
            </p>

            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}