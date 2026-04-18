import { delete as remove, get, post, put } from './client';
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../types/products';

const PRODUCTS_ENDPOINT = '/products';

export const getProducts = (): Promise<Product[]> => {
  return get<Product[]>(PRODUCTS_ENDPOINT);
};

export const getProductById = (id: string): Promise<Product> => {
  return get<Product>(`${PRODUCTS_ENDPOINT}/${id}`);
};

export const createProduct = (
  payload: CreateProductPayload,
): Promise<Product> => {
  return post<Product, CreateProductPayload>(PRODUCTS_ENDPOINT, payload);
};

export const updateProduct = (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  return put<Product, UpdateProductPayload>(`${PRODUCTS_ENDPOINT}/${id}`, payload);
};

export const deleteProduct = (id: string): Promise<void> => {
  return remove<void>(`${PRODUCTS_ENDPOINT}/${id}`);
};
