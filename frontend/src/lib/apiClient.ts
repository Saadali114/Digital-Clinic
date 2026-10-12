import type { UserSummary } from '../types/index.js';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    },
    // Credentials must be included for cookie-based session authentication across origins
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.error || data.message || `Request failed with status ${response.status}`,
      response.status,
      data.details
    );
  }

  return data as T;
}

export const apiClient = {
  health: async () => {
    return request<{
      status: string;
      timestamp: string;
      services: { api: string; database: string };
      message?: string;
    }>('/health');
  },

  auth: {
    register: async (payload: {
      name: string;
      email: string;
      password: string;
      role: 'PATIENT' | 'DOCTOR';
      specialization?: string;
    }) => {
      return request<{ success: boolean; user: UserSummary }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    login: async (payload: { email: string; password: string }) => {
      return request<{ success: boolean; user: UserSummary }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    logout: async () => {
      return request<{ success: boolean; message: string }>('/auth/logout', {
        method: 'POST',
      });
    },

    me: async () => {
      return request<{ success: boolean; user: UserSummary }>('/auth/me');
    },
  },

  users: {
    getById: async (id: string) => {
      return request<{ success: boolean; user: UserSummary }>(`/users/${id}`);
    },
  },
};
