import type { AxiosRequestConfig } from 'axios';

import { apiClient } from '../../api/client';
import type {
  CreateProductApiV1ProductsPostRequest,
  CreateProductApiV1ProductsPostResponse,
  CreateQuoteApiV1QuotesPostRequest,
  CreateQuoteApiV1QuotesPostResponse,
  ForgotPasswordApiV1AuthForgotPasswordPostRequest,
  ForgotPasswordApiV1AuthForgotPasswordPostResponse,
  GetProductApiV1ProductsProductIdGetResponse,
  GetQuoteApiV1QuotesQuoteIdGetResponse,
  GetQuotePdfApiV1QuotesQuoteIdPdfGetResponse,
  HealthcheckResponse,
  ListProductsApiV1ProductsGetResponse,
  ListQuotesApiV1QuotesGetResponse,
  LoginApiV1AuthLoginPostRequest,
  LoginApiV1AuthLoginPostResponse,
  MeApiV1AuthMeGetResponse,
  RegisterApiV1AuthRegisterPostRequest,
  RegisterApiV1AuthRegisterPostResponse,
  ResetPasswordApiV1AuthResetPasswordPostRequest,
  ResetPasswordApiV1AuthResetPasswordPostResponse,
  UpdateProductApiV1ProductsProductIdPutRequest,
  UpdateProductApiV1ProductsProductIdPutResponse,
  UpdateQuoteApiV1QuotesQuoteIdPutRequest,
  UpdateQuoteApiV1QuotesQuoteIdPutResponse,
} from './openapi.types';

const request = async <TResponse>(
  config: AxiosRequestConfig,
): Promise<TResponse> => {
  const { data } = await apiClient.request<TResponse>(config);
  return data;
};

export const healthcheckApiV1HealthGet = (
  config?: AxiosRequestConfig,
): Promise<HealthcheckResponse> => {
  return request<HealthcheckResponse>({
    method: 'GET',
    url: '/api/v1/health',
    ...config,
  });
};

export const registerApiV1AuthRegisterPost = (
  payload: RegisterApiV1AuthRegisterPostRequest,
  config?: AxiosRequestConfig,
): Promise<RegisterApiV1AuthRegisterPostResponse> => {
  return request<RegisterApiV1AuthRegisterPostResponse>({
    method: 'POST',
    url: '/api/v1/auth/register',
    data: payload,
    ...config,
  });
};

export const loginApiV1AuthLoginPost = (
  payload: LoginApiV1AuthLoginPostRequest,
  config?: AxiosRequestConfig,
): Promise<LoginApiV1AuthLoginPostResponse> => {
  return request<LoginApiV1AuthLoginPostResponse>({
    method: 'POST',
    url: '/api/v1/auth/login',
    data: payload,
    ...config,
  });
};

export const meApiV1AuthMeGet = (
  config?: AxiosRequestConfig,
): Promise<MeApiV1AuthMeGetResponse> => {
  return request<MeApiV1AuthMeGetResponse>({
    method: 'GET',
    url: '/api/v1/auth/me',
    ...config,
  });
};

export const forgotPasswordApiV1AuthForgotPasswordPost = (
  payload: ForgotPasswordApiV1AuthForgotPasswordPostRequest,
  config?: AxiosRequestConfig,
): Promise<ForgotPasswordApiV1AuthForgotPasswordPostResponse> => {
  return request<ForgotPasswordApiV1AuthForgotPasswordPostResponse>({
    method: 'POST',
    url: '/api/v1/auth/forgot-password',
    data: payload,
    ...config,
  });
};

export const resetPasswordApiV1AuthResetPasswordPost = (
  payload: ResetPasswordApiV1AuthResetPasswordPostRequest,
  config?: AxiosRequestConfig,
): Promise<ResetPasswordApiV1AuthResetPasswordPostResponse> => {
  return request<ResetPasswordApiV1AuthResetPasswordPostResponse>({
    method: 'POST',
    url: '/api/v1/auth/reset-password',
    data: payload,
    ...config,
  });
};

