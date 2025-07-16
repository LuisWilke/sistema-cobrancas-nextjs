'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthCredentials, RegisterCredentials } from '@/types';
import { api, ApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<boolean>;
  register: (userData: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há um token válido no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.verifyToken();
      if (response.valido) {
        setUser({
          id: response.usuario.id.toString(),
          name: response.usuario.nome,
          email: response.usuario.email,
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.login(credentials);
      
      const userData: User = {
        id: response.usuario.id.toString(),
        name: response.usuario.nome,
        email: response.usuario.email,
      };
      
      setUser(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
      return false;
    }
  };

  const register = async (userData: RegisterCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.register(userData);
      
      const user: User = {
        id: response.usuario.id.toString(),
        name: response.usuario.nome,
        email: response.usuario.email,
      };
      
      setUser(user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

