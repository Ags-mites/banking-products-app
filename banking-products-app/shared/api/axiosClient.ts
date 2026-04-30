import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.31.134.104:3002';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isProduction = false;

if (typeof process !== 'undefined' && process.env) {
  isProduction = process.env.NODE_ENV === 'production';
}

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isProduction) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    if (!isProduction) {
      console.error('[API Request Error]', error.message);
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (!isProduction) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (!isProduction) {
      const status = error.response?.status;
      const url = error.config?.url;
      console.error(`[API Error] ${status} - ${url}`, error.message);
    }

    if (error.response?.status === 401) {
      console.error('[API] Unauthorized - Token inválido o expirado');
    } else if (error.response?.status === 500) {
      console.error('[API] Error interno del servidor');
    } else if (error.code === 'ECONNABORTED') {
      console.error('[API] Timeout - La solicitud tardó demasiado');
    }

    return Promise.reject(error);
  }
);

export const API_BASE_URL = BASE_URL;