import type { AuthUser } from '../types/auth';
import { get, post } from './client';

const TOKEN_STORAGE_KEY = 'auth_token';

let inMemoryAccessToken: string | null = null;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

const readPersistedToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ??
    window.localStorage.getItem(TOKEN_STORAGE_KEY)
  );
};

export const initializeAccessToken = (): string | null => {
  inMemoryAccessToken = readPersistedToken();
  return inMemoryAccessToken;
};

export const getAccessToken = (): string | null => {
  if (inMemoryAccessToken) {
    return inMemoryAccessToken;
  }

  return initializeAccessToken();
};

export const setAccessToken = (token: string, persist = false): void => {
  inMemoryAccessToken = token;

  if (typeof window === 'undefined') {
    return;
  }

  if (persist) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const clearAccessToken = (): void => {
  inMemoryAccessToken = null;

  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return post<LoginResponse, LoginPayload>('/auth/login', payload);
};

export const getMyProfile = async (): Promise<AuthUser> => {
  return get<AuthUser>('/auth/me');
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<{ message: string }> => {
  return post<{ message: string }, ForgotPasswordPayload>(
    '/auth/forgot-password',
    payload,
  );
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<{ message: string }> => {
  return post<{ message: string }, ResetPasswordPayload>(
    '/auth/reset-password',
    payload,
  );
};
