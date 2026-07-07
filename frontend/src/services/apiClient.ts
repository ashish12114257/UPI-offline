import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  status: number;
  serverMessage: string;

  constructor(message: string, status: number, serverMessage: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.serverMessage = serverMessage;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function extractMessage(data: unknown): string | undefined {
  if (isRecord(data) && typeof data.message === 'string') {
    return data.message;
  }
  if (data !== undefined && data !== null) {
    return String(data);
  }
  return undefined;
}

function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const serverMessage = extractMessage(error.response?.data) ?? error.message;

    if (!error.response) {
      return new ApiError(
        'Network error. Please check your connection.',
        status,
        serverMessage
      );
    }

    if (error.code === 'ECONNABORTED') {
      return new ApiError(
        'Request timed out. The server may be unreachable.',
        status,
        serverMessage
      );
    }

    return new ApiError(
      status >= 500 ? 'Server error. Please try again later.' : `Request failed (${status})`,
      status,
      serverMessage
    );
  }
  if (error instanceof Error) {
    return new ApiError(error.message, 0, error.message);
  }
  return new ApiError('An unexpected error occurred', 0, String(error));
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 1000;

function shouldRetry(error: unknown, retryCount: number): boolean {
  if (retryCount >= MAX_RETRIES) return false;
  if (!axios.isAxiosError(error)) return false;

  if (!error.response) return true;
  if (error.code === 'ECONNABORTED') return true;
  if (error.response.status >= 500 && error.config?.method?.toLowerCase() === 'get') return true;

  return false;
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    return Promise.reject(normalizeError(error));
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const config = error.config as InternalAxiosRequestConfig & { __retryCount?: number };
    if (!config) return Promise.reject(error);

    const retryCount = config.__retryCount || 0;
    if (!shouldRetry(error, retryCount)) return Promise.reject(error);

    config.__retryCount = retryCount + 1;
    const delay = RETRY_BASE_DELAY * Math.pow(2, retryCount);

    await new Promise(resolve => setTimeout(resolve, delay));

    return apiClient(config);
  }
);

export default apiClient;
