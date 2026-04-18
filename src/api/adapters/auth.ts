import type {
  ForgotPasswordResponse,
  LoginRequest,
  ResetPasswordRequest,
  TokenResponse,
  UserRead,
} from '../../generated/backend/openapi.types';
import type { AuthUser } from '../../types/auth';

export interface LoginPayload extends LoginRequest {}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const toLoginRequest = (payload: LoginPayload): LoginRequest => {
  return payload;
};

export const toResetPasswordRequest = (
  payload: ResetPasswordPayload,
): ResetPasswordRequest => {
  return {
    token: payload.token,
    new_password: payload.password,
  };
};

export const fromTokenResponse = (response: TokenResponse): LoginResponse => {
  return {
    accessToken: response.access_token,
    tokenType: response.token_type ?? 'bearer',
  };
};

export const fromUserRead = (user: UserRead): AuthUser => {
  return {
    id: user.id,
    email: user.email,
    name: user.full_name,
    isActive: user.is_active,
  };
};

export const fromForgotPasswordResponse = (
  response: ForgotPasswordResponse,
): { message: string; resetToken?: string } => {
  return {
    message: response.message,
    ...(response.reset_token ? { resetToken: response.reset_token } : {}),
  };
};
