// Generado desde /openapi.json del backend-codex-v1
// Rama fuente: feature/backend-python-integracion
// Fecha de generacion: 2026-04-17

export type BackendDecimalInput = number | string;
export type BackendDecimal = string;

export interface ValidationError {
  loc: Array<string | number>;
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[] | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type?: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  password: string;
}

export interface UserRead {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_token?: string | null;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ProductCreate {
  sku: string;
  name: string;
  description?: string | null;
  price: BackendDecimalInput;
  currency?: string;
}

export interface ProductUpdate {
  sku?: string | null;
  name?: string | null;
  description?: string | null;
  price?: BackendDecimalInput | null;
  currency?: string | null;
}

export interface ProductRead {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  price: BackendDecimal;
  currency?: string;
}

export interface QuoteItemCreate {
  product_id: number;
  quantity: number;
}

export interface QuoteItemRead {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: BackendDecimal;
  subtotal: BackendDecimal;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected';

export interface QuoteCreate {
  customer_name: string;
  customer_email: string;
  notes?: string | null;
  status?: QuoteStatus;
  items: QuoteItemCreate[];
}

export interface QuoteUpdate {
  customer_name: string;
  customer_email: string;
  notes?: string | null;
  status?: QuoteStatus;
  items: QuoteItemCreate[];
}

export interface QuoteRead {
  id: number;
  folio: string;
  customer_name: string;
  customer_email: string;
  notes?: string | null;
  status?: QuoteStatus;
  total: BackendDecimal;
  items: QuoteItemRead[];
}

export interface HealthcheckResponse {
  [key: string]: string;
}

export type RegisterApiV1AuthRegisterPostRequest = UserCreate;
export type RegisterApiV1AuthRegisterPostResponse = UserRead;

export type LoginApiV1AuthLoginPostRequest = LoginRequest;
export type LoginApiV1AuthLoginPostResponse = TokenResponse;

export type MeApiV1AuthMeGetResponse = UserRead;

export type ForgotPasswordApiV1AuthForgotPasswordPostRequest =
  ForgotPasswordRequest;
export type ForgotPasswordApiV1AuthForgotPasswordPostResponse =
  ForgotPasswordResponse;

export type ResetPasswordApiV1AuthResetPasswordPostRequest =
  ResetPasswordRequest;
export type ResetPasswordApiV1AuthResetPasswordPostResponse =
  ForgotPasswordResponse;

export type ListProductsApiV1ProductsGetResponse = ProductRead[];
export type CreateProductApiV1ProductsPostRequest = ProductCreate;
export type CreateProductApiV1ProductsPostResponse = ProductRead;
export type GetProductApiV1ProductsProductIdGetResponse = ProductRead;
export type UpdateProductApiV1ProductsProductIdPutRequest = ProductUpdate;
export type UpdateProductApiV1ProductsProductIdPutResponse = ProductRead;

export type ListQuotesApiV1QuotesGetResponse = QuoteRead[];
export type CreateQuoteApiV1QuotesPostRequest = QuoteCreate;
export type CreateQuoteApiV1QuotesPostResponse = QuoteRead;
export type GetQuoteApiV1QuotesQuoteIdGetResponse = QuoteRead;
export type UpdateQuoteApiV1QuotesQuoteIdPutRequest = QuoteUpdate;
export type UpdateQuoteApiV1QuotesQuoteIdPutResponse = QuoteRead;
export type GetQuotePdfApiV1QuotesQuoteIdPdfGetResponse = Blob;
