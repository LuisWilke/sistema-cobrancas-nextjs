'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, UserCheck, UserX, Shield, Mail, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Se você tiver um hook/useToast do shadcn, substitua showToast pela sua implementação.
// Exemplo: import { useToast } from '@/components/ui/use-toast';
const showToast = (title: string, description?: string) => {
  // Caso tenha um toast global, chame-o aqui. Senão, fallback para alert.
  // Ex.: const { toast } = useToast(); toast({ title, description });
  try {
    // fallback simples
    // eslint-disable-next-line no-alert
    alert(`${title}${description ? ' — ' + description : ''}`);
  } catch {
    // ignorar
  }
};

interface User {
  id: number;
  nome: string;
  email: string;
  cpf_usuario: string;
  tipo: 'admin' | 'user';
  ativo: boolean;
  created_at: string;
}

interface Props {
  currentUser?: {
    role?: string;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:5000';

const UserManagement: React.FC<Props> = ({ currentUser = { role: 'admin' } }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [deletingLoadingId, setDeletingLoadingId] = useState<number | null>(null);

  const isAdmin = currentUser?.role === 'admin';

function formatDate(dateString: string) {
  if (!dateString) return 'Data inválida';

  const partes = dateString.split('/');
  if (partes.length === 3) {
    return `${partes[0]}/${partes[1]}/${partes[2]}`;
  }
  return 'Data inválida';
}

  // Pega token (ajuste se você usa cookies/next-auth/etc)
  const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token'); // ajuste conforme seu fluxo
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/usuarios/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // se for endpoint protegido por JWT, envie o token também:
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        console.error('Erro ao buscar usuários', err);
        showToast('Erro', err?.message || 'Não foi possível buscar usuários');
        return;
      }

      const data: User[] = await res.json();
      console.log('RESPOSTA DA API:', data);
      setUsers(data);
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Não foi possível conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  // Deleta usuário no backend e atualiza estado
  const handleDeleteUser = async (userId: number) => {
    setDeletingLoadingId(userId);

    try {
      const token = getAuthToken();

      const res = await fetch(`${API_BASE}/usuarios/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.message || err?.erro || 'Erro ao deletar usuário';
        console.error('Erro ao deletar:', err);
        showToast('Erro ao deletar', message);
        return;
      }

      const json = await res.json().catch(() => null);
      showToast('Sucesso', json?.message || 'Usuário deletado com sucesso');

      // Atualiza estado local removendo o usuário deletado
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error(error);
      showToast('Erro', 'Falha ao comunicar com o servidor');
    } finally {
      setDeletingLoadingId(null);
      setDeletingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-600">Acesso Negado</CardTitle>
          <CardDescription>
            Você não possui permissões de administrador para acessar esta página.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Gerencie todos os usuários do sistema. Total de usuários: {users.length}
              </CardDescription>
            </div>
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nenhum usuário encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700 w-[250px]">Nome</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Email</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Função</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">Data de Criação</th>
                    <th className="text-center p-4 font-semibold text-sm text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium">{user.nome}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {user.email}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={user.tipo === 'admin' ? 'default' : 'secondary'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.tipo === 'admin' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <UserCheck className="h-3 w-3" />
                          )}
                          {user.tipo === 'admin' ? 'Administrador' : 'Usuário'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={user.ativo ? 'default' : 'secondary'}
                          className="flex items-center gap-1 w-fit"
                        >
                          {user.ativo ? (
                            <UserCheck className="h-3 w-3" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          {user.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {formatDate(user.created_at)}
                        </div>

                      </td>
                      <td className="p-4 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:cursor-pointer"
                              onClick={() => setDeletingUserId(user.id)}
                              disabled={deletingLoadingId === user.id}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              {deletingLoadingId === user.id ? 'Excluindo...' : 'Deletar'}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja deletar o usuário <strong>{user.nome}</strong>?
                                Esta ação não pode ser desfeita e todos os dados do usuário serão permanentemente removidos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletingUserId(null)}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={deletingLoadingId === user.id}
                              >
                                {deletingLoadingId === user.id ? 'Deletando...' : 'Deletar Usuário'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Apenas usuários com privilégios de administrador podem visualizar e gerenciar outros usuários.
          A exclusão de usuários é uma ação permanente e não pode ser desfeita.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default UserManagement;