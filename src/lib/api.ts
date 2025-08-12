const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.erro || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, 'Erro de conexão com o servidor');
  }
}

export const api = {
 
  login: async (credentials: { email: string; senha: string }) => {
    return apiRequest<{
      mensagem: string;
      token: string;
      usuario: {
        id: number;
        nome: string;
        email: string;
      };
    }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    nome: string;
    email: string;
    senha: string;
    cpf_usuario?: string;
  }) => {
    return apiRequest<{
      mensagem: string;
      token: string;
      usuario: {
        id: number;
        nome: string;
        email: string;
      };
    }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  
  verifyToken: async () => {
    return apiRequest<{
      valido: boolean;
      usuario: {
        id: number;
        nome: string;
        email: string;
      };
    }>('/verificar-token');
  },

 
  getProfile: async () => {
    return apiRequest<{
      usuario: {
        id: number;
        nome: string;
        email: string;
        cpf_usuario?: string;
      };
    }>('/perfil');
  },
};

export { ApiError };

