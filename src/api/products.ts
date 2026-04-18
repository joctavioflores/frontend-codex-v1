import {
  createProductApiV1ProductsPost,
  deleteProductApiV1ProductsProductIdDelete,
  getProductApiV1ProductsProductIdGet,
  listProductsApiV1ProductsGet,
  updateProductApiV1ProductsProductIdPut,
} from '../generated/backend/openapi.client';
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../types/products';
import {
  fromProductRead,
  toCreateProductRequest,
  toUpdateProductRequest,
} from './adapters/products';

export const getProducts = async (): Promise<Product[]> => {
  const response = await listProductsApiV1ProductsGet();
  return response.map(fromProductRead);
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await getProductApiV1ProductsProductIdGet(id);
  return fromProductRead(response);
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const response = await createProductApiV1ProductsPost(
    toCreateProductRequest(payload),
  );
  return fromProductRead(response);
};

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const response = await updateProductApiV1ProductsProductIdPut(
    id,
    toUpdateProductRequest(payload),
  );
  return fromProductRead(response);
};

export const deleteProduct = (id: number): Promise<void> => {
  return deleteProductApiV1ProductsProductIdDelete(id);
};
