import {
  forgotPasswordApiV1AuthForgotPasswordPost,
  loginApiV1AuthLoginPost,
  meApiV1AuthMeGet,
  resetPasswordApiV1AuthResetPasswordPost,
} from '../generated/backend/openapi.client';
import type { AuthUser } from '../types/auth';
import {
  fromForgotPasswordResponse,
  fromTokenResponse,
  fromUserRead,
  toLoginRequest,
  toResetPasswordRequest,
  type ForgotPasswordPayload,
  type LoginPayload,
  type LoginResponse,
  type ResetPasswordPayload,
} from './adapters/auth';

const TOKEN_STORAGE_KEY = 'auth_token';

let inMemoryAccessToken: string | null = null;

export type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
};

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
  const response = await loginApiV1AuthLoginPost(toLoginRequest(payload));
  return fromTokenResponse(response);
};

export const getMyProfile = async (): Promise<AuthUser> => {
  const response = await meApiV1AuthMeGet();
  return fromUserRead(response);
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<{ message: string; resetToken?: string }> => {
  const response = await forgotPasswordApiV1AuthForgotPasswordPost(payload);
  return fromForgotPasswordResponse(response);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<{ message: string; resetToken?: string }> => {
  const response = await resetPasswordApiV1AuthResetPasswordPost(
    toResetPasswordRequest(payload),
  );
  return fromForgotPasswordResponse(response);
};
