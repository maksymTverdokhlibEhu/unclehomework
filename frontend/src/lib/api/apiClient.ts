/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { AppError } from './appError';

export class ApiClient {
  private axios: AxiosInstance;

  constructor(baseURL?: string, config?: AxiosRequestConfig) {
    const resolvedBase = baseURL ?? (import.meta as any).env?.VITE_API_BASE_URL ?? '';
    this.axios = axios.create({
      baseURL: resolvedBase,
      headers: { 'Content-Type': 'application/json' },
      ...config,
    });
  }

  public getInstance(): AxiosInstance {
    return this.axios;
  }

  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const resp = await this.axios.request<T>(config);
      return resp.data as T;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
        throw new AppError(err.message, status, data, err);
      }
      throw err;
    }
  }

  public get<T = any>(url: string, params?: any) {
    return this.request<T>({ method: 'GET', url, params });
  }

  public post<T = any>(url: string, data?: any) {
    return this.request<T>({ method: 'POST', url, data });
  }
}

export default ApiClient;