export const listProductsApiV1ProductsGet = (
  config?: AxiosRequestConfig,
): Promise<ListProductsApiV1ProductsGetResponse> => {
  return request<ListProductsApiV1ProductsGetResponse>({
    method: 'GET',
    url: '/api/v1/products',
    ...config,
  });
};

export const createProductApiV1ProductsPost = (
  payload: CreateProductApiV1ProductsPostRequest,
  config?: AxiosRequestConfig,
): Promise<CreateProductApiV1ProductsPostResponse> => {
  return request<CreateProductApiV1ProductsPostResponse>({
    method: 'POST',
    url: '/api/v1/products',
    data: payload,
    ...config,
  });
};

export const getProductApiV1ProductsProductIdGet = (
  productId: number,
  config?: AxiosRequestConfig,
): Promise<GetProductApiV1ProductsProductIdGetResponse> => {
  return request<GetProductApiV1ProductsProductIdGetResponse>({
    method: 'GET',
    url: `/api/v1/products/${productId}`,
    ...config,
  });
};

export const updateProductApiV1ProductsProductIdPut = (
  productId: number,
  payload: UpdateProductApiV1ProductsProductIdPutRequest,
  config?: AxiosRequestConfig,
): Promise<UpdateProductApiV1ProductsProductIdPutResponse> => {
  return request<UpdateProductApiV1ProductsProductIdPutResponse>({
    method: 'PUT',
    url: `/api/v1/products/${productId}`,
    data: payload,
    ...config,
  });
};

export const deleteProductApiV1ProductsProductIdDelete = (
  productId: number,
  config?: AxiosRequestConfig,
): Promise<void> => {
  return request<void>({
    method: 'DELETE',
    url: `/api/v1/products/${productId}`,
    ...config,
  });
};

export const listQuotesApiV1QuotesGet = (
  config?: AxiosRequestConfig,
): Promise<ListQuotesApiV1QuotesGetResponse> => {
  return request<ListQuotesApiV1QuotesGetResponse>({
    method: 'GET',
    url: '/api/v1/quotes',
    ...config,
  });
};

export const createQuoteApiV1QuotesPost = (
  payload: CreateQuoteApiV1QuotesPostRequest,
  config?: AxiosRequestConfig,
): Promise<CreateQuoteApiV1QuotesPostResponse> => {
  return request<CreateQuoteApiV1QuotesPostResponse>({
    method: 'POST',
    url: '/api/v1/quotes',
    data: payload,
    ...config,
  });
};

export const getQuoteApiV1QuotesQuoteIdGet = (
  quoteId: number,
  config?: AxiosRequestConfig,
): Promise<GetQuoteApiV1QuotesQuoteIdGetResponse> => {
  return request<GetQuoteApiV1QuotesQuoteIdGetResponse>({
    method: 'GET',
    url: `/api/v1/quotes/${quoteId}`,
    ...config,
  });
};

export const updateQuoteApiV1QuotesQuoteIdPut = (
  quoteId: number,
  payload: UpdateQuoteApiV1QuotesQuoteIdPutRequest,
  config?: AxiosRequestConfig,
): Promise<UpdateQuoteApiV1QuotesQuoteIdPutResponse> => {
  return request<UpdateQuoteApiV1QuotesQuoteIdPutResponse>({
    method: 'PUT',
    url: `/api/v1/quotes/${quoteId}`,
    data: payload,
    ...config,
  });
};

export const deleteQuoteApiV1QuotesQuoteIdDelete = (
  quoteId: number,
  config?: AxiosRequestConfig,
): Promise<void> => {
  return request<void>({
    method: 'DELETE',
    url: `/api/v1/quotes/${quoteId}`,
    ...config,
  });
};

export const getQuotePdfApiV1QuotesQuoteIdPdfGet = async (
  quoteId: number,
  config?: AxiosRequestConfig,
): Promise<GetQuotePdfApiV1QuotesQuoteIdPdfGetResponse> => {
  const { data } = await apiClient.request<GetQuotePdfApiV1QuotesQuoteIdPdfGetResponse>({
    method: 'GET',
    url: `/api/v1/quotes/${quoteId}/pdf`,
    responseType: 'blob',
    ...config,
  });

  return data;
};
