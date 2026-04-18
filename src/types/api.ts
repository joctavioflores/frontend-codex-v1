export interface ApiErrorResponse {
  message?: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiRequestConfig {
  signal?: AbortSignal;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}
